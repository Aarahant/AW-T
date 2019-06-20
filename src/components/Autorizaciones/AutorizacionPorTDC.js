import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native'; 
import { Header} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import { strings } from '../../i18n';

export default class AutorizacionPorTDC extends React.Component {
  constructor(props) {
    super(props);
    // console.log("################The Force Awakens (Remastered)");
    // console.log(this.props);
    this.state = {
        filtros_bandeja: {
          "TOKEN_P": global.token,
          "TIPAUTID_P": this.props.TIPAUTID
        },
        loading: true,
        BandejaTDC: [],
        data: [],
    };
    // console.log(this.state.empleado_keys);
  }

  async componentDidMount() {
    axios
      .post('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/restgBandejaListaAut',
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

  renderItem(data){
    let informacion;
    informacion = 
      <View style={{flexDirection: 'row'}}>
        <View style={{flex:1, margin:5}}>
          <Text style = {{fontWeight: "bold"}} >{data.item.BANAUTNDC}</Text>
          <Text > {strings('transactions.CNCIAS.CNCIASDSC')}: {data.item.CNCIASDSC}</Text>
        <Text > {strings('transactions.CNCDIR.CNCDIRNOM')}: {data.item.CNCDIRNOM}</Text>
        <Text > {strings('transactions.PMCTPR.PMCTPRDSC')}: {data.item.PMCTPRDSC}</Text>
        <Text > {strings('transactions.BANAUT.BANAUTFEC')}: {data.item.BANAUTFEC}</Text>
        <Text > {strings('modules.BandejaDeAutorizaciones.AutorizacionPorTDC.days_without_attending')}: {data.item.dias_sin_atender}</Text>
        </View>
      </View>
    if (data.item.BANAUTTDC == 'OMP'){
      return (
        <TouchableOpacity
          style={styles.emailItem}
          onPress={() => Actions.autorizacion_oc(data.item)}
        >
        {informacion}
        </TouchableOpacity>
      );
    }else {
      return(
        <TouchableOpacity style={styles.emailItem}> 
          {informacion} 
        </TouchableOpacity>
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
    console.log("####################### TIPO DE DOCUMENTO");
    console.log(tipoDeDoc)
    // console.log("########### The Last Jedi #####")
    // console.log(Bandeja)

    if (loading != true) {
      return (   
        <View style={styles.container}>   
          <Header
              backgroundColor='#003366'
              leftComponent={{ icon: "search", color: '#fff', onPress:() => console.log("#### Búsqueda") }}
              centerComponent={{ text: tipoDeDoc, style: { color: '#fff' } }}
          />
        <View style={styles.container}>
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