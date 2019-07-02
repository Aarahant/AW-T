import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
// import { Actions } from 'react-native-router-flux';
// import { Bars } from 'react-native-loader';

export default class LoadingScreen extends React.Component {
    render(){
        return (   
            <View style={styles.loadingContainer}>
              <Image style={styles.kds_logo_image} source={require("../../../assets/gifs/bars6.gif")}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: "center",
      alignItems: "center"
    },
    kds_logo_image: {
      height: 260,
      width: 260,
    }
  });
