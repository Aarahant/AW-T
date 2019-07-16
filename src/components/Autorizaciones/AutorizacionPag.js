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
  Alert
} from 'react-native';
import { Overlay } from 'react-native-elements';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { strings } from '../../i18n';
import NumberFormat from 'react-number-format';
import LoadingScreen from '../Common/LoadingScreen';
import light from '../Common/mode';
import dark from '../Common/DarkMode';

export default class AutorizacionPag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parametros: {
        "TOKEN_P": global.token,
        "BANAUTCIA_P": this.props.BANAUTCIA,
        // "BANAUTTDC_P": this.props.BANAUTTDC,
        "BANAUTNDC_P": this.props.BANAUTNDC
      },
      aut_data: [],
      loading: true,
      justificacion: '',
      processingTransaction: false
    };
  }

  componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
    const keys = this.state.parametros; 
    axios.post('restgAutPag', keys
     ).then(response => {
       if (response.data.SUCCESS){
        this.setState({
          aut_data: response.data,
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
    Actions.refresh({title: strings("modules.BandejaDeAutorizaciones.AutorizacionPag.title")});
    clearInterval(this.titleInterval);
  }

  handleTransactionProcessError() {
    this.setState({ processingTransaction: false });
    ToastAndroid.showWithGravityAndOffset(error,ToastAndroid.LONG,ToastAndroid.BOTTOM,0,50);
  }

  onJustificacionChange(text) {
    this.setState({ justificacion: text });
  }

  autorizarPag(){
    Alert.alert(
      strings("modules.BandejaDeAutorizaciones.AutorizacionPag.messages.attention"),
      strings('modules.BandejaDeAutorizaciones.AutorizacionPag.messages.confirmAutorizar'),
      [
        {text: strings("modules.BandejaDeAutorizaciones.AutorizacionPag.messages.no"), style: 'cancel'},
        {text: strings("modules.BandejaDeAutorizaciones.AutorizacionPag.messages.yes"), onPress: () => this.impactarAutPag(1)},
      ]
    );
  }

  reachazarPag(){
    const justificacion = this.state.justificacion
    if (justificacion != '') {
      Alert.alert(
        strings("modules.BandejaDeAutorizaciones.AutorizacionPag.messages.attention"),
        strings('modules.BandejaDeAutorizaciones.AutorizacionPag.messages.confirmRechazar'),
        [
          {text: strings("modules.BandejaDeAutorizaciones.AutorizacionPag.messages.no"), style: 'cancel'},
          {text: strings("modules.BandejaDeAutorizaciones.AutorizacionPag.messages.yes"), onPress: () => this.impactarAutPag(2)},
        ]
      );
    } else {
      ToastAndroid.showWithGravityAndOffset(
        strings("modules.BandejaDeAutorizaciones.AutorizacionPag.validations.missing_justification"),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  }

  impactarAutPag(Autorizar){
    console.log("################ Autorizar");
    const datos = this.state.aut_data
    const parm = {
      "TOKEN_P": global.token,
      "CNCIASID_P": datos.CNCIASID,
      "PAGOID_P": datos.pagoid,
      "PAGOAUTCOM_P": this.state.justificacion,
      "CNCMNMID_P": datos.CNCMNMID,
      "AUTORIZAR_P": Autorizar
    }
    console.log(parm);

    this.setState({ processingTransaction: true });
    axios.post('restpAutPag', parm
    ).then(response => {
      console.log("############## Autorizado?")
      console.log(response)
      if (response.data.SUCCESS){
        this.setState({ processingTransaction: false });
        Actions.pop({ refresh: {key: Math.random()} }); // Sale y actualiza.
      }  else {
        this.setState({ processingTransaction: false });
        Alert.alert(
          strings("common.session.alert_title"),
          strings("common.session.alert_content"),
          [
            {text: strings('common.session.alert_ok'), onPress: () => Actions.auth()}
          ],
          {cancelable: false}
        );
        Actions.auth();
      }
    }).catch(error => this.handleTransactionProcessError(error));
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

  render() { 
    let estilos = this.estilo()
    const loading = this.state.loading;
    const datos = this.state.aut_data;
    const justificacion = this.state.justificacion;
    let ProgPagoID;
    if (datos.PROPAGID > 0){
        ProgPagoID =
            <React.Fragment>
                <Text style={estilos.subtitulo}> {strings('modules.BandejaDeAutorizaciones.AutorizacionPag.ProgPag')}</Text>
                <Text style={estilos.contenido}>{datos.PROPAGID}</Text>
            </React.Fragment>
    }

    let anticipo;
    if (datos.PMTipoDoc == 'ANT') {
        anticipo =
            <React.Fragment>
                <Text style={estilos.contenidoBold}> {strings('modules.BandejaDeAutorizaciones.AutorizacionPag.IncludesANT')}</Text>
            </React.Fragment>
    }

    if (loading != true) {
      return (   
        <View style={estilos.container}>
          <ScrollView style={estilos.ScrollContainer} contentContainerStyle={estilos.contentContainer}>
            <Overlay
                isVisible={this.state.processingTransaction}
                windowBackgroundColor="rgba(255, 255, 255, .3)"
                overlayBackgroundColor="rgba(255, 255, 255, .0)"
                fullScreen= {true}
              >
              <View style={estilos.loadingContainer}>
                <Image style={estilos.kds_logo_image} source={require("../../../assets/gifs/bars6.gif")}/>
              </View>
            </Overlay>
            <View style={estilos.datosContainer}> 
              <Text style={estilos.subtituloGrande}>{strings('modules.BandejaDeAutorizaciones.AutorizacionPag.PAGOID')}</Text>
              <Text style={estilos.contenidoNoDoc}>#{datos.pagoid}   {anticipo}</Text>
              {ProgPagoID}
              <Text style={estilos.subtitulo}>{strings('modules.BandejaDeAutorizaciones.AutorizacionPag.CNUSERDSC')}</Text>
              <Text style={estilos.contenido}>{datos.CNUSERDSC}</Text>
              <Text style={estilos.subtitulo}>{strings('modules.BandejaDeAutorizaciones.AutorizacionPag.CNCDIRNOM')}</Text>
              <Text style={estilos.contenido}>{datos.CNCDIRNOM}</Text>
              <Text style={estilos.subtitulo}>{strings('modules.BandejaDeAutorizaciones.AutorizacionPag.CANTIDAD')}</Text>
              <Text style={estilos.contenido}>
                <NumberFormat value={parseFloat(datos.CANTIDAD)} displayType={'text'} renderText={value => <Text style={estilos.contenidoMonto}>{value} {datos.CNCMNMID}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              </Text> 
              <Text style={estilos.subtitulo}>{strings('modules.BandejaDeAutorizaciones.AutorizacionPag.CNCD03DSC')}</Text>
              <Text style={estilos.contenido}>{datos.CNCD03DSC}</Text> 
              <Text style={estilos.subtitulo}>{strings('modules.BandejaDeAutorizaciones.AutorizacionPag.PAGOFEC')}</Text>
              <Text style={estilos.contenido}>{datos.PAGOFEC}</Text> 
              <Text style={estilos.subtitulo}>{strings('modules.BandejaDeAutorizaciones.AutorizacionPag.PAGOFEPR')}</Text>
              <Text style={estilos.contenidoLargo}>{datos.PAGOFEPR}</Text>
              <Text>{" "}</Text>
              <TouchableHighlight style ={styles.detalleButton}>
                <Button title={strings('modules.BandejaDeAutorizaciones.AutorizacionPag.detail')} color="rgb(19, 92, 121)" onPress={() => Actions.autorizacion_pag_cxp(datos)}/>
              </TouchableHighlight>
            </View>

            <View style = {estilos.pieAutorización}>
              <View style ={estilos.header}>
                <Text style = {estilos.titleJustificacion}>
                  {strings('modules.BandejaDeAutorizaciones.AutorizacionPag.Comentarios')}
                </Text>
              </View>
              <View style={estilos.justificación}>
                <TextInput
                //   placeholder={strings("modules.BandejaDeAutorizaciones.AutorizacionPag.write_justification")}
                  value={justificacion}
                  autoCorrect={true}
                  multiline = {true}
                  numberOfLines={1}
                  maxLength={250}
                  onChangeText={this.onJustificacionChange.bind(this)}
                  style={estilos.textInputStyle}
                />
              </View>
              <View style={estilos.containerButton}>
                <TouchableHighlight style ={styles.pagButton}>
                  <Button title={strings('modules.BandejaDeAutorizaciones.AutorizacionPag.Autorizar')} color="rgb(124, 183, 62)" onPress={this.autorizarPag.bind(this)}/>
                </TouchableHighlight>
                <Text>{" "}</Text>
                <TouchableHighlight style ={styles.pagButton}>
                  <Button title={strings('modules.BandejaDeAutorizaciones.AutorizacionPag.NoAutorizar')} color="rgb(216, 87, 57)" onPress={this.reachazarPag.bind(this)}/>
                </TouchableHighlight>
              </View>  
            </View>
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
  pagButton: {
    height: 40,
    width: '30%',
    borderRadius:10
  },
  detalleButton: {
    height: 40,
    borderRadius:10,
    marginTop: 5
  }
});