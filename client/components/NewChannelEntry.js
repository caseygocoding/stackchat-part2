import React, { Component } from 'react';
import { connect } from 'react-redux';
import { writeChannel, postChannel } from '../store';

const mapStateToProps = (state) => {
  return {
    newChannelEntry: state.newChannelEntry,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleChange(event) {
      const input = event.target.value;
      const action = writeChannel(input);
      dispatch(action);
    },

    handleSumbit(event) {
      event.preventDefault();
      const name = event.target.channelName.value;
      const action = postChannel({ name }, ownProps.history)
      dispatch(action)
    }
  }
}

function NewChannelEntry (props) {
  return (
    <form onSubmit={props.handleSumbit}>
      <div className="form-group">
        <label htmlFor="name">Create a Channel</label>
        <input
          value={props.newChannelEntry}
          onChange={props.handleChange}
          className="form-control"
          type="text"
          name="channelName"
          placeholder="Enter channel name" />
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-default">Create Channel</button>
      </div>
    </form>
  );
}

const Container = connect(mapStateToProps, mapDispatchToProps)(NewChannelEntry) ;
export default Container;

/** Write your `connect` component below! **/
