import expect from 'expect';
import rootReducer from './index';
import { combineReducers } from 'redux';

describe('Reducers', () => {
  it('should merge added ips', () => {
    const action = {
      type:'ADD_IPS',
      entities: {
        ips: {
          '12.12.12.12': { ip: '12.12.12.12' },
          '12.12.12.13': { ip: '12.12.12.13' }
        }
      },
      ips: [ '12.12.12.12', '12.12.12.13' ]
    }

    const stateBefore = {
      ips: ['12.12.12.11'],
      entities: {
        ips: {
          '12.12.12.11': {}
        }
      }
    };

    const actual = rootReducer(stateBefore, action);

    const expected = {
      entities: {
        ips: {
          '12.12.12.12': { ip: '12.12.12.12' },
          '12.12.12.13': { ip: '12.12.12.13' },
          '12.12.12.11': {}
        }
      },
      ips: [ '12.12.12.12', '12.12.12.13', '12.12.12.11' ]
    }

    expect(actual.entities).toEqual(expected.entities);
  });
})
