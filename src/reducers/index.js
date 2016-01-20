import _ from 'lodash';
import { combineReducers } from 'redux';

const initialState = {
    ips: {}
};

function entities(state = initialState, action) {
  if (action.entities) {
    return _.merge({}, state, action.entities);
  } else if ( action.type === 'RESET') {
    console.log('resetting state', state);
    return {ips:{}};
  }

  return state;
}

const ips = (state=initialState, action) => {
  switch(action.type) {
    case 'ADD_IPS':
      return [...action.ips, ...state];
    case 'RESET':
      return [];
    default:
      return state;
  }
}

const selectedIp = (state=null, action) => {
  switch(action.type) {
    case 'IP_SELECTED':
      return action.ip;
    case 'RESET':
      return null;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  entities,
  ips,
  selectedIp
})

export default rootReducer
