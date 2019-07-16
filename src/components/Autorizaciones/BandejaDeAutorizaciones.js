import React from 'react';
import {
  ScrollView,
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
import LoadingScreen from '../Common/LoadingScreen';
import light from '../Common/mode';
import dark from '../Common/DarkMode';

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
      .post('restgBandejaTipoAut',
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
      .post('restgBandejaTipoAut',
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

  renderItem(data){
    let estilos = this.estilo()
    const pending = data.item.cont_pendientes;
    let color_pend;
    if (pending < 6) {
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
          marginTop: 6,
          marginRight: 10,
        }}>
        {pending}
      </Text>
    }
    
    return (
      <TouchableOpacity
        style={estilos.emailItem}
        onPress={() => Actions.autorizacion_por_tdc(data.item)}
      >
       <View style={{flexDirection: 'row'}}>
          <View style={{flex:1, margin:5}}>
            <Text style={estilos.contenido}>{data.item.TIPAUTDSC}</Text>
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
    let estilos = this.estilo()
    const loading = this.state.loading;
    const Bandeja = this.state.BandejaAut.sdtBandejaTipoAut;

    if (loading != true) {
      return (   
        <View style={estilos.container}>
          <ScrollView contentContainerStyle={estilos.ScrollContainer}>
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
        <LoadingScreen />
      );
    }
  }
}
