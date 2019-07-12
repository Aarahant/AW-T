import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image
} from 'react-native'; 
import { Header} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import { strings } from '../../i18n';
import LoadingScreen from '../Common/LoadingScreen';
import light from '../Common/mode';
import dark from '../Common/DarkMode';

export default class AutorizacionPorTDC extends React.Component {
  constructor(props) {
    super(props);
    // console.log("################The Force Awakens (Remastered)");
    // console.log(this.props);
    this.state = {
        filtros_bandeja: {
          "TOKEN_P": global.token,
          "TIPAUTID_P": this.props.TIPAUTID,
          "LOCALE_P": global.language
        },
        loading: true,
        BandejaTDC: [],
        data: [],
    };
    // console.log(this.state.empleado_keys);
  }

  async componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
    axios
      .post('restgBandejaListaAut',
       this.state.filtros_bandeja
      ).then(response => {
        if (response.data.SUCCESS){
          this.setState({
            BandejaTDC: response.data,
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
      }
      ).catch(error =>  console.log(error));
      // console.log("############### Phantom Menace");
      // console.log(this.state.BandejaTDC);
  }

  updateTitle() {
    Actions.refresh({title: strings("modules.BandejaDeAutorizaciones.AutorizacionPorTDC.title")});
    clearInterval(this.titleInterval);
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
    let informacion;
    let dayColor;
    estilos === light ? dayColor = "red" : dayColor = "rgb(255, 69, 69)"
    informacion = 
      <View>
        <View>
          <Text style={estilos.curvedCardHeader}>{data.item.CNCIASDSC} - 
            <Text style={estilos.curvedCardHeaderHighlighted}> {data.item.BANAUTNDC}</Text>
          </Text>
          <Text style={estilos.curvedCardSubtitleHighlighted}>{strings('modules.BandejaDeAutorizaciones.AutorizacionPorTDC.days_without_attending')}: 
            <Text style={{color: dayColor}}> {data.item.dias_sin_atender}</Text>
          </Text> 
          <Text style={estilos.curvedCardSubtitle}>{strings('transactions.CNCDIR.CNCDIRNOM')}:</Text>
          <Text style={estilos.curvedCardContent}>{data.item.CNCDIRNOM}</Text>
          <Text style={estilos.curvedCardSubtitle}>{strings('transactions.PMCTPR.PMCTPRDSC')}:</Text>
          <Text style={estilos.curvedCardContent}>{data.item.PMCTPRDSC}</Text>
          <Text style={estilos.curvedCardSubtitle}>{strings('transactions.BANAUT.BANAUTFEC')}:
            <Text style={estilos.curvedCardContent}> {data.item.BANAUTFEC}</Text>
          </Text>
        </View>
      </View>

    switch (data.item.BANAUTTIP){
      case 'OMP':
        return (
          <TouchableOpacity
              onPress={() => Actions.autorizacion_oc(data.item)}
            >
            <View style={estilos.curvedCard}>
                {informacion}
            </View>
          </TouchableOpacity>
        );
      case 'PAG':
        return (
          <TouchableOpacity
              onPress={() => Actions.autorizacion_pag(data.item)}
            >
            <View style={estilos.curvedCard}>
                {informacion}
            </View>
          </TouchableOpacity>
        );
      case 'RAV':
        return (
          <TouchableOpacity
              onPress={() => Actions.autorizacion_rav(data.item)}
            >
            <View style={estilos.curvedCard}>
                {informacion}
            </View>
          </TouchableOpacity>
        );
      case 'REQ':
        return (
          <TouchableOpacity
              onPress={() => Actions.autorizacion_req(data.item)}
            >
            <View style={estilos.curvedCard}>
                {informacion}
            </View>
          </TouchableOpacity>
        );
      case 'RET':
        return (
          <TouchableOpacity
              onPress={() => Actions.autorizacion_ret(data.item)}
            >
            <View style={estilos.curvedCard}>
                {informacion}
            </View>
          </TouchableOpacity>
        );
      default:
        return(
          <TouchableWithoutFeedback> 
            <View style={estilos.curvedCard}>
              {informacion} 
            </View>
          </TouchableWithoutFeedback>
        );
    }
  } 

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  render() { 
    let estilos = this.estilo()
    const loading = this.state.loading;
    const Bandeja = this.state.BandejaTDC.sdtRestBandejaAut;
    const tipoDeDoc = this.state.BandejaTDC.TIPAUTDSC;
    let IndicadorAusenciaDatos;
    
    if (loading != true) { //
      if (Bandeja.length === 0) {
        IndicadorAusenciaDatos =
        <View style={styles.pushedDown}> 
          <Text style={estilos.non_pending}>{strings("modules.BandejaDeAutorizaciones.BandejaDeAutorizaciones.non_pending")}</Text>
          <Image style={{width: 150, height: 150}} source={require("../../../assets/images/caja_vacia.png")}></Image>
        </View>
      }
      return (   
        <View style={estilos.container}>   
          {IndicadorAusenciaDatos}
          <View style={estilos.container}>
            <ScrollView contentContainerStyle={estilos.ScrollContainer}>
              <FlatList
                data={Bandeja}
                keyExtractor= {(item, index) => index.toString() + item.BANAUTNDC.toString() }
                renderItem={this.renderItem.bind(this)}
              />
            </ScrollView>
          </View>
        </View>
      );
    } else {
      return (
        <LoadingScreen />
      );
    }
  }
};

const styles = StyleSheet.create({
  pushedDown:{
    marginTop: 100,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});