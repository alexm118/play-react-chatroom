import React, { Component  } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';

const messageStyle = {
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: 25,
    marginBottom: 25,
    padding: 5,
    display: 'inline-block',
    minHeight: '75vh'
}

const scrollContainer = {
    maxHeight: '80vh',
    overflow: 'scroll'
}

export default class Chatlog extends Component {

    renderMessage = (message, index) => {
        return (
                <p key={index}>{message.username}: {message.message}</p>
            )
    }

    render(){
        return (
            <div>
                <div style={scrollContainer} >
                    <Paper style={messageStyle}>
                        <p>Welcome to the chatroom!</p>
                        {this.props.messages.map(this.renderMessage)}
                    </Paper>
                </div>
            </div>
        )
    }
}

Chatlog.propTypes = {
    messages: PropTypes.array.isRequired
}
