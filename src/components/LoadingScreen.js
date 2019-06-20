import React from 'react';
import { StyleSheet, Text } from 'react-native';
// import { Actions } from 'react-native-router-flux';
// import { Bars } from 'react-native-loader';

export default class LoadingScreen extends React.Component {
    render(){
        return (   
            <View style={styles.loadingContainer}>
                {/* <Bars size={50} color="#2b5580" /> */}
                <Text> Loading... </Text>
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
    }
  });
