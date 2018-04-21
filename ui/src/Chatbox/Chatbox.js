import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import './Chatbox.css';

export default class Chatbox extends PureComponent {

    constructor(props){
        super(props)
        this.state = {
            message: ""
        }
    }

    sendMessage = () => {
        this.props.websocket.send(JSON.stringify({username: this.props.username, message: this.state.message}))
        this.setState({message: ""});
    }

    disableButton = () => this.state.message === "" ? true : false;

    handleKeyInput = (event) => {
        if(event.which === 13 || event.keyCode === 13){
            event.preventDefault();
            this.sendMessage()
        }
    }

    render(){
        return (
            <div>
                <TextField multiLine={true}
                    rows={1}
                    rowsMax={4}
                    onChange={(e) => this.setState({message: e.target.value})}
                    value={this.state.message}
                    onKeyDown={this.handleKeyInput}
                    className="chatbox"
                    id="chat-field"
                />
                <RaisedButton 
                    label="Send"
                    primary={true}
                    disabled={this.disableButton()}
                    onClick={() => this.sendMessage()} 
                />
            </div>
        )
    };
}

Chatbox.propTypes = {
    websocket: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired
}