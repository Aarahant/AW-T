import React, { Component } from 'react';
import Router from './src/Router';
import axios from 'axios'
import { 
  View
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

export default class App extends Component {
  render() {
    return (
      <Router />
    );
  }

  componentDidMount(){
    SplashScreen.hide();
  }
  
  componentWillMount() {
    axios.defaults.baseURL = 'http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/';
    axios.defaults.timeout = 81000;
  }
}
