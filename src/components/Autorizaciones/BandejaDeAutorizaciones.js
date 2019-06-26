import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ToastAndroid
} from 'react-native'; 
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import { strings } from '../../i18n';
import I18n from 'react-native-i18n';

export default class BandejaDeAutorizaciones extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      BandejaAut: [],
      data: [],
    };
  }

  async componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
    axios
      .post('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/restgBandejaTipoAut',
      {
        "TOKEN_P": global.token,
        "LOCALE_P": I18n.locale
      }
      ).then(response => {
        if (response.data.SUCCESS){
          this.setState({
            BandejaAut: response.data,
            loading: false
          });
          this.arrayholder = response.data;
        } else {
          Alert.alert(
            strings('common.session.alert_title'),
            strings('common.session.alert_content'),
            [
              { text: strings('common.session.alert_ok'), onPress: () => Actions.auth()}
            ],
            {cancelable: false}
          );
          Actions.auth();
        }
        
      }
      ).catch(error =>  console.log(error));
    this.interval = setInterval(() => this.updateBin(),10000);
  }
  
  updateBin(){
    axios
      .post('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/restgBandejaTipoAut',
      {
        "TOKEN_P": global.token,
        "LOCALE_P": I18n.locale
      }
      ).then(response => {
        if (response.data.SUCCESS){
          this.setState({
            BandejaAut: response.data,
            loading: false
          });
          this.arrayholder = response.data;
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
      }).catch(error =>  console.log(error));
  }

  updateTitle() {
    Actions.refresh({title: strings("modules.BandejaDeAutorizaciones.BandejaDeAutorizaciones.title")});
    clearInterval(this.titleInterval);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderItem(data){
    const pending = data.item.cont_pendientes;
    let color_pend;
    if (pending < 10) {
      color_pend = 'orange';
    } else {
      color_pend = '#ff4d4d';
    }
    let aut_count;
    if ( pending > 0) {
      aut_count = <Text style={{
          width: 25,
          height: 25,
          backgroundColor: color_pend,
          color: 'white',
          textAlign: 'center',
          paddingTop: 3,
          borderRadius: 50,
          marginTop: 10,
          marginRight: 10,
        }}>
        {pending}
      </Text>
    }
    
    return (
      <TouchableOpacity
        style={styles.emailItem}
        onPress={() => Actions.autorizacion_por_tdc(data.item)}
      >
       <View style={{flexDirection: 'row'}}>
          <View style={{flex:1, margin:5}}>
            <Text >{data.item.TIPAUTDSC}</Text>
          </View>
          {aut_count}
        </View>
      </TouchableOpacity>
    );
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  render() { 
    const loading = this.state.loading;
    const Bandeja = this.state.BandejaAut.sdtBandejaTipoAut;

    if (loading != true) {
      return (   
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <FlatList
              data={Bandeja}
              keyExtractor= {(item, index) => item.TIPAUTID.toString() }
              renderItem={this.renderItem.bind(this)}
            />
          </ScrollView>
        </View>
      );
    } else {
      return (   
        <View style={styles.loadingContainer}>
          <Text> Loading... </Text>
        </View>
      );
    }
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
  navCardTouch: {
    marginVertical: 4,
    marginHorizontal: 8,
  },
  navCard: {
    elevation: 3,
    backgroundColor: 'white', 
  },
  navCardContent: {
    margin: 5,
  },
  emailItem:{
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 10
  },
  emailSubject: {
    color: 'rgba(0,0,0,0.5)'
  },
});
