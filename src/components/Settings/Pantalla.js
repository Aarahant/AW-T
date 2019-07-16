import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { strings } from '../../i18n';
import LoadingScreen from '../Common/LoadingScreen';
import AsyncStorage from '@react-native-community/async-storage';
import light from '../Common/mode';
import dark from '../Common/DarkMode';

export default class Pantalla extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    parametros: {
      'TOKEN_P': global.token
    }
//       loading: true,
//       data: [],
    };
  }
  componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
//     const keys = this.state.parametros; 
//     axios.post(' ', keys
//      ).then(response => {
//        if (response.data.SUCCESS){
//         this.setState({
//           data: response.data,
//           loading: false
//          });
//        } else {
//          Alert.alert(
//            strings('common.session.alert_title'),
//            strings('common.session.alert_content'),
//            [
//              { text: strings('common.session.alert_ok'), onPress: () => Actions.auth() }
//            ],
//            { cancelable: false }
//          );
//          Actions.auth();
//        }
//      })
//      .catch(error =>  console.log(error));
  }
  updateTitle() {
    Actions.refresh({title: strings('modules.Settings.Pantalla.title')});
    clearInterval(this.titleInterval);
  }
  cambiar_modo(mode){
//     axios.post('restpActualizarLocale', 
//     {
//       "TOKEN_P": global.token,
//       "LOCALEID_P": lang
//     }
//    ).then(response => {
//      if (response.data.SUCCESS){
      (async ()=>{
       await AsyncStorage.setItem("A_MODE",mode)
      })()
      global.style = mode;
      global.skip = true;
      Actions.refresh();
      Actions.load();
    //  } else {
    //    Alert.alert(
    //      strings('common.session.alert_title'),
    //      strings('common.session.alert_content'),
    //      [
    //        { text: strings('common.session.alert_ok'), onPress: () => Actions.auth() }
    //      ],
    //      { cancelable: false }
    //    );
    //    Actions.auth();
    //  }
    // })
    // .catch(error => console.log(error));
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
    const loading = this.state.loading;
    let estilos = this.estilo()
    if (loading != true) {
    return (   
      <View style={estilos.container}>
        <ScrollView style={estilos.ScrollContainer}>
          <View> 
            <TouchableOpacity
            style={estilos.emailItem}
            onPress={() => this.cambiar_modo('light') }>
                <View style={{flexDirection: 'row'}}>
                <View style={{flex:1, margin:5}}>
                    <Text style={estilos.contenido}> {strings('modules.Settings.Pantalla.light')} </Text>
                </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
            style={estilos.emailItem}
            onPress={() => this.cambiar_modo('dark') }>
                <View style={{flexDirection: 'row'}}>
                <View style={{flex:1, margin:5}}>
                    <Text style={estilos.contenido}> {strings('modules.Settings.Pantalla.dark')} </Text>
                </View>
                </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
    } else {
    return (  
      <LoadingScreen />
    );
    } 
  }
}