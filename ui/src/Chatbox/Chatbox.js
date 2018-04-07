import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const chatboxStyle = {
    width: '80%',
    marginLeft: '5%'
};

const sendButtonStyle = {
    width: '10%'
}

export default class Chatbox extends PureComponent {

    constructor(props){
        super(props)
        this.state = {
            message: ""
        }
    }

    sendMessage = () => {
        this.props.websocket.send(this.state.message)
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
                    rows={2}
                    rowsMax={4}
                    onChange={(e) => this.setState({message: e.target.value})}
                    value={this.state.message}
                    style={chatboxStyle}
                    onKeyDown={this.handleKeyInput}
                    id="chat-field"
                />
                <RaisedButton 
                    label="Send"
                    primary={true}
                    disabled={this.disableButton()}
                    onClick={() => this.sendMessage()} 
                    onKeyDown={this.handleKeyInput}
                    style={sendButtonStyle}
                />
            </div>
        )
    };
}

Chatbox.propTypes = {
    websocket: PropTypes.object.isRequired
}