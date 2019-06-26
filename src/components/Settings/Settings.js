import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native'; 
import { Actions } from 'react-native-router-flux';
// import axios from 'axios';
import { strings } from '../../i18n';


export default class Settings extends React.Component {

  componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
  }

  updateTitle() {
    Actions.refresh({title: strings("modules.Settings.title")});
    clearInterval(this.titleInterval);
  }

  render() { 
    return ( 
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity
            style={styles.emailItem}
            onPress={() => Actions.idiomas()}
            >
                <View style={{flexDirection: 'row'}}>
                <View style={{flex:1, margin:5}}>
                    <Text> {strings('modules.Settings.language')} </Text>
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
    loadingContainer: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: "center",
      alignItems: "center"
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