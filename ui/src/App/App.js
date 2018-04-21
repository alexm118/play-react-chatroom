import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import AuthenticationContainer from '../AuthenticationContainer/AuthenticationContainer';
import { Grid } from 'react-flexbox-grid';
import './App.css';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Grid fluid>
          <AppBar title="Play React Chatroom" />
          <AuthenticationContainer />
        </Grid>
      </MuiThemeProvider>
    );
  }
}

export default App;
