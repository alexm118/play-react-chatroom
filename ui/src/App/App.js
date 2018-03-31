import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import AuthenticationContainer from '../AuthenticationContainer/AuthenticationContainer';
import './App.css';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <AppBar title="Play React Chatroom" />
        <AuthenticationContainer />
      </MuiThemeProvider>
    );
  }
}

export default App;
