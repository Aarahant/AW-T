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


export default class IdiomaInicial extends React.Component {

  cambiar_lenguaje(lang){
      // I18n.locale = lang;
      console.log("####################### Lenguaje");
      console.log(lang);
      axios.post('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/restpActualizarLocale', 
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

  render() { 
    var flags = [
      require('../../assets/images/mexico.png'),
      require('../../assets/images/usa.png')
    ];
    return ( 
      // <Header
      //     backgroundColor= '#1aa6a8' //'#003366'
      //     leftComponent={{ icon: 'menu', color: '#fff', onPress:() => this.refs['mainDrawer'].openDrawer() }}
      //     centerComponent={{ text: strings('modules.HomeScreen.title'), style: { color: '#fff' } }}
      // />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <TouchableOpacity
          style={styles.emailItem}
          onPress={() => this.cambiar_lenguaje('en-US') }>
            <View style={{flexDirection: 'row'}}>
              <Image source={flags[1]} style={{width: 52, height: 30}}/>
              <View style={{flex:1, margin:5}}>
                <Text> English (USA) </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
          style={styles.emailItem}
          onPress={() => this.cambiar_lenguaje('es-MX') }>
            <View style={{flexDirection: 'row'}}>
            <Image source={flags[0]} style={{width: 52, height: 30}}/>
              <View style={{flex:1, margin:5}}>
                  <Text> Español (MX) </Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }                                                                                     
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    contentContainer: {
      paddingTop: 0,
      height: '100%'
    },
    emailItem:{
      borderBottomWidth: 0.5,
      borderColor: 'rgba(0,0,0,0.3)',
      padding: 10
    }
  });