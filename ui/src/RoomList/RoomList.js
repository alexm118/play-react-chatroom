import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Person from 'material-ui/svg-icons/social/person-outline';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import './RoomList.css'

export default class RoomList extends Component {

    constructor(props){
        super(props);
        this.state = {
            rooms: [],
            usersInRoom: {}
        }
    }

    componentDidMount(){
        this.fetchRooms();
        setInterval(this.getUsersForRooms, 5000);
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
                rooms => {
                    this.setState({rooms: rooms})
                    this.getUsersForRooms();
                }
            )
        ).catch(
            error => console.log("Error fetching rooms")
        );
    }

    updateUsersInRoom(roomName, users){
        const usersInRoom = this.state.usersInRoom;
        usersInRoom[roomName] = users;
        this.setState({usersInRoom: usersInRoom});
    }

    fetchUsersForRoom(roomName){
        fetch(`/rooms/${roomName}/users`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                }
            }).then(
                response => response.json().then(
                    users => this.updateUsersInRoom(roomName, users)
                )
        ).catch(
            error => console.log(`Error fetching users for ${roomName}`)
        );
    }

    changeRoom = (roomName) => {
        this.props.selectRoom(roomName);
        this.fetchUsersForRoom(roomName);
    }

    getUsersForRooms = () => {
        this.state.rooms.forEach(room => this.fetchUsersForRoom(room.name))
    }

    renderUsersInRoom = (roomName) => {
        const usersInRoom = this.state.usersInRoom[roomName]
        if(usersInRoom != undefined && usersInRoom != null){
            return usersInRoom.map((username, index) => <ListItem key={index} primaryText={username} leftIcon={<Person/>}/>)
        }
    }

    renderRoom = (room) => {
        if(this.props.selectedRoom === room.name){
            const nestedItems = this.renderUsersInRoom(room.name)
            return (
                <div style={{backgroundColor: `#DCDCDC`}} key={room.room_id}>
                    <ListItem primaryText={room.name}
                              leftIcon={<CommunicationChatBubble />}
                              nestedItems={nestedItems}
                              initiallyOpen={true} />
                </div>
            )
        } else {
            return (
                <ListItem key={room.room_id}
                          primaryText={room.name}
                          leftIcon={<CommunicationChatBubble />}
                          onClick={() => this.changeRoom(room.name)} />
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
