import React, { PureComponent } from 'react'
import Login from '../Login/Login'
import Signup from '../Signup/Signup'
import Chatlog from '../Chatlog/Chatlog'

export default class AuthenticationContainer extends PureComponent {

    constructor(props){
        super(props)
        this.state = {
            isLoggedIn: false,
            newUser: false
        }
    }

    signUpClicked = () => {
        this.setState({newUser: true})
    }

    cancelClicked = () => {
        this.setState({newUser: false})
    }

    loginSuccess = () => {
        this.setState({isLoggedIn: true})
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
            return <Chatlog />
        }
    }

    render(){
        return this.renderContent()
    }

}