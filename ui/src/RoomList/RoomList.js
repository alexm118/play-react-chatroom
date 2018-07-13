import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
        fetch(`/users/${this.props.user.user_id}/rooms`, {
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

    renderRoom = (room) => {
        if(this.props.selectedRoom === room.name){
            return (
                <div style={{backgroundColor: `#DCDCDC`}} key={room.room_id}>
                    <ListItem primaryText={room.name} leftIcon={<CommunicationChatBubble />} onClick={() => this.props.selectRoom(room.name)} />
                </div>
            )
        } else {
            return (
                <ListItem key={room.room_id} primaryText={room.name} leftIcon={<CommunicationChatBubble />} onClick={() => this.props.selectRoom(room.name)} />
            );
        }
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

RoomList.propTypes = {
    user: PropTypes.object.isRequired,
    selectedRoom: PropTypes.string.isRequired,
    selectRoom: PropTypes.func.isRequired
};
