import 'babel-polyfill';
import React, { Component } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import DashboardApp from './DashboardApp';
import createFirebaseMiddleware from './middleware/firebase-middleware';
import Firebase from 'firebase';

const firebaseMiddleware = createFirebaseMiddleware(new Firebase('https://react-redux-firebase.firebaseio.com'));
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, firebaseMiddleware)(createStore);
const store = createStoreWithMiddleware(rootReducer);

export default class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <DashboardApp dispatch={store.dispatch}/>
        </Provider>
      </div>
    );
  }
}
