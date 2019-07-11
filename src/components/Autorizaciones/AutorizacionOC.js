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
} from 'react-native';
import { ListItem, Overlay } from 'react-native-elements';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { strings } from '../../i18n';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import NumberFormat from 'react-number-format';
import LoadingScreen from '../Common/LoadingScreen';
import light from "../Common/mode";
import dark from "../Common/DarkMode";

export default class AutorizacionOC extends React.Component {
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
      processingTransaction: false,
      estilo: global.style
    };
  }

  componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
    const keys = this.state.parametros; 
    axios.post('restgAutOrdenCompra', keys
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
    
    const pdfParm = {
      "TOKEN_P": global.token,
      "CNIDMAID_P": "ESP",
      "ACOCPACIA_P": keys.BANAUTCIA_P,
      "ACOCPATDC_P": keys.BANAUTTDC_P,
      "ACOCPADOC_P": keys.BANAUTNDC_P
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
  }

  updateTitle() {
    Actions.refresh({title: strings("modules.BandejaDeAutorizaciones.AutorizacionOC.title")});
    clearInterval(this.titleInterval);
  }

  renderNiveles(data){
    let estilos;
    switch (this.state.estilo){
      case 'light':
        estilos = light;
        break;
      case 'dark':
        estilos = dark;
        break;
      default:
        estilos = light;
        break; 
    }

    let estatusAutStyle;
    switch (data.item.ACOCPAAUHE){
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
          <Text style={styles.postTitle}>{data.item.ACOCPAL2NIVEL} - {data.item.CNUSERDSC}</Text>
          <Text style={estilos.subTitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.status")}:
            <Text  style={estatusAutStyle}> {data.item.estatus_aut}</Text>
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.Contenedor}>
          <Text style={styles.postTitle}>{data.item.ACOCPAL2NIVEL} - {data.item.CNUSERDSC}</Text>
          <Text style={estilos.subTitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.status")}: 
            <Text style={estatusAutStyle}> {data.item.estatus_aut}</Text>
          </Text>
          <Text style={estilos.subTitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.date")}: 
            <Text style={estilos.información}> {data.item.ACOCPAL2FECOP}</Text>
          </Text>
          <Text style={estilos.subTitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.comments")}: 
            <Text style={estilos.información}> {data.item.ACOCPAL2COM}</Text>
          </Text>
        </View>
      );
    }
  }

  renderInsumos(data){
    let estilos;
    switch (this.state.estilo){
      case 'light':
        estilos = light;
        break;
      case 'dark':
        estilos = dark;
        break;
      default:
        estilos = light;
        break; 
    }
    return (
          <View style={styles.Contenedor}>
            <Text style={styles.TituloInsumo}>{data.item.INPRODDSC}</Text>
            <Text style={styles.TotalInsumo}> 
              {strings("transactions.ACOCPA.ACOCPAMNTIN")}:
              <NumberFormat value={parseFloat(data.item.ACOCPAMNTIN)} displayType={'text'} renderText={value => <Text style={estilos.TotalInsumoArgent}> {value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>  
            </Text>
            <Text style={estilos.subTitulo}>
              {strings("transactions.ACMVOI.ACMVOIDCP3")}:
              <Text style={estilos.información}> {data.item.ACMVOIDCP3}  </Text>  
              {strings("transactions.ACMVOI.ACMVOIDLP3")}: 
              <Text style={estilos.información}> {data.item.ACMVOIDLP3}</Text>
             </Text>
            <Text style={estilos.subTitulo}>
              {strings("transactions.ACOCPA.ACOCPAFOC1")}: 
              <Text style={estilos.información}> {data.item.ACOCPAFOC1}</Text>
            </Text> 
            <Text style={estilos.subTitulo}>
              {strings("transactions.PMCTCG.PMCTCGDSC")}: 
              <Text style={estilos.información}> {data.item.PMCTCGDSC}</Text>
            </Text>
            <Text style={estilos.subTitulo}> 
              {strings("transactions.ACOCPA.ACOCPAQTY")}:
              <NumberFormat value={parseFloat(data.item.ACOCPAQTY)} displayType={'text'} renderText={value => <Text style={estilos.información}> {value} {data.item.ACOCPAUM} </Text>} thousandSeparator={true} prefix={''}></NumberFormat> 
              {strings("transactions.ACMVOI.ACMVOIQTA")}:
              <NumberFormat value={parseFloat(data.item.ACMVOIQTA)} displayType={'text'} renderText={value => <Text style={estilos.información}> {value} </Text>} thousandSeparator={true} prefix={''}></NumberFormat> 
            </Text>
            <Text style={estilos.subTitulo}> 
              {strings("transactions.ACOCPA.ACOCPAPU")}:
              <NumberFormat value={parseFloat(data.item.ACOCPAPU)} displayType={'text'} renderText={value => <Text style={estilos.información}> {value} </Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
            </Text>
            <Text style={estilos.subTitulo}>
              {strings("transactions.ACMVOI.ACMVOICOM")}: 
              <Text style={estilos.información}> {data.item.ACMVOICOM}</Text>
            </Text> 
          </View>
    );
  }

  aceptarOC(){
    const info = {
      justificacion: this.state.justificacion,
      Ban: this.state.aut_data.CNTPGOMMSJ,
      Pago: this.state.aut_data.CNTPGODSC
    }
    if (info.justificacion == ''){
      ToastAndroid.showWithGravityAndOffset(
        strings("modules.BandejaDeAutorizaciones.AutorizacionOC.validations.missing_justification"),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else{
      if (info.Ban == "S"){
        Alert.alert(
          strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.attention"),
          strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.authorization_s", { info_pago: info.Pago }),
          [
            {text: strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.no"), style: 'cancel'},
            {text: strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.yes"), onPress: () => this.impactarOC(1)},
          ]
        );
      } else {
        Alert.alert(
          strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.attention"),
          strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.authorization"),
          [
            { text: strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.no"), style: 'cancel'},
            { text: strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.yes"), onPress: () => this.impactarOC(1)},
          ]
        );
      }
    }
  }

  rechazarOC(){
    const info = {
      justificacion: this.state.justificacion
    }
    if (info.justificacion == ''){
      ToastAndroid.showWithGravityAndOffset(
        strings("modules.BandejaDeAutorizaciones.AutorizacionOC.validations.missing_justification"),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else{
      Alert.alert(
        strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.attention"),
        strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.rejection"),
        [
          {text: strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.no"), style: 'cancel'},
          {text: strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.yes"), onPress: () => this.impactarOC(3)},
        ]
      );
    }
  }

  cancelarOC(){
    const info = {
      justificacion: this.state.justificacion
    }
    if (info.justificacion == ''){
      ToastAndroid.showWithGravityAndOffset(
        strings("modules.BandejaDeAutorizaciones.AutorizacionOC.validations.missing_justification"),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else{
      Alert.alert(
        strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.attention"),
        strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.cancelation"),
        [
          {text: strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.no"), style: 'cancel'},
          {text: strings("modules.BandejaDeAutorizaciones.AutorizacionOC.messages.yes"), onPress: () => this.impactarOC(2)},
        ]
      );
    }
  }

  impactarOC(Autorizar){
    // Desglose de significado de valores de Autorizar
    // 1 = Autoriza
    // 2 = Cancela 
    // 3 = Rechaza
    const datos = this.state.aut_data;
    const parm = this.state.parametros;
    const validacion = {
      "TOKEN_P": global.token,
      "CONGLOSISVALC_P": datos.CONGLOSISVALC,
      "ACOCPADOC_P": datos.ACOCPADOC,
      "ACOCPACIA_P": parm["BANAUTCIA_P"],
      "ACOCPATDC_P": parm["BANAUTTDC_P"],
      "PMCTPRID_P": datos.PMCTPRID,
      "Autorizar_P": Autorizar,
      "ACOCPAL2COM_P": this.state.justificacion ,
      "ACMVORCON_P": datos.ACMVORCON,
      "auxACOCPAMNT_P": datos.ACOCPAMNT
    };
    console.log("############# Validacion");
    console.log(validacion);
    this.setState({ processingTransaction: true });
    axios.post('restpArcOrdenCompra', 
      validacion
    )
    .then(response => {
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

  handleTransactionProcessError() {
    this.setState({ processingTransaction: false });
    ToastAndroid.showWithGravityAndOffset(error,ToastAndroid.LONG,ToastAndroid.BOTTOM,0,50);
  }

  onJustificacionChange(text) {
    this.setState({ justificacion: text });
  }

  render() { 
    const loading = this.state.loading;
    const datos = this.state.aut_data;
    const insumos = this.state.aut_data.sdtRestListaInsumosAut;
    const niveles = this.state.aut_data.sdtRestNivelesAut;
    const justificacion = this.state.justificacion;
    const advancePercentage = parseInt(datos.ACMVOIPORA);
    
    let estilos;
    switch (this.state.estilo){
      case 'light':
        estilos = light;
        break;
      case 'dark':
        estilos = dark;
        break;
      default:
        estilos = light;
        break; 
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
              <Text style={estilos.subtituloChido}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.number")}</Text>
              <Text style={estilos.contenidoNoDoc}>#{datos.ACOCPADOC}</Text>
              {/* <Text style={styles.postTitle}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.purchase_order_data_title")}</Text> */}
              <Text style={estilos.subtitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.material_procurer")}</Text>
              <Text style={estilos.contenido}>{datos.comp}</Text>
              <Text style={estilos.subtitulo}>{strings("transactions.CNCDIR.CNCDIRNOM")}</Text>
              <Text style={estilos.contenido}>{datos.CNCDIRNOM}</Text>
              <Text style={estilos.subtitulo}>{strings("transactions.PMCTPR.PMCTPRDSC")}</Text>
              <Text style={estilos.contenido}>{datos.PMCTPRDSC}</Text> 
              <Text style={estilos.subtitulo}>{strings("transactions.ACOCPA.ACOCPAMNT")}</Text>
              <NumberFormat value={parseFloat(datos.ACOCPAMNT)} displayType={'text'} renderText={value => <Text style={estilos.contenidoMonto}>{value} {datos.ACOCPAMON}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              <Text style={estilos.subtitulo}>{strings("transactions.CNTCPG.CNTCPGDSC")}</Text>
              <Text style={estilos.contenido}>{datos.CNTPGODSC}</Text> 
              <Text style={estilos.subtitulo}>{strings("transactions.ACMVOI.ACMVOIBAUT")}</Text>
              <Text style={estilos.contenidoLargo}>{datos.ACMVOIOBAUT}</Text> 
              <Text style={estilos.subtitulo}>{strings("transactions.ACOCPA.ACOCPAFOC")}</Text>
              <Text style={estilos.contenido}>{datos.ACOCPAFOC}</Text>
              <Text style={estilos.subtitulo}>{strings("transactions.ACMVOI.ACMVOIPORA")}</Text>
              <Text style={estilos.contenido}>{datos.ACMVOIPORA}%</Text>
              <ProgressBarAnimated
                width={Dimensions.get("window").width - 50}
                borderRadius={10}
                value={advancePercentage}
                backgroundColor="#d5edff"

              />
            </View>
            <TouchableHighlight onPress={() =>
              Linking.openURL('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/' + this.state.pdfLink)}>
              <ListItem
                key={"1"}
                leftAvatar={{source: require( '../../../assets/images/reportePdf.jpg')}}
                title= {strings("modules.BandejaDeAutorizaciones.AutorizacionOC.report_title")}
                subtitle={strings("modules.BandejaDeAutorizaciones.AutorizacionOC.report_text")}
              />
            </TouchableHighlight>
            <View style ={styles.separadorContainer}>
              <Text style = {styles.separador}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionOC.authorization_levels")}
              </Text>
            </View>
            <FlatList
              data={niveles}
              keyExtractor= {(item, index) => niveles + index.toString()}
              renderItem={this.renderNiveles.bind(this)}
            />
            <View style ={styles.separadorContainer}>
              <Text style = {styles.separador}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionOC.material_list")}
              </Text>
            </View>
            <FlatList
              data={insumos}
              keyExtractor= {(item, index) => insumos + index.toString()}
              renderItem={this.renderInsumos.bind(this)}
            />
            <View style = {estilos.pieAutorización}>
              <View style ={estilos.header}>
                <Text style = {estilos.titleJustificacion}>
                  {strings("modules.BandejaDeAutorizaciones.AutorizacionOC.justification")}
                </Text>
              </View>
              <View style={estilos.justificación}>
                <TextInput
                  placeholder={strings("modules.BandejaDeAutorizaciones.AutorizacionOC.write_justification")}
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
                  <Button title={strings("modules.BandejaDeAutorizaciones.AutorizacionOC.accept")}  color="rgb(124, 183, 62)" onPress={this.aceptarOC.bind(this)}/>
                </TouchableHighlight>
                <Text>{" "}</Text>
                <TouchableHighlight style ={styles.ocButton}>
                  <Button title={strings("modules.BandejaDeAutorizaciones.AutorizacionOC.reject")} color="#rgb(216, 87, 57)" onPress={this.rechazarOC.bind(this)}/>
                </TouchableHighlight>
                <Text>{" "}</Text>
                <TouchableHighlight style ={styles.ocButton}>
                  <Button title={strings("modules.BandejaDeAutorizaciones.AutorizacionOC.cancel")} color="rgb(19, 92, 121)" onPress={this.cancelarOC.bind(this)}/>
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
  separador: {
    alignItems: 'flex-start',
    fontSize: 24,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 15
    // color: 'white'
  },
  separadorContainer:{
    alignItems: 'flex-start',
    backgroundColor: '#f2f2f2'
  },
  navCardTouch: {
    marginVertical: 4,
    marginHorizontal: 2,
  },
  navCard: {
    elevation: 2,
    backgroundColor: 'white', 
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
  Contenedor: {
    margin: 15
  },
  TituloInsumo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 20,
    color: 'black'
  },
  TotalInsumo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 19
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