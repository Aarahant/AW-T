import React, { Component } from 'react';
import { 
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Image,
  TextInput, 
  ToastAndroid
} from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import { strings } from '../i18n';
import I18n from 'react-native-i18n';
import AsyncStorage from '@react-native-community/async-storage';
import light from './Common/mode';
import dark from './Common/DarkMode';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginProcessing: false,
      username: '',
      // PRUEBAS ---------------------
      password: '12345678',
      // PRUEBAS END ----------------------
    };
  }  
  
  async componentDidMount() {
    this.getAsync();
  }

  getAsync = async () => {
    let userId = await AsyncStorage.getItem("A_CNUSERID")
    this.setState({
      username: userId
    });
    try {
      let mode = await AsyncStorage.getItem("A_MODE")
      global.style = mode
      console.log('################## The Force Unleashed');
      console.log(global.style);
    } catch(e) {
      console.log("####### FALLASSSSSSSS")
    }
  }

  setUserId(CNUSERID) {
    (async ()=>{
     await AsyncStorage.setItem("A_CNUSERID",CNUSERID)
     console.log("############# Se guardó el CNUSER")
    })()
  }
  
  setToken(TOKEN) {
    (async ()=>{
     await AsyncStorage.setItem("A_TOKEN",TOKEN)
     console.log("############# Se guardó el TOKEN")
    })()
  }

  handleRequest() {
    const payload = { 
      "CNUSERID_P": this.state.username, 
      "CNUSERPWD_P": this.state.password 
    } 
    
    if (payload.CNUSERID_P == '') {
      ToastAndroid.showWithGravityAndOffset(
        'Se debe ingresar un usuario',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        0,
        50
      );
    } else if (payload.CNUSERPWD_P == '') {
      ToastAndroid.showWithGravityAndOffset(
        'Se debe ingresar una contraseña',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        0,
        50
      );
    } else {
      this.setState({ loginProcessing: true });
      axios
      .post('restpAutenticacionUsuario', payload)
      .then(response => {
        if (response.data.SUCCESS){
          global.token = response.data.TOKEN;
          if (response.data.LOCALIZED) {
            global.language = response.data.LOCALE;
            I18n.locale = response.data.LOCALE;
            Actions.main();
          } else {
            this.setState({
              loginProcessing: false
            });
            Actions.idioma_inicial();
          }
          this.setUserId(payload.CNUSERID_P);
          this.setToken(response.data.TOKEN);
        } else {
          ToastAndroid.showWithGravityAndOffset(response.data.RESPUESTA, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
          this.setState({
            loginProcessing: false
          });
        }
      })
      .catch(error => ToastAndroid.showWithGravityAndOffset(error,ToastAndroid.LONG,ToastAndroid.BOTTOM,0,50));
    }
  }
  
  onUsernameChange(text) {
    this.setState({ username: text });
  }

  onPasswordChange(text) {
    this.setState({ password: text });
  }

  renderButton() {
    return (
      <Button title={strings('modules.Login.login')} 
      buttonStyle={{backgroundColor: '#135c79', width:130, elevation: 1}} 
      onPress={this.handleRequest.bind(this)}/>  
    );
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

    const {
      formContainerStyle,
      fieldStyle,
      textInputStyle,
      buttonContainerStyle,
      kds_logo_image,
      fontLogin,
      viewFontLogin
    } = style;
    const version = 'V0.0.0';
    return (
      <ScrollView style={{backgroundColor: "#24aebb"}}>
        <ImageBackground source={require('../../assets/images/blue_background.png')} style={{width: '100%'}}>
          <View style={styles.versionPosition}>
            <Text>{version}</Text>
          </View>
          <View style={styles.mainDiv} >
            <Overlay
              isVisible={this.state.loginProcessing}
              windowBackgroundColor="rgba(255, 255, 255, .3)"
              overlayBackgroundColor="rgba(255, 255, 255, .0)"
              fullScreen= {true}
            >
              <View style={styles.loadingContainer}>
                <Image style={estilos.kds_logo_image} source={require("../../assets/gifs/bars6.gif")}/>
              </View>
            </Overlay>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <View style={formContainerStyle}>
                  <Image style={kds_logo_image} source={require("../../assets/images/KDS_LOGO.png")}/>
                  <View style = {viewFontLogin}>
                    <Text style = {fontLogin}> {strings('modules.Login.username')}</Text>
                  </View>
                  <View style={fieldStyle}>
                    <TextInput
                      autoCorrect={false}
                      autoCapitalize="none"
                      onChangeText={this.onUsernameChange.bind(this)}
                      style={textInputStyle}
                      value={this.state.username} // Async
                    />
                  </View>
                  <View style = {viewFontLogin}><Text style = {fontLogin}> {strings('modules.Login.password')}</Text></View>
                  <View style={fieldStyle}>
                    <TextInput
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={this.onPasswordChange.bind(this)}
                      style={textInputStyle}
                    />
                  </View>
                </View>
                <View style={buttonContainerStyle}>
                  {this.renderButton()}
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  formContainerStyle: {
    flex: 1,
    marginTop: 60,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewFontLogin: {
    width: 300,
    alignItems: 'flex-start'
  },
  fontLogin: {
    padding: 3,
    color: 'white'
  },
  textInputStyle: {
    flex: 1,
    padding: 6,
    fontSize: 16,
    backgroundColor: '#73c0c7',
    elevation: 1
  },
  fieldStyle: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25
  },
  accountCreateTextStyle: {
    color: 'black'
  },
  kds_logo_image: {
    height: 146,
    width: 190,
    marginBottom: 22
  }
});

const styles = StyleSheet.create({
  mainDiv: {
      flex: 1,
      margin: 35,
      marginTop: 20,
      marginBottom: 50,
  },
  screenTitle: {
      fontSize: 50,
      color: 'white',
      textAlign: 'center'
  },
  flavorText: {
      fontSize: 12,
      textAlign: 'center',
      color: 'white',
      margin: 20
  },
  centerContainer: {
      justifyContent: "center",
      alignItems: "center"
  },
  fieldArea: {
      flex: 1,
      backgroundColor: '#0000004a',
      marginTop: 20,
      marginBottom: 20,
      width: '100%',
  },
  innerFieldArea: {
      margin: 10
  }, 
  fieldLabel: {
      color: 'white',
      marginTop: 8,
      fontSize: 12
  },
  formField: {
      width: '100%',
      color: 'white',
      fontSize: 18
  },
  btnIngresar: {
      backgroundColor: '#24cc70',
      color: 'black',
      width: '100%',
      margin: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  versionPosition: {
    flex: 1,
    alignItems: 'flex-end',
    margin: 5,
    color: "white"
  }
});


export default Login;