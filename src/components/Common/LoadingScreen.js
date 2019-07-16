import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import light from '../Common/mode';
import dark from '../Common/DarkMode';
import { Actions } from 'react-native-router-flux';
import { strings } from '../../i18n';

export default class LoadingScreen extends React.Component {
  
  updateTitle() {
    Actions.refresh({title: strings("common.loading")});
    clearInterval(this.titleInterval);
  }
  componentDidMount(){
    this.titleInterval = setInterval(() => this.updateTitle(),1);
  }  
  
  render(){
      let estilos;
      switch (global.style){
      case 'light':
        estilos = light;
        break;
      case 'dark':
        estilos = dark;
        break;
      default:
        estilos = light;
        break; 
      }
        return (   
            <View style={estilos.loadingContainerCommon}>
              <Image style={estilos.kds_logo_image} source={require("../../../assets/gifs/bars6.gif")}/>
            </View>
        );
    }
}