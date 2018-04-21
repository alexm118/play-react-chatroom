import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'

export default class Login extends PureComponent {
    
    constructor(props){
        super(props)
        this.state = {
            username: null,
            password: null
        }
    }

    updateUsername = (e) => {
        e.preventDefault()
        this.setState({username: e.target.value})
    }

    updatePassword = (e) => {
        e.preventDefault()
        this.setState({password: e.target.value})
    }

    renderTextField = (label, type, onChange) => {
        return (
            <div className="login-field">
                <TextField
                    floatingLabelText={label}
                    type={type}
                    fullWidth={true}
                    onChange={(e) => onChange(e)}
                />
            </div>
        )
    }

    createActions = () => {
        return [
            <FlatButton label="Login"
                        primary={true} 
                        onClick={() => this.login(this.createPayload())} 
                        key="login"
                        className="login-button" />,
            <FlatButton label="Sign Up" 
                        primary={true} 
                        onClick={this.props.signUpClicked} 
                        key="Sign-up"
                        className="login-button" />
        ]
    }

    createPayload = () => {
        return {
            username: this.state.username,
            password: this.state.password
        }
    }

    login = (data) => {
        fetch('/user/login', {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => {
            if(response.status === 200){
                this.props.loginSuccess(data.username)
            }
        }).catch()
    }

    render(){
        return (
            <div>
                <Dialog
                    title="Please Login"
                    modal={true}
                    open={true}
                    contentStyle={{width: "30%"}}
                    actions={this.createActions()}
                    actionsContainerStyle={{textAlign: "center"}}
                    titleStyle={{textAlign: "center"}}
                >
                    {this.renderTextField("Username", "input", this.updateUsername)}
                    {this.renderTextField("Password", "password", this.updatePassword)}
                </Dialog>
            </div>
        )
    }
}

Login.propTypes = {
    signUpClicked: PropTypes.func.isRequired,
    loginSuccess: PropTypes.func.isRequired
}