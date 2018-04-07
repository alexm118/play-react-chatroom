import React, { Component } from 'react';
import Chatlog from '../Chatlog/Chatlog';
import Chatbox from '../Chatbox/Chatbox';

export default class ChatContainer extends Component {

    constructor(props){
        super(props)
        this.state = {
            messages: [
                { username: "admin", message: "this is a test message" }
            ]
        }
        this.websocket = this.createWebsocket();
    }

    createWebsocket = () => {
        let websocketUrl;
        if(process.env.NODE_ENV === "development"){
            websocketUrl = "ws://localhost:9000/message"
        } else {
            websocketUrl = "wss://play-react-chatroom.herokuapp.com/message"
        }
        this.websocket = new WebSocket(websocketUrl)
        this.websocket.onopen = () => {
            console.log("Connected to Websocket")
        }
        this.websocket.onerror = () => console.log("Error with Websocket")
        this.websocket.onmessage = (message) => this.receiveMessage(message)
        this.websocket.onclose = () => console.log("Closed connection to Websocket")
        return this.websocket;
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
            <Chatbox websocket={this.websocket} />
        </div>
       )
    }
}