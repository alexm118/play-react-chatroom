import React, { Component } from 'react';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import './RoomList.css'

export default class RoomList extends Component {

    constructor(props){
        super(props);
        this.state = {
            rooms: []
        }
    }

    componentDidMount(){
        this.fetchRooms();
    }

    fetchRooms(){
        fetch('/rooms', {
            method: 'GET', 
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        }).then(
            response => response.json().then(
                rooms => this.setState({rooms: rooms})
            )
        ).catch(
            error => console.log("Error fetching rooms")
        );
    }

    renderRoom(room){
        return (
            <ListItem primaryText={room.name} leftIcon={<CommunicationChatBubble />} />
        );
    }

    render(){
        return (
            <Paper className="roomlist" >
                <List>
                    {this.state.rooms.map(this.renderRoom)}
                </List>
            </Paper>
        );
    }
}