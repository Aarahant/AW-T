import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image,
  FlatList,
  TextInput,
  Button,
  ToastAndroid,
  Alert,
  Linking,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { ListItem, Overlay } from 'react-native-elements';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { strings } from '../../i18n';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import NumberFormat from 'react-number-format';
import LoadingScreen from '../Common/LoadingScreen';

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
    Actions.refresh({title: strings('modules.Autorizaciones.AutorizacionPagCXP.title')});
    clearInterval(this.titleInterval);
  }

  renderCXP(data){
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
              title= {strings('modules.Autorizaciones.AutorizacionPagCXP.PDF_OC')}
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
              title= {strings('modules.Autorizaciones.AutorizacionPagCXP.PDF_XML')}
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
              {strings('modules.Autorizaciones.AutorizacionPagCXP.CNTDOCDSC')} Tipo: 
              <Text style={styles.información}> {data.item.CNTDOCDSC}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.Autorizaciones.AutorizacionPagCXP.PMCTPRDSC')} Proyecto: 
              <Text style={styles.información}> {data.item.PMCTPRDSC}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.Autorizaciones.AutorizacionPagCXP.PMNumDocOC')} Número de Orden de Compra: 
              <Text style={styles.NumOC}> {data.item.PMNumDocOC}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.Autorizaciones.AutorizacionPagCXP.PMFolioFac')} Folio de Factura: 
              <Text style={styles.información}> {data.item.PMFolioFac}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.Autorizaciones.AutorizacionPagCXP.PMFechFac')} Fecha de Factura: 
              <Text style={styles.información}> {data.item.PMFechFac}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.Autorizaciones.AutorizacionPagCXP.PMFechVen')} Fecha de Vencimiento: 
              <Text style={styles.información}> {data.item.PMFechVen}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.Autorizaciones.AutorizacionPagCXP.Pago')} Monto Original: 
              <NumberFormat value={parseFloat( data.item.Pago )} displayType={'text'} renderText={value => <Text style={ styles.contenidoMonto }> {value} </Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.Autorizaciones.AutorizacionPagCXP.Cantidad')} Saldo Pendiente: 
              <NumberFormat value={parseFloat( data.item.Cantidad )} displayType={'text'} renderText={value => <Text style={ styles.TotalArgent }> {value} </Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings('modules.Autorizaciones.AutorizacionPagCXP.ACMVOIPORA')} Porcentaje de anticipo: 
              <Text style={styles.información}> {data.item.ACMVOIPORA}%</Text>
            </Text>
            <ProgressBarAnimated
                width={Dimensions.get("window").width - 50}
                borderRadius={10}
                value={PercentAnt}
                backgroundColor="#d5edff"
              />
            {PDF_OC}
            {/* {PDF_XML}   */}
          </View>
    );
  }


  render() { 
    const loading = this.state.loading;
    const CXP = this.state.cxp_data.sdtRestCXPAsoc;

    if (loading != true) {
      return (   
        <View style={styles.container}>
          <ScrollView style={styles.contentContainer}>
            <View style ={styles.separadorContainer}>
              <Text style = {styles.separador}>
                {strings('modules.Autorizaciones.AutorizacionPagCXP.CXP')}
                Cuentas por Pagar
              </Text>
            </View>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  justificación: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  at:{
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    color: 'rgb(232,102,23)',
    fontWeight: 'bold',
    fontSize: 22,
  },
  separador: {
    alignItems: 'flex-start',
    // justifyContent: 'center',
    // fontWeight: 'bold',
    fontSize: 24,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 15
    // color: 'white'
  },
  separadorContainer:{
    alignItems: 'flex-start',
    // justifyContent: 'center',
    backgroundColor: '#f2f2f2'
  },
  profilepicWrap:{
      width: 180,
      height: 180,
      borderRadius: 100,
      borderColor: 'rgb(30,43,63)',
      borderWidth: 16,
  },
  profilepic:{
      flex: 1,
      width: null,
      borderRadius: 75,
      borderColor: 'rgb(10,23,43)',
      borderWidth: 4,
  },
  contentContainer: {
    // paddingVertical: 10,
    height: '100%'
  },
  innerContentPadding: {
    margin: 10
  },
  navCardTouch: {
    marginVertical: 4,
    marginHorizontal: 2,
  },
  navCard: {
    elevation: 2,
    backgroundColor: 'white', 
  },
  navCardContent: {
    margin: 10,
  },
  descriptionArea: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  descriptionText: {
    color: 'grey',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 16
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgb(66, 66, 66)'
  },
  postContent: {
    fontSize: 14,
    color: 'rgb(86, 86, 86)'
  },
  subtitulo: {
    color: 'black',
    fontFamily: 'sans-serif-condensed',
    fontSize: 18,
    marginTop: 10
  },
  subtituloChido: {
    color: 'black',
    fontFamily: 'sans-serif-condensed',
    fontSize: 19
  },
  contenido: {
    fontFamily: 'sans-serif-condensed',
    color: 'grey',
    fontSize: 18
  },
  contenidoLargo: {
    fontFamily: 'sans-serif-condensed',
    color: 'grey',
    fontSize: 18,
    textAlign: 'justify'
  },
  contenidoNoDoc: {
    fontFamily: 'Roboto',
    color: 'rgb(38, 51, 140)',
    fontSize: 20
  },
  contenidoMonto: {
    fontFamily: 'sans-serif-condensed',
    color: 'rgb(0, 143, 41)',
    fontSize: 18
  },
  datosContainer: {
    paddingVertical: 10,
    paddingHorizontal: 25
  },
  pieAutorización: {
    flex: 1,
    // marginTop: 60,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(13, 114, 109)'
  },
  titleJustificacion: {
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 6,
    color: 'white'
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    marginTop: 5
  },
  textInputStyle: {
    padding: 4,
    fontSize: 16,
    flex: 1,
    backgroundColor: 'rgb(103, 173, 179)',
    marginHorizontal: 5
  },
  Contenedor: {
    margin: 15
  },
  Titulo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 20,
    color: 'black'
  },
  TotalArgent: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 18,
    color: 'rgb(0, 143, 41)'
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
  },
  estatuts_autorizo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 17,
    color: 'rgb(124, 183, 62)'
  },
  estatuts_cancelado: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 17,
    color: 'rgb(19, 92, 121)'
  },
  estatuts_rechazo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 17,
    color: 'rgb(216, 87, 57)'
  },
  kds_logo_image: {
    height: 260,
    width: 260,
  }, 
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});