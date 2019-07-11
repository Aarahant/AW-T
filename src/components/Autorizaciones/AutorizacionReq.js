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
import estilos from '../Common/mode';

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
              [<NumberFormat value={parseFloat(response.data.Presupuestado)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
              [<NumberFormat value={parseFloat(response.data.Comprometido)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
              [<NumberFormat value={parseFloat(response.data.Disponible)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>]
            ],
            monthly_budget_head: [strings("modules.BandejaDeAutorizaciones.AutorizacionReq.monthly_budget_title")],
            monthly_budget_data: [
              [<NumberFormat value={parseFloat(response.data.presupuestadoM)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
              [<NumberFormat value={parseFloat(response.data.ComprometidoM)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>],
              [<NumberFormat value={parseFloat(response.data.DisponibleM)} displayType={'text'} renderText={value => <Text style={styles.currency_right}>{value}</Text>} thousandSeparator={true} prefix={'$'}></NumberFormat>]
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

  renderLineas(data){
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
        <Text style={styles.información}> {data.item.ACRCPAOBS}</Text>
      </Text> 
    }

    let justification;
    if (data.item.rejected === true) {
      justification = 
      <View style={styles.justification_box}>
        <Text style={estilos.subTitulo}>
          {strings("modules.BandejaDeAutorizaciones.AutorizacionReq.justification")}: 
          <Text style={styles.información}> {data.item.justification}</Text>
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
        <Text style={styles.titulo_linea}>{strings("transactions.ACRCPA.ACRCPALIN")} {data.item.ACRCPALIN}</Text>
        <Text style={styles.TituloInsumo}>{data.item.INPRODDSC}</Text>
        <Text style={styles.TotalInsumo}> 
          {strings("transactions.ACRCPA.ACRCPAQTY")}:
          <NumberFormat value={parseFloat(data.item.ACRCPAQTY)} displayType={'text'} renderText={value => <Text style={estilos.TotalInsumoArgent}> {value} {data.item.ACRCPAUM}</Text>} thousandSeparator={true} prefix={''}></NumberFormat>  
        </Text>
        
        <Text style={estilos.subTitulo}>
          {strings("transactions.ACRCPA.ACRCPAFREQ")}:
          <Text style={styles.información}> {data.item.ACRCPAFREQ}</Text>  
        </Text>

        <Text style={estilos.subTitulo}>
        {strings("modules.BandejaDeAutorizaciones.AutorizacionReq.num")}: 
          <Text style={styles.informaciónRoja}> {data.item.num}</Text>
        </Text> 

        <View style={table_styles.general_table}>
          <Table borderStyle={{borderWidth: 0, borderColor: 'transparent'}}>
            <Row data={this.state.general_budget_head} style={table_styles.table_general_head} textStyle={table_styles.general_title}/>
            <TableWrapper style={{flexDirection: 'row'}}>
              <Col data={line_detail_titles} textStyle={table_styles.general_subtitle}/>
              <Col data={line_detail_data} style={table_styles.general_cell_style} textStyle={table_styles.currency_right}/>
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
                <Text style = {styles.justification_title_style}>
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
                  style={styles.justification_input_style}
                />
              </View>
              <View style={styles.containerButton}>
                <Button title={strings("modules.BandejaDeAutorizaciones.AutorizacionReq.accept")}  onPress={() => this.updateLineReject(this.state.aux_ACRCPALIN)} />
                <Text>{" "}</Text>
                <Button title={strings("modules.BandejaDeAutorizaciones.AutorizacionReq.close")} type="outline" onPress={() => this.setState({filling_rejection_justfication: false})}/>
              </View>
            </Overlay>

            <View style={styles.datosContainer}>
              <Text style={estilos.subtituloChido}>{strings("modules.BandejaDeAutorizaciones.AutorizacionReq.number")}</Text>
              <Text style={estilos.contenidoNoDoc}>#{datos.ACRCPADOC}</Text>
              <Text style={estilos.subtitulo}>{strings("transactions.PMCTCG.PMCTCGDSC")}</Text>
              <Text style={estilos.contenido}>{datos.PMCTCGDSC}</Text>

              <Text style={estilos.subtitulo}>{strings("modules.BandejaDeAutorizaciones.AutorizacionReq.budget_title")}</Text>
              <View style={table_styles.general_table}>
                <Table borderStyle={{borderWidth: 0, borderColor: 'transparent'}}>
                  <Row data={this.state.general_budget_head} style={table_styles.table_general_head} textStyle={table_styles.general_title}/>
                  <TableWrapper style={{flexDirection: 'row'}}>
                    <Col data={this.state.budget_titles} textStyle={table_styles.general_subtitle}/>
                    <Col data={this.state.general_budget_data} style={table_styles.general_cell_style} textStyle={table_styles.currency_right}/>
                  </TableWrapper>
                </Table>
              </View>

              <View style={table_styles.general_table}>              
                <Table borderStyle={{borderWidth: 0, borderColor: 'transparent'}}>
                  <Row data={this.state.monthly_budget_head} style={table_styles.table_general_head} textStyle={table_styles.general_title}/>
                  <TableWrapper style={{flexDirection: 'row'}}>
                    <Col data={this.state.budget_titles} textStyle={table_styles.general_subtitle}/>
                    <Col data={this.state.monthly_budget_data} style={table_styles.general_cell_style} textStyle={table_styles.currency_right}/>
                  </TableWrapper>
                </Table>
              </View>

            </View>
            <View style ={styles.separadorContainer}>
              <Text style = {styles.separador}>
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
  separador: {
    alignItems: 'flex-start',
    fontSize: 24,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 15
  },
  separadorContainer:{
    alignItems: 'flex-start',
    backgroundColor: '#f2f2f2'
  },
  datosContainer: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    flex: 1,
    justifyContent: 'flex-start'
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    marginTop: 5
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
  información: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 16,
    color: '#b7b6b6'
  },
  informaciónRoja: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 16,
    color: 'red'
  },
  titulo_linea: {
    fontSize: 16,
    color: "rgb(38, 51, 140)"
  },
  justification_title_style: {
    color: "black",
    fontSize: 20,
  },
  justification_input_style: {
    borderWidth: 1,
    borderColor: "lightgrey",
    margin: 6,
    textAlignVertical: 'top'
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
