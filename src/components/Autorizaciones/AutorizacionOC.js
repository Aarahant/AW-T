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
import { ListItem } from 'react-native-elements';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { strings } from '../../i18n';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import NumberFormat from 'react-number-format';

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
      pdfLink: ''
    };
  }

  componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
    // console.log("############### Han Solo")
    const keys = this.state.parametros; 
    axios.post('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/restgAutOrdenCompra', keys
     ).then(response => {
       if (response.data.SUCCESS){
        this.setState({
          aut_data: response.data,
          loading: false
         });
        //  console.log(this.state.aut_data);
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
    axios.post('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/restgRePreOC', pdfParm
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
    let estatusAutStyle;
    switch (data.item.ACOCPAAUHE){
      case 0:
        estatusAutStyle = styles.información;
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
        estatusAutStyle = styles.información;
        break;
    }
    if (data.item.pendiente_aut){
      return (
        <View style={styles.Contenedor}>
          <Text style={styles.postTitle}>{data.item.ACOCPAL2NIVEL} - {data.item.CNUSERDSC}</Text>
          <Text style={styles.subTitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.status")}:
            <Text  style={estatusAutStyle}> {data.item.estatus_aut}</Text>
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.Contenedor}>
          <Text style={styles.postTitle}>{data.item.ACOCPAL2NIVEL} - {data.item.CNUSERDSC}</Text>
          <Text style={styles.subTitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.status")}: 
            <Text style={estatusAutStyle}> {data.item.estatus_aut}</Text>
          </Text>
          <Text style={styles.subTitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.date")}: 
            <Text style={styles.información}> {data.item.ACOCPAL2FECOP}</Text>
          </Text>
          <Text style={styles.subTitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.comments")}: 
            <Text style={styles.información}> {data.item.ACOCPAL2COM}</Text>
          </Text>
        </View>
      );
    }
    
  }

  renderInsumos(data){
    return (
      // <TouchableHighlight style={styles.navCardTouch}>
      //   <View style={styles.navCard}> 
          <View style={styles.Contenedor}>
            <Text style={styles.TituloInsumo}>{data.item.INPRODDSC}</Text>
            <Text style={styles.TotalInsumo}> 
              {strings("transactions.ACOCPA.ACOCPAMNTIN")}:
              <NumberFormat value={parseFloat(data.item.ACOCPAMNTIN)} displayType={'text'} renderText={value => <Text style={styles.TotalInsumoArgent}> {value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>  
            </Text>
            <Text style={styles.subTitulo}>
              {strings("transactions.ACMVOI.ACMVOIDCP3")}:
              <Text style={styles.información}> {data.item.ACMVOIDCP3}  </Text>  
              {strings("transactions.ACMVOI.ACMVOIDLP3")}: 
              <Text style={styles.información}> {data.item.ACMVOIDLP3}</Text>
             </Text>
            <Text style={styles.subTitulo}>
              {strings("transactions.ACOCPA.ACOCPAFOC1")}: 
              <Text style={styles.información}> {data.item.ACOCPAFOC1}</Text>
            </Text> 
            <Text style={styles.subTitulo}>
              {strings("transactions.PMCTCG.PMCTCGDSC")}: 
              <Text style={styles.información}> {data.item.PMCTCGDSC}</Text>
            </Text>
            <Text style={styles.subTitulo}> 
              {strings("transactions.ACOCPA.ACOCPAQTY")}:
              <NumberFormat value={parseFloat(data.item.ACOCPAQTY)} displayType={'text'} renderText={value => <Text style={styles.información}> {value} {data.item.ACOCPAUM} </Text>} thousandSeparator={true} prefix={''}></NumberFormat> 
              {strings("transactions.ACMVOI.ACMVOIQTA")}:
              <NumberFormat value={parseFloat(data.item.ACMVOIQTA)} displayType={'text'} renderText={value => <Text style={styles.información}> {value} </Text>} thousandSeparator={true} prefix={''}></NumberFormat> 
            </Text>
            <Text style={styles.subTitulo}> 
              {strings("transactions.ACOCPA.ACOCPAPU")}:
              <NumberFormat value={parseFloat(data.item.ACOCPAPU)} displayType={'text'} renderText={value => <Text style={styles.información}> {value} </Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
            </Text>
            <Text style={styles.subTitulo}>
              {strings("transactions.ACMVOI.ACMVOICOM")}: 
              <Text style={styles.información}> {data.item.ACMVOICOM}</Text>
            </Text> 
          </View>
      //   </View>
      // </TouchableHighlight>
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
    axios.post('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/restpArcOrdenCompra', 
      validacion
    )
    .then(response => {
      if (response.data.SUCCESS){
        console.log(response.data)
        Actions.pop({ refresh: {key: Math.random()} }); // Sale y actualiza.
      }  else {
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
    });
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

    if (loading != true) {
      return (   
        <View style={styles.container}>
          <ScrollView style={styles.contentContainer}>
            <View style={styles.datosContainer}> 
              <Text style={styles.subtituloChido}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.number")}</Text>
              <Text style={styles.contenidoNoDoc}>#{datos.ACOCPADOC}</Text>
              {/* <Text style={styles.postTitle}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.purchase_order_data_title")}</Text> */}
              <Text style={styles.subtitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionOC.material_procurer")}</Text>
              <Text style={styles.contenido}>{datos.comp}</Text>
              <Text style={styles.subtitulo}>{strings("transactions.CNCDIR.CNCDIRNOM")}</Text>
              <Text style={styles.contenido}>{datos.CNCDIRNOM}</Text>
              <Text style={styles.subtitulo}>{strings("transactions.PMCTPR.PMCTPRDSC")}</Text>
              <Text style={styles.contenido}>{datos.PMCTPRDSC}</Text> 
              <Text style={styles.subtitulo}>{strings("transactions.ACOCPA.ACOCPAMNT")}</Text>
              <NumberFormat value={parseFloat(datos.ACOCPAMNT)} displayType={'text'} renderText={value => <Text style={styles.contenidoMonto}>{value} {datos.ACOCPAMON}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              <Text style={styles.subtitulo}>{strings("transactions.CNTCPG.CNTCPGDSC")}</Text>
              <Text style={styles.contenido}>{datos.CNTPGODSC}</Text> 
              <Text style={styles.subtitulo}>{strings("transactions.ACMVOI.ACMVOIBAUT")}</Text>
              <Text style={styles.contenidoLargo}>{datos.ACMVOIOBAUT}</Text> 
              <Text style={styles.subtitulo}>{strings("transactions.ACOCPA.ACOCPAFOC")}</Text>
              <Text style={styles.contenido}>{datos.ACOCPAFOC}</Text>
              <Text style={styles.subtitulo}>{strings("transactions.ACMVOI.ACMVOIPORA")}</Text>
              <Text style={styles.contenido}>{datos.ACMVOIPORA}%</Text>
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
            <View style = {styles.pieAutorización}>
              <View style ={styles.header}>
                <Text style = {styles.titleJustificacion}>
                  {strings("modules.BandejaDeAutorizaciones.AutorizacionOC.justification")}
                </Text>
              </View>
              <View style={styles.justificación}>
                <TextInput
                  placeholder={strings("modules.BandejaDeAutorizaciones.AutorizacionOC.write_justification")}
                  value={justificacion}
                  autoCorrect={true}
                  multiline = {true}
                  numberOfLines={1}
                  maxLength={250}
                  onChangeText={this.onJustificacionChange.bind(this)}
                  style={styles.textInputStyle}
                />
              </View>
              <View style={styles.containerButton}>
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
        <View style={styles.loadingContainer}>
          <Text> Loading... </Text>
        </View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: "center"
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
  TituloInsumo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 20,
    color: 'black'
  },
  TotalInsumo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 19
  },
  TotalInsumoArgent: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 19,
    color: 'rgb(0, 143, 41)'
    // color: '#a5c97f'
  },
  subTitulo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 16
  },
  información: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 16,
    color: '#b7b6b6'
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