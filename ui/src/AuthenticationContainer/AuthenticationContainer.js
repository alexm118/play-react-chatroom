import React, { PureComponent } from 'react'
import Login from '../Login/Login'
import Signup from '../Signup/Signup'
import ChatContainer from '../ChatContainer/ChatContainer';

export default class AuthenticationContainer extends PureComponent {

    constructor(props){
        super(props)
        this.state = {
            isLoggedIn: false,
            newUser: false,
            username: null
        }
    }

    signUpClicked = () => {
        this.setState({newUser: true})
    }

    cancelClicked = () => {
        this.setState({newUser: false})
    }

    loginSuccess = (username) => {
        this.setState({isLoggedIn: true, username: username})
    }

    createAccountSuccess = () => {
        this.setState({
            newUser: false,
            isLoggedIn: true
        })
    }

    renderContent = () => {
        if(this.state.newUser){
            return <Signup cancelClicked={this.cancelClicked} createAccountSuccess={this.createAccountSuccess} />
        } else if(!this.state.isLoggedIn) {
            return <Login signUpClicked={this.signUpClicked} loginSuccess={this.loginSuccess} />
        } else {
            return <ChatContainer username={this.state.username} />
        }
    }

    render(){
        return this.renderContent()
    }

}