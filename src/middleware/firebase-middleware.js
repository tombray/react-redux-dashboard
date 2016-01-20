import { normalize, Schema, arrayOf } from 'normalizr';
import Chance from 'chance';
import Rx from 'rx';
import _ from 'lodash';

const ip = new Schema('ips', { idAttribute: 'ip' });

const randomViruses = () => {
  const chance = new Chance();
  const trojan = chance.integer({min: 0, max: 50});
  const bot = chance.integer({min: 0, max: 40});
  const spam = chance.integer({min: 0, max: 30});
  return { trojan, bot, spam };
}

const randomServers = () => {
  const chance = new Chance();
  const web = chance.integer({min: 0, max: 20});
  const ftp = chance.integer({min: 0, max: 20});
  const mail = chance.integer({min: 0, max: 20});
  return { web, ftp, mail };
}

const randomIp = () => {
  const viruses = randomViruses();
  const { trojan, bot, spam } = viruses;
  const totalViruses = trojan + bot + spam;
  const servers = randomServers();
  const { web, ftp, mail } = servers;
  const totalServers = web + ftp + mail;

  return {
    ip: chance.ip(),
    owner: chance.name(),
    location:{
      lat: chance.latitude(),
      long: chance.longitude()
    },
    servers,
    viruses,
    totalViruses,
    totalServers
  }
}

const pushTwoIpsToFirebase = (firebaseRef) => firebaseRef.push([ randomIp(), randomIp()]);

export default function createFirebaseMiddleware(firebaseRef) {

  return store => {

    const source = Rx.Observable.create( (observer) => {

        firebaseRef.child('events').on('child_added', (childSnapshot) => {
          observer.next( childSnapshot.val() )
        });

        firebaseRef.on('child_removed', () => store.dispatch({type:'RESET'}));
      }

    )
    .bufferWithTimeOrCount(5, 500)
    .filter( (buff) => buff.length > 0);

    const subscription = source.subscribe(
      (ipMessages) => {
        const normalized = normalize({ ips: _.flatten(ipMessages) }, { ips: arrayOf(ip) });
        const action = {type:'ADD_IPS', entities: normalized.entities, ips: normalized.result.ips};
        console.log('Received IPS from server, dispatching:', action);
        store.dispatch(action);
      },
      error => console.log(error)
    );

    const ipCount = () => store.getState().ips.length;

    setInterval(() => {
      if ( ipCount() < 2000 ) {
        pushTwoIpsToFirebase(firebaseRef.child('events'));
      }
    }, 5000)

    pushTwoIpsToFirebase(firebaseRef.child('events'));

    return next => action => {
      return next(action);
    }
  }
}
