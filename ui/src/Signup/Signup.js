import React, { PureComponent } from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'
import './Signup.css'

const centerText = {
    textAlign: "center"
}

const buttonStyle = {
    margin: '10px'
}

export default class Signup extends PureComponent {

    constructor(props){
        super(props)
        this.state = {
            username: null,
            email: null,
            password: null,
            firstName: null,
            lastName: null
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

    updateEmail = (e) => {
        e.preventDefault()
        this.setState({email: e.target.value})
    }

    updateFirstName = (e) => {
        e.preventDefault()
        this.setState({firstName: e.target.value})
    }

    updateLastName = (e) => {
        e.preventDefault()
        this.setState({lastName: e.target.value})
    }

    createActions = () => {
        return [
            <FlatButton 
                label="Create Account"
                primary={true}
                key="create-account"
                style={buttonStyle}
                onClick={() => this.createAccount(this.createPayload())}
            />,
            <FlatButton
                label="Cancel"
                primary={true}
                key="cancel"
                onClick={() => this.props.cancelClicked()}
                style={buttonStyle}
            />
        ]
    }

    renderTextField = (label, className, type, onChange) => {
        return <TextField
                    floatingLabelText={label}
                    className={className}
                    type={type}
                    onChange={(e) => onChange(e)}
                />
    }

    createPayload = () => {
        return {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email,
            firstname: this.state.firstName,
            lastname: this.state.lastName
        }
    }

    createAccount = (data) => {
        fetch('/user/create', {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => {
            if(response.status === 200){
                response.json().then(
                    user => this.props.createAccountSuccess(user)
                )
            }
        }).catch(
            error => console.log("Error logging in")
        )
    }

    render(){
        return (
            <div>
                <Dialog
                    open={true}
                    modal={true}
                    title="Signup"
                    titleStyle={centerText}
                    contentStyle={{width: "50%"}}
                    actions={this.createActions()}
                    actionsContainerStyle={centerText}
                >
                    {this.renderTextField("Username", "full-width-text-field", "input", this.updateUsername)}
                    {this.renderTextField("Password", "full-width-text-field", "password", this.updatePassword)}
                    {this.renderTextField("Email", "full-width-text-field", "input", this.updateEmail)}
                    {this.renderTextField("First Name", "half-width-text-field", "input", this.updateFirstName)}
                    {this.renderTextField("Last Name", "half-width-text-field", "input", this.updateLastName)}
                </Dialog>
            </div>
        )
    }
}

Signup.propTypes = {
    cancelClicked: PropTypes.func.isRequired,
    createAccountSuccess: PropTypes.func.isRequired
}