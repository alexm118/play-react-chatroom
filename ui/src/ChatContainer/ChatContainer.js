import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chatlog from '../Chatlog/Chatlog';
import Chatbox from '../Chatbox/Chatbox';
import RoomList from '../RoomList/RoomList';
import { Row, Col } from 'react-flexbox-grid';

export default class ChatContainer extends Component {

    constructor(props){
        super(props)
        this.state = {
            messages: [],
            websocket: this.createWebsocket()
        }
    }

    createWebsocket = () => {
        let websocketUrl;
        if(process.env.NODE_ENV === "development"){
            websocketUrl = "ws://localhost:9000/rooms/chat/general"
        } else {
            websocketUrl = "wss://play-react-chatroom.herokuapp.com/rooms/chat/general"
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
        messages.push(JSON.parse(message.data))
        this.setState({messages: messages})
        console.log(this.state.messages)
    }

    render(){
       return ( 
       <div>
           <Row>
                <Col xs={3}>
                    <RoomList user={this.props.user} />
                </Col>
                <Col xs={9}>
                    <Chatlog messages={this.state.messages} />
                </Col>
            </Row>
            <Row>
                <Col xsOffset={3} xs={9} >
                    <Chatbox websocket={this.state.websocket} username={this.props.user.username} />
                </Col>
            </Row>
        </div>
       )
    }
}

ChatContainer.propTypes = {
    user: PropTypes.object.isRequired
}
