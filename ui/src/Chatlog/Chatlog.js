import React, { Component  } from 'react'
import Paper from 'material-ui/Paper';

const messageStyle = {
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: 25,
    marginBottom: 25,
    padding: 5,
    display: 'inline-block'
}

const scrollContainer = {
    maxHeight: '80vh',
    overflow: 'scroll'
}

export default class Chatlog extends Component {

    constructor(props){
        super(props)
        this.state = {
            messages: [
                { username: "admin", message: "this is a test message" }
            ]
        }
    }

    componentDidMount(){
        let websocketUrl;
        if(process.env.NODE_ENV === "development"){
            websocketUrl = "ws://localhost:9000/message"
        } else {
            websocketUrl = "wss://play-react-chatroom.herokuapp.com/message"
        }
        this.websocket = new WebSocket(websocketUrl)
        this.websocket.onopen = () => {
            console.log("Connected to Websocket")
            this.sendMessage("Hello World")
        }
        this.websocket.onerror = () => console.log("Error with Websocket")
        this.websocket.onmessage = (message) => this.receiveMessage(message)
        this.websocket.onclose = () => console.log("Closed connection to Websocket")
    }

    receiveMessage = (message) => {
        console.log(message.data)
        let messages = this.state.messages
        messages.push({username: "admin", message: message.data})
        this.setState({messages: messages})
        console.log(this.state.messages)
    }

    sendMessage = (message) => this.websocket.send(message)

    renderMessage = (message, index) => {
        return (
            <Paper style={messageStyle} key={index}>
                <p>{message.username}: {message.message}</p>
            </Paper>
            )
    }

    render(){
        return (
            <div>
                <div style={scrollContainer} >
                    {this.state.messages.map(this.renderMessage)}
                </div>
                <div>
                    <p>Chatroom</p>
                </div>
            </div>
        )
    }
}