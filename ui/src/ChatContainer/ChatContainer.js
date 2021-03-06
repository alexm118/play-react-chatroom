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
            websocket: this.createWebsocket("general"),
            selectedRoom: "general"
        }
    }

    createWebsocket = (room) => {
        let websocketUrl;
        if(process.env.NODE_ENV === "development"){
            websocketUrl = `ws://localhost:9000/rooms/chat/${room}?userName=${this.props.user.username}`
        } else {
            websocketUrl = `wss://play-react-chatroom.herokuapp.com/rooms/chat/${room}?userName=${this.props.user.username}`
        }
        let websocket = new WebSocket(websocketUrl)
        websocket.onopen = () => {
            console.log(`Connected to ${room}`)
        }
        websocket.onerror = () => console.log("Error with Websocket")
        websocket.onmessage = (message) => this.receiveMessage(message)
        websocket.onclose = () => {
            console.log(`Closed connection to ${room}`)
            if(this.state.selectedRoom === room){
                this.setState({websocket: this.createWebsocket(room)})
            }
        }
        return websocket;
    }

    receiveMessage = (message) => {
        let messages = this.state.messages
        messages.push(JSON.parse(message.data))
        this.setState({messages: messages})
        console.log(this.state.messages)
    }

    selectRoom = (roomName) => {
        this.setState({selectedRoom: roomName})
        this.state.websocket.close();
        console.log(`selected ${roomName}`)
        this.setState({messages: []})
        this.setState({websocket: this.createWebsocket(roomName)})
    }

    render(){
       return ( 
       <div>
           <Row>
                <Col xs={3}>
                    <RoomList user={this.props.user} selectedRoom={this.state.selectedRoom} selectRoom={this.selectRoom} />
                </Col>
                <Col xs={9}>
                    <Chatlog messages={this.state.messages} roomName={this.state.selectedRoom} />
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
