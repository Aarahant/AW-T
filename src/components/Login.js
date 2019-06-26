import React, { Component } from 'react';
import { 
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView
 } from 'react-native';
import LoginOrCreateForm from './common/LoginOrCreateForm';


class Login extends Component {
  render() {
    return (
      <ScrollView style={{backgroundColor: "#24aebb"}}>
        <ImageBackground source={require('../../assets/images/blue_background.png')} style={{width: '100%'}}>
          <View style={styles.mainDiv} >
            {/* <Text style={styles.screenTitle}>AW&T</Text>
            <Text style={styles.flavorText}>KDS:Anywhere and Anytime</Text> */}
            <View style={{ flex: 1 }}>
              <LoginOrCreateForm />
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    );
  }
}

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
  }
});


export default Login;