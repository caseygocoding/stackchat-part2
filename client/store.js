import axios from 'axios';
import { createStore, applyMiddleware } from 'redux';
import loggingMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import socket from './socket';

// INITIAL STATE

const initialState = {
  messages: [],
  name: 'Reggie',
  newMessageEntry: '',
  channels: [],
  newChannelEntry: '',
};

// ACTION TYPES

const UPDATE_NAME = 'UPDATE_NAME';
const GET_MESSAGE = 'GET_MESSAGE';
const GET_MESSAGES = 'GET_MESSAGES';
const WRITE_MESSAGE = 'WRITE_MESSAGE';
const GET_CHANNELS = 'GET_CHANNELS';
const WRITE_CHANNEL = 'WRITE_CHANNEL';
const GET_CHANNEL = 'GET_CHANNEL';

// ACTION CREATORS
export function getChannel (channel) {
  const action = { type: GET_CHANNEL, channel }
  return action;
}

export function writeChannel (newChannel) {
  const action = { type: WRITE_CHANNEL, newChannel}
  return action;
}


export function getChannels(channels){
  const action = { type: GET_CHANNELS, channels };
  return action;
}

export function updateName (name) {
  const action = { type: UPDATE_NAME, name };
  return action;
}

export function getMessage (message) {
  const action = { type: GET_MESSAGE, message };
  return action;
}

export function getMessages (messages) {
  const action = { type: GET_MESSAGES, messages };
  return action;
}

export function writeMessage (content) {
  const action = { type: WRITE_MESSAGE, content };
  return action;
}

// THUNK CREATORS
export function postChannel (channel, history) {
  return function thunk (dispatch) {
    return axios.post('/api/channels', channel)
    .then(res => res.data)
    .then(newChannel => {
      const action = getChannel(newChannel);
      dispatch(action);
      socket.emit('new-channel', newChannel);
      history.push(`/channels/${newChannel.id}`)
    })
  }
}
export function fetchChannels(){
  return function thunk(dispatch){
    return axios.get('/api/channels')
    .then(res => res.data)
    .then(channels => {
      console.log('what is channels', channels)
      const action = getChannels(channels);
      dispatch(action);
    });
  };
}

export function fetchMessages () {
  return function thunk (dispatch) {
     return axios.get('/api/messages')
      .then(res => res.data)
      .then(messages => {
        const action = getMessages(messages);
        dispatch(action);
      });
  };
}

export function postMessage (message) {
  return function thunk (dispatch) {
    return axios.post('/api/messages', message)
      .then(res => res.data)
      .then(newMessage => {
        const action = getMessage(newMessage);
        dispatch(action);
        socket.emit('new-message', newMessage);
      });
  };
}

// REDUCER

/**
 * Whoa! What is this { ...state } business?!?
 * This is the spread operator like we've seen before - but this time, we're using it with an Object!
 * When we use the spread operator on an object, it extracts all of the key-value pairs on that object into a new object!
 * Sound familiar? It acts like Object.assign!
 *
 * For example:
 *
 *    const obj1 = { a: 1 };
 *    const obj2 = { ...obj1, b: 2  }
 *    console.log(obj2) // { a: 1, b: 2 }
 *
 * This is the same result we would have gotten if we had said:
 *
 *    const obj2 = Object.assign({}, obj1, { b: 2 })
 *
 * However, it's much less verbose!
 * Is there anything the spread operator DOESN'T do?!?
 *
 * Note: this is still an experimental language feature (though it is on its way to becoming official).
 * We can use it now because we are using a special babel plugin with webpack (babel-preset-stage-2)!
 */
function reducer (state = initialState, action) {

  switch (action.type) {

    case UPDATE_NAME:
      return {
        ...state,
        name: action.name
      };

    case GET_MESSAGES:
      return {
        ...state,
        messages: action.messages
      };

    case GET_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.message]
      };

    case WRITE_MESSAGE:
      return {
        ...state,
        newMessageEntry: action.content
      };

    case GET_CHANNELS:
      return {
        ...state,
        channels: action.channels
      };

      case WRITE_CHANNEL:
        return {
          ...state,
          newChannelEntry: action.newChannel
        };

      case GET_CHANNEL:
        return {
          ...state,
          channels: [...state.channels, action.channel]
        }

    default:
      return state;
  }

}

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(
    thunkMiddleware,
    loggingMiddleware
  ))
);

export default store;
