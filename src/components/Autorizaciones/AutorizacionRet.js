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
  ToastAndroid,
  Alert,
  Linking,
  Dimensions
} from 'react-native';
import { Button, Overlay, CheckBox, Icon } from 'react-native-elements';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { strings } from '../../i18n';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import NumberFormat from 'react-number-format';
import LoadingScreen from '../Common/LoadingScreen';
import { Table, TableWrapper, Row, Col } from 'react-native-table-component';
import light from '../Common/mode';
import dark from '../Common/DarkMode';

export default class AutorizacionRet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parametros: {
        "TOKEN_P": global.token,
        "BANAUTCIA_P": this.props.BANAUTCIA,
        "BANAUTNDC_P": this.props.BANAUTNDC
      },
      aut_data: [],
      loading: true,
      observation: '',
      processingTransaction: false,
      save_button_is_disabled: true,
      filling_observations: false,
      aux_RETREQLIN: 0
    };
  }

  componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
    // console.log("############### Han Solo")
    const keys = this.state.parametros;    
    axios.post('restgAutRetenciones', keys
     ).then(response => {
        if (response.data.SUCCESS){
          this.setState({
            aut_data: response.data,
            loading: false,
            line_data: JSON.parse(JSON.stringify(response.data.sdtRestListaRetencionesAut))
          });
          // Adds auhtorized and rejected field to array
          let clone = JSON.parse(JSON.stringify(this.state.line_data));
          clone.forEach(function(element) {
            element.authorized = false;
            element.rejected = false;
            element.justification = '';
          });
          this.setState({
            line_data: clone
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
    Actions.refresh({title: strings("modules.BandejaDeAutorizaciones.AutorizacionRet.title")});
    clearInterval(this.titleInterval);
  }

  updateLineAccept(line_number) {
    this.setState({
      filling_observations: false
    });
    let clone = JSON.parse(JSON.stringify(this.state.line_data));
    // let clone = {...this.state.line_data};
    let lines_with_decision = 0;
    let save_button_should_be_disabled = true;
    clone.forEach(function(element) {
      if (element.RETREQLIN == line_number) {
        if (element.authorized == false) {
          element.authorized = true;
          element.rejected = false;
          lines_with_decision += 1;
        } else {
          element.authorized = false;
          element.justification = false;
        }
      } else {
        if (element.authorized || element.rejected) {
          lines_with_decision += 1;
        }
      }
    });
    if (lines_with_decision > 0){ 
      save_button_should_be_disabled = false;
    }
    this.setState({
      line_data: clone,
      save_button_is_disabled: save_button_should_be_disabled
    });
    // this.forceUpdate();
  }
  
  updateLineReject(line_number) {
    this.setState({
      filling_observations: false
    });
    let clone = JSON.parse(JSON.stringify(this.state.line_data));
    // let clone = {...this.state.line_data};
    let lines_with_decision = 0;
    let save_button_should_be_disabled = true;
    clone.forEach(function(element) {
      if (element.RETREQLIN == line_number) {
        if (element.rejected == false) {
          element.authorized = false;
          element.rejected = true;
          lines_with_decision += 1;
        } else {
          element.rejected = false;
          element.justification = false;
        }
      } else {
        if (element.authorized || element.rejected) {
          lines_with_decision += 1;
        }
      }
    });
    if (lines_with_decision > 0){ 
      save_button_should_be_disabled = false;
    }
    this.setState({
      line_data: clone,
      save_button_is_disabled: save_button_should_be_disabled
    });
  }



  aceptarImpacto(){
    Alert.alert(
      strings("modules.BandejaDeAutorizaciones.AutorizacionRet.messages.attention"),
      strings("modules.BandejaDeAutorizaciones.AutorizacionRet.messages.authorization"),
      [
        {text: strings("modules.BandejaDeAutorizaciones.AutorizacionRet.messages.no"), style: 'cancel'},
        {text: strings("modules.BandejaDeAutorizaciones.AutorizacionRet.messages.yes"), onPress: () => this.impactarRets()},
      ]
    );
  }

  impactarRets(){
    // Desglose de significado de valores de Autorizar
    // 1 = Autoriza
    // 2 = Rechaza
    const requisition_lines = this.state.line_data;
    let line_decisions = [];
    const parms = this.state.parametros;
    requisition_lines.forEach(function(line){
      let Autorizar = 0;
      if (line.authorized || line.rejected) {
        if (line.authorized) {
          Autorizar = 1
        } else {
          Autorizar = 2
        }
        line_decisions.push({
          "Autorizar": Autorizar,
          "ACRCOIOBSAUT": line.justification,
          "ACRCPALIN": line.RETREQLIN
        })
      }
    });

    const parametros = {
      "TOKEN_P": global.token,
      "BANAUTCIA_P": parms["BANAUTCIA_P"],
      "BANAUTTDC_P": requisition_lines[0].RETREQTDC,
      "BANAUTNDC_P": parms["BANAUTNDC_P"],
      "sdtRestListaDecisionLinRequisicion_P": JSON.stringify(line_decisions)
    };

    console.log(parametros);
    this.setState({ processingTransaction: true });
    axios.post('restpArcRetenciones',
      parametros
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

  onObservationChange(text) {
    this.setState({ observation: text });
  }

  handle_rejection_click(RETREQLIN, rejected) {
    if (rejected) {
      this.updateLineReject(RETREQLIN)
    } else {
      this.updateLineReject(RETREQLIN)
      this.setState({
        filling_observations: true,
        aux_RETREQLIN: RETREQLIN,
        observation: ''
      })
    }
  }

  handle_writing_of_observations(RETREQLIN) {
    if (this.observation != '') {
      this.updateObservations(RETREQLIN)
    }
    this.setState({
      filling_observations: false,
      observation: ''
    })
  }

  updateObservations(line_number) {
    let clone = JSON.parse(JSON.stringify(this.state.line_data));
    const stored_observation = this.state.observation
    clone.forEach(function(element) {
      if (element.RETREQLIN == line_number) {
        element.justification = stored_observation;
      }
    });
    this.setState({
      line_data: clone
    });
  }

  handle_authorization_click(RETREQLIN, authorized) {
    if (authorized) {
      this.updateLineAccept(RETREQLIN)
    } else {
      this.updateLineAccept(RETREQLIN)
      this.setState({
        filling_observations: true,
        aux_RETREQLIN: RETREQLIN,
        observation: ''
      })
    }
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

  renderLineas(data){
    let estilos = this.estilo()

    let justification;
    let observation_border_color;
    if (data.item.justification != '') {
      if (data.item.authorized || data.item.rejected ){
        if (data.item.authorized) {
          observation_border_color = 'green';
        } else {
          observation_border_color = 'pink';
        }
      }
      justification = 
      <View style={[styles.justification_box, {borderColor: observation_border_color}]}>
        <Text style={estilos.subTitulo}>
          {strings("modules.BandejaDeAutorizaciones.AutorizacionRet.justification")}: 
          <Text style={estilos.información}> {data.item.justification}</Text>
        </Text>
      </View> 
    }

    let authorize;
    if (data.item.authorized === undefined || data.item.rejected === undefined) {
      authorized = true
      rejected = false
    } else {
      authorized = data.item.authorized.toString()
      rejected = data.item.rejected.toString()
    }

    return (
      <View style={styles.Contenedor}>
        <Text style={estilos.titulo_linea}>{strings("transactions.RETREQ.RETREQLIN")} {data.item.RETREQLIN}</Text>
        <Text style={estilos.Titulo}>{data.item.INPRODDSC}</Text>
        <Text style={estilos.TotalInsumo}> 
          {strings("transactions.ACRCPA.ACRCPAQTY")}:
          <NumberFormat value={parseFloat(data.item.ACRCOIQTO)} displayType={'text'} renderText={value => <Text style={estilos.TotalInsumoArgent}> {value} {data.item.ACRCOIUMT}</Text>} thousandSeparator={true} prefix={''}></NumberFormat>  
        </Text>
        
        <Text style={estilos.subTitulo}>
          {strings("modules.BandejaDeAutorizaciones.AutorizacionRet.buyer")}: 
          <Text style={estilos.información}> {data.item.CNCDIRNOM}</Text>
        </Text>

        <Text style={estilos.subTitulo}>
        {strings("transactions.PMCTPR.PMCTPRDSC")}: 
          <Text style={estilos.información}> {data.item.PMCTPRDSC}</Text>
        </Text> 

        <Text style={estilos.subTitulo}>
        {strings("transactions.PMCTCG.PMCTCGDSC")}: 
          <Text style={estilos.información}> {data.item.PMCTCGDSC}</Text>
        </Text>

        <Text style={estilos.subTitulo}>
        {strings("modules.BandejaDeAutorizaciones.AutorizacionRet.justification")}: 
          <Text style={estilos.información}> {data.item.ACRCOIDSC4}</Text>
        </Text>
        
        <Text style={estilos.subTitulo}>
        {strings("transactions.RETREQ.RETREQMT")}: 
          <Text style={estilos.información}> {data.item.RETREQMT}</Text>
        </Text>
        
        <Text style={estilos.subTitulo}>
          {strings("transactions.ACRCOI.ACRCOIFDO2")}:
          <Text style={estilos.información}> {data.item.ACRCOIFDO2}</Text>  
        </Text>

        <CheckBox
          title={strings("modules.BandejaDeAutorizaciones.AutorizacionRet.accept")}
          checked={data.item.authorized}
          iconType='AntDesign'
          checkedIcon='check-circle'
          uncheckedIcon='check-circle'
          checkedColor='green'
          onPress={this.handle_authorization_click.bind(this,data.item.RETREQLIN,data.item.authorized)}
        />

        <CheckBox
          title={strings("modules.BandejaDeAutorizaciones.AutorizacionRet.reject")}
          checked={data.item.rejected}
          iconType='AntDesign'
          checkedIcon='cancel'
          uncheckedIcon='cancel'
          checkedColor='red'
          onPress={this.handle_rejection_click.bind(this,data.item.RETREQLIN,data.item.rejected)} 
        />
        {justification}
      </View>
    );
  }

  render() {
    let estilos = this.estilo()
    const loading = this.state.loading;
    const datos = this.state.aut_data;
    const lineas = this.state.line_data;
    const observation = this.state.observation;
    const ACMVOIPORA = parseFloat(datos.ACMVOIPORA);
    const ACMROIPAREG = parseFloat(datos.ACMROIPAREG);
    const PAvanceConAutorizacion = parseFloat(datos.PAvanceConAutorizacion);
    if (loading != true) {
      return (
        <View style={estilos.container}>
          <View style={{position: 'absolute', zIndex: 90, bottom: 15,right: 15}}>
            <Icon
              raised
              name='save'
              type='font-awesome'
              color='#2089dc'
              reverse={true}
              reverseColor='white'
              size={30}
              disabled={this.state.save_button_is_disabled} 
              onPress={() => this.aceptarImpacto()}
            />
          </View>

          <ScrollView style={estilos.ScrollContainer} contentContainerStyle={estilos.contentContainer}>

            <Overlay
                isVisible={this.state.processingTransaction}
                windowBackgroundColor="rgba(255, 255, 255, .3)"
                overlayBackgroundColor="rgba(255, 255, 255, .0)"
                fullScreen= {true}
              >
              <View style={estilos.loadingContainer}>
                <Image source={require("../../../assets/gifs/bars6.gif")}/>
              </View>
            </Overlay>

            <Overlay
              isVisible={this.state.filling_observations}
              windowBackgroundColor="rgba(0, 0, 0, .3)"
              overlayBackgroundColor={estilos.Overlay.backgroundColor}
              height={250}
              onBackdropPress={() => this.setState({ filling_observations: false })}
            >
              <View style ={estilos.header}>
                <Text style = {estilos.justification_title_style}>
                  {strings("modules.BandejaDeAutorizaciones.AutorizacionRet.observations")}
                </Text>
              </View>
              <View style={estilos.justificación}>
                <TextInput
                  placeholder={strings("modules.BandejaDeAutorizaciones.AutorizacionRet.write_observations")}
                  value={observation}
                  autoCorrect={true}
                  multiline = {true}
                  numberOfLines={7}
                  maxLength={250}
                  onChangeText={this.onObservationChange.bind(this)}
                  style={estilos.justification_input_style}
                />
              </View>
              <View style={estilos.containerButton}>
                <Button title={strings("modules.BandejaDeAutorizaciones.AutorizacionRet.accept")}  onPress={() => this.handle_writing_of_observations(this.state.aux_RETREQLIN)} />
                <Text>{" "}</Text>
                <Button title={strings("modules.BandejaDeAutorizaciones.AutorizacionRet.close")} type="outline" onPress={() => this.setState({filling_observations: false})}/>
              </View>
            </Overlay>

            <View style={estilos.datosContainer}>
              <Text style={estilos.subtituloGrande}>{strings("modules.BandejaDeAutorizaciones.AutorizacionRet.number")}</Text>
              <Text style={estilos.contenidoNoDoc}>#{datos.ACRCOIDOC}</Text>
              <Text style={estilos.subtitulo}>{strings("transactions.CNCIAS.CNCIASDSC")}</Text>
              <Text style={estilos.contenido}>{datos.CNCIASDSC}</Text>
            </View>

            <View style ={estilos.separadorContainer}>
              <Text style = {estilos.separador}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionRet.lines")}
              </Text>
            </View>
            <FlatList
              data={lineas}
              keyExtractor= {(item, index) => "lineas" + index.toString()}
              renderItem={this.renderLineas.bind(this)}
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
  Contenedor: {
    margin: 15
  },
  informaciónRoja: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 16,
    color: 'red'
  },
  justification_box: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'pink',
    padding: 15
  }
});

const table_styles = StyleSheet.create({
  currency_right: {
    textAlign: "right",
    fontFamily: 'sans-serif-condensed',
    color: 'rgb(0, 143, 41)',
    fontSize: 16,
    margin: 4
  },
  general_cell_style: {
  },
  general_table: { 
    marginVertical: 3
  },
  table_general_head: {
    backgroundColor: "#f6f8fa"
  },
  general_title:{
    fontFamily: 'sans-serif-condensed',
    color: 'black',
    fontSize: 16,
    margin: 4
  },
  general_subtitle:{
    fontFamily: 'sans-serif-condensed',
    color: 'grey',
    fontSize: 16,
    margin: 4
  }
});
