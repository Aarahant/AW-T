import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native'; 
import { Actions } from 'react-native-router-flux';
import { strings } from '../../i18n';
import light from '../Common/mode';
import dark from '../Common/DarkMode';


export default class Settings extends React.Component {

  componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
  }

  updateTitle() {
    Actions.refresh({title: strings("modules.Settings.title")});
    clearInterval(this.titleInterval);
  }

  render() { 
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
    <View style={estilos.container}>
      <ScrollView style={estilos.ScrollContainer}>
        <TouchableOpacity
            style={estilos.emailItem}
            onPress={() => Actions.idiomas()}
            >
                <View style={{flexDirection: 'row'}}>
                <View style={{flex:1, margin:5}}>
                    <Text style={estilos.contenido}> {strings('modules.Settings.language')} </Text>
                </View>
                </View>
        </TouchableOpacity>
        <TouchableOpacity
            style={estilos.emailItem}
            onPress={() => Actions.pantalla()}
            >
                <View style={{flexDirection: 'row'}}>
                <View style={{flex:1, margin:5}}>
                    <Text style={estilos.contenido}> {strings('modules.Settings.Screen')} </Text>
                </View>
                </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
    );
  }
}