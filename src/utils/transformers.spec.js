import { expect } from 'chai';
import * as transformers from './transformers';
import _ from 'lodash';

const ips = {
  '254.223.75.186' : {
    'ip': '254.223.75.186',
    'owner': 'ACME Corp',
    'servers': {
      'webServerCount': 2,
      'mailServerCount': 3,
      'ftpServerCount': 4
    },
    'viruses': {
      'trojan': 2,
      'bot': 3,
      'spam': 4
    }
  },
  '192.168.1.1' : {
    'ip': '192.168.1.1',
    'owner': 'ACME Corp',
    'servers': {
      'webServerCount': 3,
      'mailServerCount': 4,
      'ftpServerCount': 5
    },
    'viruses': {
      'trojan': 3,
      'bot': 4,
      'spam': 5
    }
  }
}

describe('Transformers', () => {
  describe('ipsToThreats', () => {

    const threatTypes = ['trojan', 'bot', 'spam'];

    it('root array should have one item per threat type', () => {
      const actual = transformers.ipsToThreats( _.values(ips), threatTypes);
      expect(actual.length).to.equal(threatTypes.length);
    })

    it('each threat group, first item should have x correspond to ip and y correspond to threat type', () => {
      const threatTypeGroups = transformers.ipsToThreats( _.values(ips), threatTypes);

      threatTypes.forEach( (tt, i) => {
        expect(threatTypeGroups[i][0].x).to.equal('254.223.75.186');
        expect(threatTypeGroups[i][0].y).to.equal(ips['254.223.75.186'].viruses[tt]);
        expect(threatTypeGroups[i][0]).to.have.all.keys(['x','y']);
      })
    })

    it('second ip', () => {
      const threatTypeGroups = transformers.ipsToThreats(ips, threatTypes);
      threatTypes.forEach( (tt, i) => {
        expect(threatTypeGroups[i][1].x).to.equal('192.168.1.1');
        expect(threatTypeGroups[i][1].y).to.equal(ips['192.168.1.1'].viruses[tt]);
        expect(threatTypeGroups[i][1]).to.have.all.keys(['x','y']);
      })
    })

    it('should stack for stacked bar', () => {
      const threatTypeGroups = transformers.ipsToThreats(ips, threatTypes);
      const stacked = transformers.stack(threatTypeGroups);
      expect(stacked[0][1]).to.contain.key('y0');
    });

    it('should invert for horizontal bar', () => {
      const threatTypeGroups = transformers.ipsToThreats(ips, threatTypes);
      const inverted = transformers.invert(threatTypeGroups);
      expect(inverted[0][1].y).to.equal('192.168.1.1');
      expect(inverted[0][1].x).to.equal(ips['192.168.1.1'].viruses['trojan']);
      expect(inverted[0][1]).to.not.contain.key('x0');
    });

    it('should stack and invert for horizontal stacked bar', () => {
      const threatTypeGroups = transformers.ipsToThreats(ips, threatTypes);
      const inverted = transformers.invert( transformers.stack(threatTypeGroups) );
      expect(inverted[0][1].y).to.equal('192.168.1.1');
      expect(inverted[0][1].x).to.equal(ips['192.168.1.1'].viruses['trojan']);
      expect(inverted[0][1]).to.contain.key('x0');
    });

    it('should stack and invert conveniently', () => {
      const threatTypeGroups = transformers.ipsToThreats(ips, threatTypes);
      const inverted = transformers.stackAndInvert( threatTypeGroups);
      expect(inverted[0][1].y).to.equal('192.168.1.1');
      expect(inverted[0][1].x).to.equal(ips['192.168.1.1'].viruses['trojan']);
      expect(inverted[0][1]).to.contain.key('x0');
    });
  })
})
