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
import estilos from '../Common/mode';

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

  renderItem(data){
    let informacion;
    let dayColor = "red";
    informacion = 
      <View>
        <View>
          <Text style={styles.curvedCardHeader}>{data.item.CNCIASDSC} - 
            <Text style={styles.curvedCardHeaderHighlighted}> {data.item.BANAUTNDC}</Text>
          </Text>
          <Text style={styles.curvedCardSubtitleHighlighted}>{strings('modules.BandejaDeAutorizaciones.AutorizacionPorTDC.days_without_attending')}: 
            <Text style={{color: dayColor}}> {data.item.dias_sin_atender}</Text>
          </Text> 
          <Text style={styles.curvedCardSubtitle}>{strings('transactions.CNCDIR.CNCDIRNOM')}</Text>
          <Text style={styles.curvedCardContent}>{data.item.CNCDIRNOM}</Text>
          <Text style={styles.curvedCardSubtitle}>{strings('transactions.PMCTPR.PMCTPRDSC')}</Text>
          <Text style={styles.curvedCardContent}>{data.item.PMCTPRDSC}</Text>
          <Text style={styles.curvedCardSubtitle}>{strings('transactions.BANAUT.BANAUTFEC')}:
            <Text style={styles.curvedCardContent}> {data.item.BANAUTFEC}</Text>
          </Text>
        </View>
      </View>

    switch (data.item.BANAUTTDC){
      case 'OMP':
        return (
          <TouchableOpacity
              onPress={() => Actions.autorizacion_oc(data.item)}
            >
            <View style={styles.curvedCard}>
                {informacion}
            </View>
          </TouchableOpacity>
        );
      case 'PGP':
        return (
          <TouchableOpacity
              onPress={() => Actions.autorizacion_pag(data.item)}
            >
            <View style={styles.curvedCard}>
                {informacion}
            </View>
          </TouchableOpacity>
        );
      case 'RAV':
        return (
          <TouchableOpacity
              onPress={() => Actions.autorizacion_rav(data.item)}
            >
            <View style={styles.curvedCard}>
                {informacion}
            </View>
          </TouchableOpacity>
        );
      case 'REQ':
        return (
          <TouchableOpacity
              onPress={() => Actions.autorizacion_req(data.item)}
            >
            <View style={styles.curvedCard}>
                {informacion}
            </View>
          </TouchableOpacity>
        );
      default:
        return(
          <TouchableWithoutFeedback> 
            <View style={styles.curvedCard}>
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
    const loading = this.state.loading;
    const Bandeja = this.state.BandejaTDC.sdtRestBandejaAut;
    const tipoDeDoc = this.state.BandejaTDC.TIPAUTDSC;
    let IndicadorAusenciaDatos;
    
    if (loading != true) { //
      if (Bandeja.length === 0) {
        IndicadorAusenciaDatos =
        <View style={styles.pushedDown}> 
          {/* <View style={styles.center}> */}
            <Text style={{width: 250, textAlign: "center", fontSize: 20}}>{strings("modules.BandejaDeAutorizaciones.BandejaDeAutorizaciones.non_pending")}</Text>
            <Image style={{width: 150, height: 150}} source={require("../../../assets/images/caja_vacia.png")}></Image>
          {/* </View> */}
        </View>
      }
      return (   
        <View style={estilos.container}>   
          {IndicadorAusenciaDatos}
          <View style={estilos.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 0,
    height: '100%'
  },
  curvedCard:{
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 10,
    marginTop: 5,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15
  },
  curvedCardHeader:{
    fontSize: 26,
    color: "black"
  },
  curvedCardHeaderHighlighted: {
    fontSize: 26,
    color: "rgb(38, 51, 140)"
  },
  curvedCardSubtitle: {
    fontSize: 16,
    color: "grey"
  },
  curvedCardContent: {
    fontSize: 16,
    color: "#B7B6B6"
  },
  curvedCardSubtitleHighlighted: {
    fontSize: 18,
    color: "black"
  },
  center: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pushedDown:{
    marginTop: 100,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});