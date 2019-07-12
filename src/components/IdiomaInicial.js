import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Header
} from 'react-native'; 
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import I18n from 'react-native-i18n';
import light from './Common/mode';
import dark from './Common/DarkMode';


export default class IdiomaInicial extends React.Component {

  cambiar_lenguaje(lang){
      console.log("####################### Lenguaje");
      console.log(lang);
      axios.post('restpActualizarLocale', 
      {
        "TOKEN_P": global.token,
        "LOCALEID_P": lang
      }
     ).then(response => {
       if (response.data.SUCCESS){
        global.language = lang;
        I18n.locale = lang;
        Actions.refresh();
        Actions.load();
        Actions.main();
       } else {
         Alert.alert(
           strings('common.session.alert_title'),
           strings('common.session.alert_content'),
           [
             { text: strings('common.session.alert_ok'), onPress: () => Actions.auth() }
           ],
           { cancelable: false }
         );
         Actions.auth();
       }
     })
     .catch(error => console.log(error));
  }

  estilo(){
    switch (global.style){
      case 'light':
        return(light);
      case 'dark':
        return(dark);
      default:
        return(light);
    }
  }

  render() { 
    let estilos = this.estilo()
    var flags = [
      require('../../assets/images/mexico.png'),
      require('../../assets/images/usa.png')
    ];
    return ( 
      <View style={estilos.container}>
        <ScrollView style={estilos.ScrollContainer}>
          <TouchableOpacity
          style={estilos.emailItem}
          onPress={() => this.cambiar_lenguaje('en-US') }>
              <View style={{flexDirection: 'row'}}>
              <Image source={flags[1]} style={{width: 52, height: 30}}/>
              <View style={{flex:1, margin:5}}>
                  <Text style={estilos.contenido}> English (USA) </Text>
              </View>
              </View>
          </TouchableOpacity>
          <TouchableOpacity 
          style={estilos.emailItem}
          onPress={() => this.cambiar_lenguaje('es-MX') }>
              <View style={{flexDirection: 'row'}}>
              <Image source={flags[0]} style={{width: 52, height: 30}}/>
              <View style={{flex:1, margin:5}}>
                  <Text style={estilos.contenido}> Español (MX) </Text>
              </View>
              </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }                                                                                     
}