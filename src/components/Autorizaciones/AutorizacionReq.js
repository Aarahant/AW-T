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

export default class AutorizacionReq extends React.Component {
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
      processingTransaction: false,
      save_button_is_disabled: true,
      filling_rejection_justfication: false,
      aux_ACRCPALIN: 0
    };
  }

  componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
    // console.log("############### Han Solo")
    const keys = this.state.parametros;    
    axios.post('restgAutRequisicion', keys
     ).then(response => {
        if (response.data.SUCCESS){
          let req_data = response.data;
          let gen_compromised_color = 'green';
          let gen_available_color = 'green';
          let mon_compromised_color = 'green';
          let mon_available_color = 'green';

          if (req_data.Comprometido > req_data.Presupuestado) {
            gen_compromised_color = 'orange';
          }
          if (req_data.Disponible < 0) {
            gen_available_color = 'red';
          }
          if (req_data.ComprometidoM > req_data.presupuestadoM) {
            mon_compromised_color = 'orange';
          }
          if (req_data.DisponibleM < 0) {
            mon_available_color = 'red';
          }
          
          this.setState({
            aut_data: response.data,
            loading: false,
            general_budget_head: [strings("modules.BandejaDeAutorizaciones.AutorizacionReq.general_budget_title")],
            budget_titles: [
              [strings("modules.BandejaDeAutorizaciones.AutorizacionReq.budgeted_budget")],
              [strings("modules.BandejaDeAutorizaciones.AutorizacionReq.compromised_budget")],
              [strings("modules.BandejaDeAutorizaciones.AutorizacionReq.available_budget")]
            ],
            general_budget_data: [
              [<NumberFormat value={parseFloat(response.data.Presupuestado)} decimalScale={2} fixedDecimalScale={true} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
              [<NumberFormat value={parseFloat(response.data.Comprometido)} decimalScale={2} fixedDecimalScale={true} displayType={'text'} renderText={value => <Text style={styles.currency_right}><Text style={{color: gen_compromised_color}}>{value}</Text></Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
              [<NumberFormat value={parseFloat(response.data.Disponible)} decimalScale={2} fixedDecimalScale={true} displayType={'text'} renderText={value => <Text style={styles.currency_right}><Text style={{color: gen_available_color}}>{value}</Text></Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>]
            ],
            monthly_budget_head: [strings("modules.BandejaDeAutorizaciones.AutorizacionReq.monthly_budget_title")],
            monthly_budget_data: [
              [<NumberFormat value={parseFloat(response.data.presupuestadoM)} decimalScale={2} fixedDecimalScale={true} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
              [<NumberFormat value={parseFloat(response.data.ComprometidoM)} decimalScale={2} fixedDecimalScale={true} displayType={'text'} renderText={value => <Text style={styles.currency_right}><Text style={{color: mon_compromised_color}}>{value}</Text></Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
              [<NumberFormat value={parseFloat(response.data.DisponibleM)} decimalScale={2} fixedDecimalScale={true} displayType={'text'} renderText={value => <Text style={styles.currency_right}><Text style={{color: mon_available_color}}>{value}</Text></Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>]
            ],
            line_data: JSON.parse(JSON.stringify(response.data.sdtRestListaLinRequisicionesAut))
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
    Actions.refresh({title: strings("modules.BandejaDeAutorizaciones.AutorizacionReq.title")});
    clearInterval(this.titleInterval);
  }

  updateLineAccept(line_number) {
    let clone = JSON.parse(JSON.stringify(this.state.line_data));
    // let clone = {...this.state.line_data};
    let lines_with_decision = 0;
    let save_button_should_be_disabled = true;
    clone.forEach(function(element) {
      if (element.ACRCPALIN == line_number) {
        if (element.authorized == false) {
          element.authorized = true;
          element.rejected = false;
          lines_with_decision += 1;
        } else {
          element.authorized = false;
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
    if (this.state.justificacion === '') {
      ToastAndroid.showWithGravityAndOffset(
        strings("modules.BandejaDeAutorizaciones.AutorizacionReq.validations.missing_justification"),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        0,
        50,
      );
    } else {
      this.setState({
        filling_rejection_justfication: false
      });
      let clone = JSON.parse(JSON.stringify(this.state.line_data));
      // let clone = {...this.state.line_data};
      let lines_with_decision = 0;
      let save_button_should_be_disabled = true;
      const stored_justification = this.state.justificacion
      clone.forEach(function(element) {
        if (element.ACRCPALIN == line_number) {
          if (element.rejected == false) {
            element.authorized = false;
            element.rejected = true;
            element.justification = stored_justification;
            lines_with_decision += 1;
          } else {
            element.rejected = false;
            element.justification = '';
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
      // this.forceUpdate()
    }
  }

  aceptarImpacto(){
    Alert.alert(
      strings("modules.BandejaDeAutorizaciones.AutorizacionReq.messages.attention"),
      strings("modules.BandejaDeAutorizaciones.AutorizacionReq.messages.authorization"),
      [
        {text: strings("modules.BandejaDeAutorizaciones.AutorizacionReq.messages.no"), style: 'cancel'},
        {text: strings("modules.BandejaDeAutorizaciones.AutorizacionReq.messages.yes"), onPress: () => this.impactarReqs()},
      ]
    );
  }

  impactarReqs(){
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
          "ACRCPALIN": line.ACRCPALIN
        })
      }
    });

    const parametros = {
      "TOKEN_P": global.token,
      "BANAUTCIA_P": parms["BANAUTCIA_P"],
      "BANAUTTDC_P": parms["BANAUTTDC_P"],
      "BANAUTNDC_P": parms["BANAUTNDC_P"],
      "sdtRestListaDecisionLinRequisicion_P": JSON.stringify(line_decisions)
    };

    console.log(parametros);
    this.setState({ processingTransaction: true });
    axios.post('restpArcRequisiciones',
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

  onJustificacionChange(text) {
    this.setState({ justificacion: text });
  }

  handle_rejection_click(ACRCPALIN, rejected) {
    if (rejected) {
      this.updateLineReject(ACRCPALIN)
    } else {
      this.setState({
        filling_rejection_justfication: true,
        aux_ACRCPALIN: ACRCPALIN,
        justificacion: ''
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
    const line_detail_head = [strings("modules.BandejaDeAutorizaciones.AutorizacionReq.general_budget_title")];
    const line_detail_titles = [
      [strings("transactions.ACRCPA.ACRCPAQTYR")],
      [strings("transactions.ACRCPA.ACRCPAQTYOC")],
      [strings("transactions.ACRCPA.ACRCPAQTYRC")],
      [strings("transactions.ACRCPA.ACRCPAQTYP")],
      [strings("transactions.ACRCPA.ACRCPAULPCM")],
      [strings("transactions.ACRCPA.ACRCPAVACMEST")],
      [strings("transactions.ACRCPA.ACRCPACNRQPDIAS")]
    ];
    const line_detail_data = [
      [<NumberFormat value={parseFloat(data.item.ACRCPAQTYR)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
      [<NumberFormat value={parseFloat(data.item.ACRCPAQTYOC)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
      [<NumberFormat value={parseFloat(data.item.ACRCPAQTYRC)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
      [<NumberFormat value={parseFloat(data.item.ACRCPAQTYP)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
      [<NumberFormat value={parseFloat(data.item.ACRCPAULPCM)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
      [<NumberFormat value={parseFloat(data.item.ACRCPAVACMEST)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
      [<NumberFormat value={parseFloat(data.item.ACRCPACNRQPDIAS)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
    ];
    let observaciones;
    if (data.item.ACRCPAOBS != "") {
      observaciones = <Text style={estilos.subTitulo}>
        {strings("transactions.ACRCPA.ACRCPAOBS")}: 
        <Text style={estilos.información}> {data.item.ACRCPAOBS}</Text>
      </Text> 
    }

    let justification;
    if (data.item.rejected === true) {
      justification = 
      <View style={styles.justification_box}>
        <Text style={estilos.subTitulo}>
          {strings("modules.BandejaDeAutorizaciones.AutorizacionReq.justification")}: 
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
        <Text style={estilos.titulo_linea}>{strings("transactions.ACRCPA.ACRCPALIN")} {data.item.ACRCPALIN}</Text>
        <Text style={estilos.Titulo}>{data.item.INPRODDSC}</Text>
        <Text style={estilos.TotalInsumo}> 
          {strings("transactions.ACRCPA.ACRCPAQTY")}:
          <NumberFormat value={parseFloat(data.item.ACRCPAQTY)} displayType={'text'} renderText={value => <Text style={estilos.TotalInsumoArgent}> {value} {data.item.ACRCPAUM}</Text>} thousandSeparator={true} prefix={''}></NumberFormat>  
        </Text>
        
        <Text style={estilos.subTitulo}>
          {strings("transactions.ACRCPA.ACRCPAFREQ")}:
          <Text style={estilos.información}> {data.item.ACRCPAFREQ}</Text>  
        </Text>

        <Text style={estilos.subTitulo}>
        {strings("modules.BandejaDeAutorizaciones.AutorizacionReq.num")}: 
          <Text style={styles.informaciónRoja}> {data.item.num}</Text>
        </Text> 

        <View style={estilos.general_table}>
          <Table borderStyle={{borderWidth: 0, borderColor: 'transparent'}}>
            <Row data={this.state.general_budget_head} style={estilos.table_general_head} textStyle={estilos.general_title}/>
            <TableWrapper style={{flexDirection: 'row'}}>
              <Col data={line_detail_titles} textStyle={estilos.general_subtitle}/>
              <Col data={line_detail_data} style={estilos.general_cell_style} textStyle={table_styles.currency_right}/>
            </TableWrapper>
          </Table>
        </View>
        {observaciones}
        <CheckBox
          title={strings("modules.BandejaDeAutorizaciones.AutorizacionReq.accept")}
          checked={data.item.authorized}
          iconType='AntDesign'
          checkedIcon='check-circle'
          uncheckedIcon='check-circle'
          checkedColor='green'
          onPress={this.updateLineAccept.bind(this,data.item.ACRCPALIN)}
        />

        <CheckBox
          title={strings("modules.BandejaDeAutorizaciones.AutorizacionReq.reject")}
          checked={data.item.rejected}
          iconType='AntDesign'
          checkedIcon='cancel'
          uncheckedIcon='cancel'
          checkedColor='red'
          onPress={this.handle_rejection_click.bind(this,data.item.ACRCPALIN,data.item.rejected)} 
        />
        {justification}
      </View>
    );
  }
  // this.updateLineReject.bind(this,data.item.ACRCPALIN)

  render() {
    let estilos = this.estilo()
    const loading = this.state.loading;
    const datos = this.state.aut_data;
    const lineas = this.state.line_data;
    const justificacion = this.state.justificacion;
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
              isVisible={this.state.filling_rejection_justfication}
              windowBackgroundColor="rgba(0, 0, 0, .3)"
              overlayBackgroundColor="rgba(255, 255, 255, 1)"
              height={250}
            >
              <View style ={estilos.header}>
                <Text style = {estilos.justification_title_style}>
                  {strings("modules.BandejaDeAutorizaciones.AutorizacionReq.justification")}
                </Text>
              </View>
              <View style={estilos.justificación}>
                <TextInput
                  placeholder={strings("modules.BandejaDeAutorizaciones.AutorizacionReq.write_justification")}
                  value={justificacion}
                  autoCorrect={true}
                  multiline = {true}
                  numberOfLines={7}
                  maxLength={250}
                  onChangeText={this.onJustificacionChange.bind(this)}
                  style={estilos.justification_input_style}
                />
              </View>
              <View style={styles.containerButton}>
                <Button title={strings("modules.BandejaDeAutorizaciones.AutorizacionReq.accept")}  onPress={() => this.updateLineReject(this.state.aux_ACRCPALIN)} />
                <Text>{" "}</Text>
                <Button title={strings("modules.BandejaDeAutorizaciones.AutorizacionReq.close")} type="outline" onPress={() => this.setState({filling_rejection_justfication: false})}/>
              </View>
            </Overlay>

            <View style={estilos.datosContainer}>
              <Text style={estilos.subtituloGrande}>{strings("modules.BandejaDeAutorizaciones.AutorizacionReq.number")}</Text>
              <Text style={estilos.contenidoNoDoc}>#{datos.ACRCPADOC}</Text>
              <Text style={estilos.subtitulo}>{strings("transactions.PMCTCG.PMCTCGDSC")}</Text>
              <Text style={estilos.contenido}>{datos.PMCTCGDSC}</Text>

              <Text style={estilos.subtitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionReq.budget_title")}</Text>
              <View style={estilos.general_table}>
                <Table borderStyle={{borderWidth: 0, borderColor: 'transparent'}}>
                  <Row data={this.state.general_budget_head} style={estilos.table_general_head} textStyle={estilos.general_title}/>
                  <TableWrapper style={{flexDirection: 'row'}}>
                    <Col data={this.state.budget_titles} textStyle={estilos.general_subtitle}/>
                    <Col data={this.state.general_budget_data} style={estilos.general_cell_style} textStyle={table_styles.currency_right}/>
                  </TableWrapper>
                </Table>
              </View>

              <View style={estilos.general_table}>              
                <Table borderStyle={{borderWidth: 0, borderColor: 'transparent'}}>
                  <Row data={this.state.monthly_budget_head} style={estilos.table_general_head} textStyle={estilos.general_title}/>
                  <TableWrapper style={{flexDirection: 'row'}}>
                    <Col data={this.state.budget_titles} textStyle={estilos.general_subtitle}/>
                    <Col data={this.state.monthly_budget_data} style={estilos.general_cell_style} textStyle={table_styles.currency_right}/>
                  </TableWrapper>
                </Table>
              </View>

            </View>
            <View style ={estilos.separadorContainer}>
              <Text style = {estilos.separador}>
                {strings("modules.BandejaDeAutorizaciones.AutorizacionReq.lines")}
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
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    marginTop: 5
  },
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
  }
});
