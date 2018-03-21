import React, { PureComponent } from 'react'
import Login from '../Login/Login'
import Signup from '../Signup/Signup'

export default class AuthenticationContainer extends PureComponent {

    constructor(props){
        super(props)
        this.state = {
            isLoggedIn: false,
            newUser: false
        }
        this.signUpClicked = this.signUpClicked.bind(this)
        this.cancelClicked = this.cancelClicked.bind(this)
        this.loginSuccess = this.loginSuccess.bind(this)
        this.createAccountSuccess = this.createAccountSuccess.bind(this)
    }

    signUpClicked(){
        this.setState({newUser: true})
    }

    cancelClicked(){
        this.setState({newUser: false})
    }

    loginSuccess(){
        this.setState({isLoggedIn: true})
    }

    createAccountSuccess(){
        this.setState({
            newUser: false,
            isLoggedIn: true
        })
    }

    renderContent(){
        if(this.state.newUser){
            return <Signup cancelClicked={this.cancelClicked} createAccountSuccess={this.createAccountSuccess} />
        } else if(!this.state.isLoggedIn) {
            return <Login signUpClicked={this.signUpClicked} loginSuccess={this.loginSuccess} />
        } else {
            return <p>User is logged in.</p>
        }
    }

    render(){
        return this.renderContent()
    }

}