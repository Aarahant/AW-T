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
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { strings } from '../../i18n';
import NumberFormat from 'react-number-format';
import LoadingScreen from '../Common/LoadingScreen';

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
      pdfLink: ''
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
    Actions.refresh({title: 'Autorizació de Pago'});
    clearInterval(this.titleInterval);
  }

  onJustificacionChange(text) {
    this.setState({ justificacion: text });
  }

  render() { 
    const loading = this.state.loading;
    const datos = this.state.aut_data;
    const justificacion = this.state.justificacion;
    let ProgPagoID;
    if (datos.PROPAGID > 0){
        ProgPagoID =
            <React.Fragment>
                <Text style={styles.subtitulo}>Programación de Pago</Text>
                <Text style={styles.contenido}>{datos.PROPAGID}</Text>
            </React.Fragment>
    }

    let anticipo;
    if (datos.PMTipoDoc == 'ANT') {
        anticipo =
            <React.Fragment>
                <Text style={styles.contenidoAnticipo}>INCLUYE ANTICIPO</Text>
            </React.Fragment>
    }

    if (loading != true) {
      return (   
        <View style={styles.container}>
          <ScrollView style={styles.contentContainer}>
            <View style={styles.datosContainer}> 
              <Text style={styles.subtituloChido}>Número de Pago</Text>
              <Text style={styles.contenidoNoDoc}>#{datos.pagoid}   {anticipo}</Text>
              {ProgPagoID}
              <Text style={styles.subtitulo}>Usuario</Text>
              <Text style={styles.contenido}>{datos.CNUSERDSC}</Text>
              <Text style={styles.subtitulo}>Proveedor</Text>
              <Text style={styles.contenido}>{datos.CNCDIRNOM}</Text>
              <Text style={styles.subtitulo}>Monto</Text>
              <Text style={styles.contenido}>
                <NumberFormat value={parseFloat(datos.CANTIDAD)} displayType={'text'} renderText={value => <Text style={styles.contenidoMonto}>{value} {datos.CNCMNMID}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>
              </Text> 
              <Text style={styles.subtitulo}>Concepto de Apartado</Text>
              <Text style={styles.contenido}>{datos.CNCD03DSC}</Text> 
              <Text style={styles.subtitulo}>Fecha de registro</Text>
              <Text style={styles.contenido}>{datos.PAGOFEC}</Text> 
              <Text style={styles.subtitulo}>Fecha programada</Text>
              <Text style={styles.contenidoLargo}>{datos.PAGOFEPR}</Text>
            </View>
            <View style = {styles.pieAutorización}>
              <View style ={styles.header}>
                <Text style = {styles.titleJustificacion}>
                  Comentarios
                </Text>
              </View>
              <View style={styles.justificación}>
                <TextInput
                //   placeholder={strings("modules.BandejaDeAutorizaciones.AutorizacionOC.write_justification")}
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
                <TouchableHighlight style ={styles.pagButton}>
                  <Button title='Sí' color="rgb(124, 183, 62)" />
                </TouchableHighlight>
                <Text>{" "}</Text>
                <TouchableHighlight style ={styles.pagButton}>
                  <Button title='No' color="rgb(216, 87, 57)" />
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
//   at:{
//     alignItems: 'center',
//     textAlign: 'center',
//     justifyContent: 'center',
//     color: 'rgb(232,102,23)',
//     fontWeight: 'bold',
//     fontSize: 22,
//   },
  separador: {
    alignItems: 'flex-start',
    fontSize: 24,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 15
    // color: 'white'
  },
  contentContainer: {
    height: '100%'
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
  contenidoAnticipo: {
    fontFamily: 'sans-serif-condensed',
    fontWeight: 'bold',
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
  subTitulo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 16
  }
});