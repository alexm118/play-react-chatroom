import React, { Component  } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import './Chatlog.css'

export default class Chatlog extends Component {

    renderMessage = (message, index) => {
        return (
                <p key={index}>{message.username}: {message.message}</p>
            )
    }

    scrollToBottom = () => this.bottomOfChat.scrollIntoView({behavior: 'smooth'});

    componentDidMount(){
        this.scrollToBottom();
    }

    componentDidUpdate(){
        this.scrollToBottom();
    }

    render(){
        return (
            <div>
                <Paper className="message-box">
                    <p>Welcome to the chatroom!</p>
                    {this.props.messages.map(this.renderMessage)}
                    <div ref={(el) => {this.bottomOfChat = el;} } />
                </Paper>
            </div>
        )
    }
}

Chatlog.propTypes = {
    messages: PropTypes.array.isRequired
}
