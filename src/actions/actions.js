import fetch from 'isomorphic-fetch';

export function reset() {
  return dispatch => {
    return fetch('https://react-redux-firebase.firebaseio.com/events.json', {method: 'delete'})
      .then( (res) => console.log(res))
  }
}
