import React, { Component } from 'react';
import {  
    View, 
    Text, 
    TextInput, 
    StyleSheet,
    ToastAndroid,
    Image
} from 'react-native';
import {Button} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import { strings } from '../../i18n';
import I18n from 'react-native-i18n';

class LoginOrCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // PRUEBAS ---------------------
      username: 'dvazquez',
      password: '12345678',
      // PRUEBAS END ----------------------
      can_click_login: false
    };
  }
  
  componentDidMount() {
    console.log(I18n.locale);
    this.setState({
      can_click_login: true
    });
  }

  componentWillUnmount() {
    this.setState({
      can_click_login: false
    });
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
        25,
        50
      );
    } else if (payload.CNUSERPWD_P == '') {
      ToastAndroid.showWithGravityAndOffset(
        'Se debe ingresar una contraseña',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      this.setState({
        can_click_login: false
      });
      if (this.state.can_click_login === true) { // Quien sabe porque funciona esto del cna_click_login xd
        axios
        .post('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/restpAutenticacionUsuario', payload)
        .then(response => {
          if (response.data.SUCCESS){
            global.token = response.data.TOKEN;
            if (response.data.LOCALIZED) {
              global.language = response.data.LOCALE;
              I18n.locale = response.data.LOCALE;
              Actions.main();
            } else {
              this.setState({
                can_click_login: true
              });
              Actions.idioma_inicial();
            }
          } else {
            ToastAndroid.showWithGravityAndOffset(response.data.RESPUESTA, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            this.setState({
              can_click_login: true
            });
          }
        })
        .catch(error => ToastAndroid.showWithGravityAndOffset(error,ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50));
      }
    }
  }

  onUsernameChange(text) {
    this.setState({ username: text });
  }

  onPasswordChange(text) {
    this.setState({ password: text });
  }

  onFirstNameChange(text) {
    this.setState({ firstName: text });
  }

  onLastNameChange(text) {
    this.setState({ lastName: text });
  }

  onEmailChange(text) {
    this.setState({ email: text });
  }

  renderCreateForm() {
    const { fieldStyle, textInputStyle, formContainerStyle } = style;
    if (this.props.create) {
      return (
         <View style={formContainerStyle}>
          <View style={fieldStyle}>
            <TextInput
              placeholder="Correo"
              autoCorrect={false}
              onChangeText={this.onEmailChange.bind(this)}
              style={textInputStyle}
            />
          </View>
          <View style={fieldStyle}>
            <TextInput
              placeholder="Primer nombre"
              autoCorrect={false}
              onChangeText={this.onFirstNameChange.bind(this)}
              style={textInputStyle}
            />
            <TextInput
              placeholder="Apellido"
              autoCorrect={false}
              onChangeText={this.onLastNameChange.bind(this)}
              style={textInputStyle}
            />
          </View>
        </View>
      );
    }
  }

  renderButton() {
    return (
      <Button title={strings('modules.Login.login')} 
      buttonStyle={{backgroundColor: '#135c79', width:130}} 
      onPress={this.handleRequest.bind(this)}/>  
    );
  }

  render() {
    const {
      formContainerStyle,
      fieldStyle,
      textInputStyle,
      buttonContainerStyle,
      kds_logo_image,
      fontLogin,
      viewFontLogin
    } = style;

    return (
      <View style={{ flex: 1 }}>
        <View style={formContainerStyle}>
          {/* {SystemLogo} */}
          <Image style={kds_logo_image} source={require("../../../assets/images/logo_animado_v1.gif")}/>
          <View style = {viewFontLogin}>
            <Text style = {fontLogin}> {strings('modules.Login.username')}</Text>
          </View>
          <View style={fieldStyle}>
            <TextInput
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={this.onUsernameChange.bind(this)}
              style={textInputStyle}
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
    backgroundColor: '#73c0c7'
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
    height: 190,
    width: 190
  }
});


export default LoginOrCreateForm;
