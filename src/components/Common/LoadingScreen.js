import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import light from '../Common/mode';
import dark from '../Common/DarkMode';

export default class LoadingScreen extends React.Component {
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
            <View style={estilos.loadingContainer}>
              <Image style={estilos.kds_logo_image} source={require("../../../assets/gifs/bars6.gif")}/>
            </View>
        );
    }
}