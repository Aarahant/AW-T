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

export default class AutorizacionRav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parametros: {
        "TOKEN_P": global.token,
        "BANAUTCIA_P": this.props.BANAUTCIA,
        "BANAUTTDC_P": this.props.BANAUTTDC,
        "BANAUTNDC_P": this.props.BANAUTNDC
      },
      aut_data: [],
      loading: true,
      justificacion: '',
      pdfLink: '',
      processingTransaction: false
    };
  }

  componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
    // console.log("############### Han Solo")
    const keys = this.state.parametros;
    axios.post('restgAutRegistroAvance', keys
     ).then(response => {
       if (response.data.SUCCESS){
        this.setState({
          aut_data: response.data,
          loading: false
        });
        // Solicitud de link para pdf de orden de compra
        const pdfParm = {
          "TOKEN_P": global.token,
          "CNIDMAID_P": "ESP",
          "ACOCPACIA_P": keys.BANAUTCIA_P,
          "ACOCPATDC_P": this.state.aut_data.CNTDOCID,
          "ACOCPADOC_P": this.state.aut_data.ACMROIDOC
        };
        axios.post('restgRePreOC', pdfParm
        ).then(response => {
          if (response.data.SUCCESS){
            this.setState({
              pdfLink: response.data.Link,
            });
            console.log("################ ZELDA");
            console.log(this.state.pdfLink);
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
    Actions.refresh({title: strings("modules.BandejaDeAutorizaciones.AutorizacionRav.title")});
    clearInterval(this.titleInterval);
  }

  renderNiveles(data){
    let estilos = this.estilo()
    let estatusAutStyle;
    switch (data.item.ACRAVPANAUHE){
      case 0:
        estatusAutStyle = estilos.información;
        break;
      case 1:
        estatusAutStyle = styles.estatuts_autorizo;
        break;
      case 2:
        estatusAutStyle = styles.estatuts_cancelado;
        break;
      case 3:
        estatusAutStyle = styles.estatuts_rechazo;
        break;
      default:
        estatusAutStyle = estilos.información;
        break;
    }
    if (data.item.pendiente_aut){
      return (
        <View style={styles.Contenedor}>
          <Text style={estilos.postTitle}>{data.item.ACRAVPANNIV} - {data.item.CNUSERDSC}</Text>
          <Text style={estilos.subTitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionRav.status")}:
            <Text  style={estatusAutStyle}> {data.item.estatus_aut}</Text>
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.Contenedor}>
          <Text style={estilos.postTitle}>{data.item.ACRAVPANNIV} - {data.item.CNUSERDSC}</Text>
          <Text style={estilos.subTitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionRav.status")}:
            <Text style={estatusAutStyle}> {data.item.estatus_aut}</Text>
          </Text>
          <Text style={estilos.subTitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionRav.date")}:
            <Text style={estilos.información}> {data.item.ACRAVPANFECOP}</Text>
          </Text>
          <Text style={estilos.subTitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionRav.comments")}:
            <Text style={estilos.información}> {data.item.ACRAVPANCOM}</Text>
          </Text>
        </View>
      );
    }
  }

  aceptarRav(){
    const info = {
      justificacion: this.state.justificacion,
    }
    if (info.justificacion == ''){
      ToastAndroid.showWithGravityAndOffset(
        strings("modules.BandejaDeAutorizaciones.AutorizacionRav.validations.missing_justification"),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        0,
        50,
      );
    } else{
      Alert.alert(
        strings("modules.BandejaDeAutorizaciones.AutorizacionRav.messages.attention"),
        strings("modules.BandejaDeAutorizaciones.AutorizacionRav.messages.authorization"),
        [
          {text: strings("modules.BandejaDeAutorizaciones.AutorizacionRav.messages.no"), style: 'cancel'},
          {text: strings("modules.BandejaDeAutorizaciones.AutorizacionRav.messages.yes"), onPress: () => this.impactarRav(1)},
        ]
      );
    }
  }

  rechazarRav(){
    const info = {
      justificacion: this.state.justificacion
    }
    if (info.justificacion == ''){
      ToastAndroid.showWithGravityAndOffset(
        strings("modules.BandejaDeAutorizaciones.AutorizacionRav.validations.missing_justification"),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        0,
        50,
      );
    } else{
      Alert.alert(
        strings("modules.BandejaDeAutorizaciones.AutorizacionRav.messages.attention"),
        strings("modules.BandejaDeAutorizaciones.AutorizacionRav.messages.rejection"),
        [
          {text: strings("modules.BandejaDeAutorizaciones.AutorizacionRav.messages.no"), style: 'cancel'},
          {text: strings("modules.BandejaDeAutorizaciones.AutorizacionRav.messages.yes"), onPress: () => this.impactarRav(2)},
        ]
      );
    }
  }

  impactarRav(Autorizar){
    // Desglose de significado de valores de Autorizar
    // 1 = Autoriza
    // 2 = Rechaza
    const datos = this.state.aut_data;
    const parm = this.state.parametros;
    const validacion = {
      "TOKEN_P": global.token,
      "BANAUTCIA_P": parm["BANAUTCIA_P"],
      "BANAUTTDC_P": parm["BANAUTTDC_P"],
      "BANAUTNDC_P": parm["BANAUTNDC_P"],
      "Autorizar_P": Autorizar,
      "ACOCPAL2COM_P": this.state.justificacion ,
    };
    console.log("############# Validacion");
    console.log(validacion);
    this.setState({ processingTransaction: true });
    axios.post('restpArcRegistroAvance',
      validacion
    )
    .then(response => {
      if (response.data.SUCCESS){
        this.setState({ processingTransaction: false });
        console.log(response.data)
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
    })
    .catch(error => this.handleTransactionProcessError(error));
  }

  handleTransactionProcessError() {
    this.setState({ processingTransaction: false });
    ToastAndroid.showWithGravityAndOffset(error,ToastAndroid.LONG,ToastAndroid.BOTTOM,0,50);
  }

  onJustificacionChange(text) {
    this.setState({ justificacion: text });
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
    const niveles = this.state.aut_data.sdtRestNivelesAutAvance;
    const justificacion = this.state.justificacion;
    const ACMVOIPORA = parseFloat(datos.ACMVOIPORA);
    const ACMROIPAREG = parseFloat(datos.ACMROIPAREG);
    const PAvanceConAutorizacion = parseFloat(datos.PAvanceConAutorizacion);
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
              <Text style={estilos.subtituloGrande}>{strings("modules.BandejaDeAutorizaciones.AutorizacionRav.number")}</Text>
              <Text style={estilos.contenidoNoDoc}>#{datos.ACRAVPANDOC}</Text>
              <Text style={estilos.subtitulo}>{strings("transactions.ACMROI.ACMROIFDOC")}</Text>
              <Text style={estilos.contenido}>{datos.ACMROIFDOC}</Text>
              <Text style={estilos.subtitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionRav.procurer")}</Text>
              <Text style={estilos.contenido}>{datos.comp}</Text>
              <Text style={estilos.subtitulo}>{strings("transactions.PMCTCG.PMCTCGDSC")}</Text>
              <Text style={estilos.contenido}>{datos.PMCTCGDSC}</Text>
              <Text style={estilos.subtitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionRav.advance")}</Text>
              <NumberFormat value={parseFloat(datos.AvanceMnt)} displayType={'text'} renderText={value => <Text style={estilos.contenidoMonto}>{value} {datos.CNCMNMID}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              <Text style={estilos.subtitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionRav.amortization")}</Text>
              <NumberFormat value={parseFloat(datos.AmortizacionMnt)} displayType={'text'} renderText={value => <Text style={estilos.contenidoMonto}>{value} {datos.CNCMNMID}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              <Text style={estilos.subtitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionRav.advance_minus_amortization")}</Text>
              <NumberFormat value={parseFloat(datos.total)} displayType={'text'} renderText={value => <Text style={estilos.contenidoMonto}>{value} {datos.CNCMNMID}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              <Text style={estilos.subtitulo}>{strings("transactions.ACMVOI.ACMVOICOM")}</Text>
              <Text style={estilos.contenidoLargo}>{datos.ACMVOICOM}</Text>
              <Text style={estilos.subtitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionRav.service_period")}</Text>
              <Text style={estilos.contenido}>{datos.ACMROIFIREG} - {datos.ACMROIFFREG}</Text>
              <Text style={estilos.subtitulo}>{strings("transactions.ACMROI.ACMROIOBST")}</Text>
              <Text style={estilos.contenidoLargo}>{datos.ACMROIOBST}</Text>
            </View>
            <View style ={estilos.separadorContainer}>
              <Text style = {estilos.separador}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.purchase_order_details")}
              </Text>
            </View>
            <View style={styles.Contenedor}>
              <Text style={estilos.Titulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionRav.number")}: 
                <Text style={estilos.contenidoNoDoc}> #{datos.ACMROIDOC}</Text>
              </Text>
              <Text style={estilos.TotalInsumo}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.total_without_tax")}:
                <NumberFormat value={parseFloat(datos.TotoSinImpuesto)} displayType={'text'} renderText={value => <Text style={estilos.TotalInsumoArgent}> {value} {datos.CNCMNMID_F}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              </Text>
              <Text style={estilos.subTitulo}>
                {strings("transactions.PMCTPR.PMCTPRDSC")}:
                <Text style={estilos.información}> {datos.PMCTPRDSC}</Text>
              </Text>
              <Text style={estilos.subTitulo}>
                {strings("transactions.ACMVOI.ACMVOIPORA")}:
                <Text style={estilos.información}> {datos.ACMVOIPORA}%</Text>
              </Text>
              <ProgressBarAnimated
                width={Dimensions.get("window").width - 140}
                height={15}
                borderRadius={10}
                value={ACMVOIPORA}
                backgroundColor="#d5edff"
              />
              <Text style={estilos.subTitulo}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.advance_without_tax")}:
                <Text style={estilos.información}> {datos.AnticipoSinImpuesto}</Text>
              </Text>
              <Text style={estilos.subTitulo}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.amortized_advance")}:
                <NumberFormat value={parseFloat(datos.AnticipoAmortizado)} displayType={'text'} renderText={value => <Text style={estilos.información}> {value} </Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              </Text>
              <Text style={estilos.subTitulo}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.advance_to_amortize")}:
                <NumberFormat value={parseFloat(datos.AnticipoPorAmortizar)} displayType={'text'} renderText={value => <Text style={estilos.información}> {value} </Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              </Text>
              <Text style={estilos.subTitulo}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.authorized_progress_percentage")}:
                <NumberFormat value={parseFloat(datos.PAvanceConAutorizacion)} displayType={'text'} renderText={value => <Text style={estilos.información}> {value}% </Text>} thousandSeparator={true} prefix={''}></NumberFormat>
              </Text>
              <ProgressBarAnimated
                width={Dimensions.get("window").width - 140}
                height={15}
                borderRadius={10}
                value={PAvanceConAutorizacion}
                backgroundColor="#d5edff"
              />
              <Text style={estilos.subTitulo}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.authorized_progress_amount")}:
                <NumberFormat value={parseFloat(datos.MAvanceConAutorizacion)} displayType={'text'} renderText={value => <Text style={estilos.información}> {value} </Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              </Text>
              <Text style={estilos.subTitulo}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.pending_amount")}:
                <NumberFormat value={parseFloat(datos.MontoPendiente)} displayType={'text'} renderText={value => <Text style={estilos.información}> {value} </Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              </Text>
            </View>
            
            <ListItem
              onPress={() =>
              Linking.openURL('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/' + this.state.pdfLink)}
              containerStyle={estilos.PressListItem}
              leftAvatar={{source: require( '../../../assets/images/reportePdf.jpg')}}
              title= {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.report_title")}
              subtitle={strings("modules.BandejaDeAutorizaciones.AutorizacionRav.report_text")}
              titleStyle={estilos.titleListItem}
              subtitleStyle={estilos.subtitleListItem}
            />
            <View style ={estilos.separadorContainer}>
              <Text style = {estilos.separador}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.authorization_levels")}
              </Text>
            </View>
            <FlatList
              data={niveles}
              keyExtractor= {(item, index) => niveles + index.toString()}
              renderItem={this.renderNiveles.bind(this)}
            />
            <View style ={estilos.separadorContainer}>
              <Text style = {estilos.separador}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.service_detail")}
              </Text>
            </View>
            <View style={styles.Contenedor}>
              <Text style={estilos.Titulo}>{datos.INPRODDSC}</Text>
              <Text style={estilos.TotalInsumo}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.price")}:
                <NumberFormat value={parseFloat(datos.MONTO)} displayType={'text'} renderText={value => <Text style={estilos.TotalInsumoArgent}> {value} {datos.CNCMNMID}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              </Text>
              <Text style={estilos.informaciónGrande}>{datos.ACMVORDSC4}</Text>
              <Text style={estilos.subTitulo}>
                {strings("transactions.ACMVOI.ACMVOIFDOC")}:
                <Text style={estilos.información}> {datos.ACMVOIFDOC}</Text>
              </Text>
              <Text style={estilos.subTitulo}>
                {strings("transactions.ACMVOI.ACMVOIFCEP")}:
                <Text style={estilos.información}> {datos.ACMVOIFCEP}</Text>
              </Text>
              <Text style={estilos.subTitulo}>
                {strings("transactions.ACMVOI.ACMVOIQTO")}:
                <NumberFormat value={parseFloat(datos.ACMVOIQTO)} displayType={'text'} renderText={value => <Text style={estilos.información}> {value} {datos.ACMVOIUMT} </Text>} thousandSeparator={true} prefix={''}></NumberFormat>
              </Text>
              <Text style={estilos.subTitulo}>
                {strings("transactions.ACMROI.ACMROIFP")}:
                <NumberFormat value={parseFloat(datos.PRECIO)} displayType={'text'} renderText={value => <Text style={estilos.información}> {value} {datos.CNCMNMID}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              </Text>
              <Text style={estilos.subTitulo}>
                {strings("transactions.ACMROI.ACMROIPAREG")}:
                <NumberFormat value={parseFloat(datos.ACMROIPAREG)} displayType={'text'} renderText={value => <Text style={estilos.información}> {value}% </Text>} thousandSeparator={true} prefix={''}></NumberFormat>
              </Text>
              <ProgressBarAnimated
                width={Dimensions.get("window").width - 140}
                height={15}
                borderRadius={10}
                value={ACMROIPAREG}
                backgroundColor="#d5edff"
              />
              <Text style={estilos.subTitulo}>
                {strings("transactions.ACMVOI.ACMVOICOM")}:
                <Text style={estilos.información}> {datos.ACMVOICOM}</Text>
              </Text>
            </View>
            <View style = {estilos.pieAutorización}>
              <View style ={estilos.header}>
                <Text style = {estilos.titleJustificacion}>
                  {strings("modules.BandejaDeAutorizaciones.AutorizacionRav.justification")}
                </Text>
              </View>
              <View style={estilos.justificación}>
                <TextInput
                  placeholder={strings("modules.BandejaDeAutorizaciones.AutorizacionRav.write_justification")}
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
                <TouchableHighlight style ={styles.ocButton}>
                  <Button title={strings("modules.BandejaDeAutorizaciones.AutorizacionRav.accept")}  color="rgb(124, 183, 62)" onPress={this.aceptarRav.bind(this)}/>
                </TouchableHighlight>
                <Text>{" "}</Text>
                <TouchableHighlight style ={styles.ocButton}>
                  <Button title={strings("modules.BandejaDeAutorizaciones.AutorizacionRav.reject")} color="#rgb(216, 87, 57)" onPress={this.rechazarRav.bind(this)}/>
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
  ocButton: {
    height: 40,
    width: '30%',
    borderRadius:10
  },
  Contenedor: {
    margin: 15
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
  }
});
