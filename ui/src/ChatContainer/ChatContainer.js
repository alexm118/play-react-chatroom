import React, { Component } from 'react';
import Chatlog from '../Chatlog/Chatlog';
import Chatbox from '../Chatbox/Chatbox';

export default class ChatContainer extends Component {

    constructor(props){
        super(props)
        this.state = {
            messages: [
                { username: "admin", message: "this is a test message" }
            ],
            websocket: this.createWebsocket()
        }
        // this.websocket = this.createWebsocket();
    }

    createWebsocket = () => {
        let websocketUrl;
        if(process.env.NODE_ENV === "development"){
            websocketUrl = "ws://localhost:9000/message"
        } else {
            websocketUrl = "wss://play-react-chatroom.herokuapp.com/message"
        }
        let websocket = new WebSocket(websocketUrl)
        websocket.onopen = () => {
            console.log("Connected to Websocket")
        }
        websocket.onerror = () => console.log("Error with Websocket")
        websocket.onmessage = (message) => this.receiveMessage(message)
        websocket.onclose = () => {
            console.log("Closed connection to Websocket")
            this.setState({websocket: this.createWebsocket()});
        }
        return websocket;
    }

    receiveMessage = (message) => {
        let messages = this.state.messages
        messages.push({username: "admin", message: message.data})
        this.setState({messages: messages})
        console.log(this.state.messages)
    }

    render(){
       return ( 
       <div>
            <Chatlog messages={this.state.messages} />
            <Chatbox websocket={this.state.websocket} />
        </div>
       )
    }
}