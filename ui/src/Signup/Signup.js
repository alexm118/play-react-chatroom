import React, { PureComponent } from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'

const halfWidthTextFieldStyle = {
    width: '40%', marginRight: '5%', marginLeft: '5%'
}

const fullWidthTextFieldStyle = {
    width: '90%', marginRight: '5%', marginLeft: '5%'
}

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

    renderTextField = (label, style, type, onChange) => {
        return <TextField
                    floatingLabelText={label}
                    style={style}
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
                this.props.createAccountSuccess()
            }
        }).catch()
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
                    {this.renderTextField("Username", fullWidthTextFieldStyle, "input", this.updateUsername)}
                    {this.renderTextField("Password", fullWidthTextFieldStyle, "password", this.updatePassword)}
                    {this.renderTextField("Email", fullWidthTextFieldStyle, "input", this.updateEmail)}
                    {this.renderTextField("First Name", halfWidthTextFieldStyle, "input", this.updateFirstName)}
                    {this.renderTextField("Last Name", halfWidthTextFieldStyle, "input", this.updateLastName)}
                </Dialog>
            </div>
        )
    }
}

Signup.propTypes = {
    cancelClicked: PropTypes.func.isRequired,
    createAccountSuccess: PropTypes.func.isRequired
}