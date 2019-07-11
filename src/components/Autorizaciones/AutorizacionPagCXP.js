import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  FlatList,
  Alert,
  Linking,
  Dimensions
} from 'react-native';
import { ListItem, Overlay } from 'react-native-elements';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { strings } from '../../i18n';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import NumberFormat from 'react-number-format';
import LoadingScreen from '../Common/LoadingScreen';
import light from '../Common/mode';
import dark from '../Common/DarkMode';

export default class AutorizacionPagCXP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parametros: {
        "TOKEN_P": global.token,
        "CNCIASID_P": this.props.CNCIASID,
        "PAGOID_P": this.props.pagoid,
        "CNCMNDID_P":this.props.PMMoneid,
        "CNIDMAID_P":"ESP"
      },
      cxp_data: [],
      loading: true
    };
  }

  componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
    const keys = this.state.parametros; 
    axios.post('restgcompg', keys
     ).then(response => {
       if (response.data.SUCCESS){
        this.setState({
          cxp_data: response.data,
          loading: false
         });
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
     })
     .catch(error =>  console.log(error));
    
  }

  updateTitle() {
    Actions.refresh({title: strings('modules.BandejaDeAutorizaciones.AutorizacionPagCXP.title')});
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

  renderCXP(data){
    let estilos = this.estilo()
    //   console.log("######################## pdf")
    //   console.log(data)
    let PDF_OC;
    if (data.item.PDF_OC_SHOW){
        PDF_OC =
          <TouchableHighlight onPress={() =>
            Linking.openURL(data.item.PDF_OC_URL)}>
            <ListItem
              key={"1"}
              leftAvatar={{source: require( '../../../assets/images/reportePdf.jpg')}}
              title= {strings('modules.BandejaDeAutorizaciones.AutorizacionPagCXP.PDF_OC')}
            //   subtitle={strings("modules.BandejaDeAutorizaciones.AutorizacionPag.report_text")}
            />
          </TouchableHighlight>
    }
    let PDF_XML;
    if (data.item.PDF_XML_SHOW){
        PDF_XML =
          <TouchableHighlight onPress={() =>
            Linking.openURL(data.item.PDF_XML_URL)}>
            <ListItem
              key={"2"}
              leftAvatar={{source: require( '../../../assets/images/reportePdf.jpg')}}
              title= {strings('modules.BandejaDeAutorizaciones.AutorizacionPagCXP.PDF_XML')}
            //   subtitle={strings("modules.BandejaDeAutorizaciones.AutorizacionPag.report_text")}
            />
          </TouchableHighlight>
    }
    const PercentAnt = parseInt(data.item.ACMVOIPORA);
    return (
          <View style={styles.Contenedor}>
            <Text style={styles.Titulo}>#{data.item.PMNumDoc}</Text>
            {/* <Text style={styles.Total}> 
              {strings("transactions.ACOCPA.ACOCPAMNTIN")}:
              <NumberFormat value={parseFloat(data.item.ACOCPAMNTIN)} displayType={'text'} renderText={value => <Text style={styles.TotalArgent}> {value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>  
            </Text> */}
            <Text style={styles.subTitulo}>
              {strings('modules.BandejaDeAutorizaciones.AutorizacionPagCXP.CNTDOCDSC')}: 
              <Text style={styles.información}> {data.item.CNTDOCDSC}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.BandejaDeAutorizaciones.AutorizacionPagCXP.PMCTPRDSC')}: 
              <Text style={styles.información}> {data.item.PMCTPRDSC}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.BandejaDeAutorizaciones.AutorizacionPagCXP.PMNumDocOC')}: 
              <Text style={styles.NumOC}> {data.item.PMNumDocOC}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.BandejaDeAutorizaciones.AutorizacionPagCXP.PMFolioFac')}: 
              <Text style={styles.información}> {data.item.PMFolioFac}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.BandejaDeAutorizaciones.AutorizacionPagCXP.PMFechFac')}: 
              <Text style={styles.información}> {data.item.PMFechFac}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.BandejaDeAutorizaciones.AutorizacionPagCXP.PMFechVen')}: 
              <Text style={styles.información}> {data.item.PMFechVen}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.BandejaDeAutorizaciones.AutorizacionPagCXP.Pago')}: 
              <NumberFormat value={parseFloat( data.item.Pago )} displayType={'text'} renderText={value => <Text style={ estilos.contenidoMonto }> {value} </Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.BandejaDeAutorizaciones.AutorizacionPagCXP.Cantidad')}: 
              <NumberFormat value={parseFloat( data.item.Cantidad )} displayType={'text'} renderText={value => <Text style={ estilos.contenidoMonto }> {value} </Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.BandejaDeAutorizaciones.AutorizacionPagCXP.ACMVOIPORA')}: 
              <Text style={styles.información}> {data.item.ACMVOIPORA}%</Text>
            </Text>
            <ProgressBarAnimated
                width={Dimensions.get("window").width - 50}
                borderRadius={10}
                value={PercentAnt}
                backgroundColor="#d5edff"
              />
            {PDF_OC}
            {PDF_XML}  
          </View>
    );
  }

  render() { 
    let estilos = this.estilo()
    const loading = this.state.loading;
    const CXP = this.state.cxp_data.sdtRestCXPAsoc;

    if (loading != true) {
      return (   
        <View style={estilos.container}>
          <ScrollView style={estilos.ScrollContainer}>
            <FlatList
              data={CXP}
              keyExtractor= {(item, index) => CXP + index.toString()}
              renderItem={this.renderCXP.bind(this)}
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

const styles = StyleSheet.create({
  ocButton: {
    height: 40,
    width: '30%',
    borderRadius:10
  },
  Contenedor: {
    margin: 15
  },
  Titulo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 20,
    color: 'black'
  },
  subTitulo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 19
  },
  información: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 18,
    color: '#b7b6b6'
  },
  NumOC: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 19,
    color: 'rgb(38, 51, 140)',
  }
});