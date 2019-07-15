import React from 'react';
import { 
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
  DrawerLayoutAndroid,
  ListItem,
  Alert,
  TouchableHighlight
} from 'react-native'; 
import { 
  Header,
  Image,
  Card,
  Button,
  Badge,
  Icon
} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import { strings } from '../i18n';
import light from './Common/mode';
import dark from './Common/DarkMode';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingDos: true,
      data: [],
      dataNot: [],
      error: null,
      searchTerm: '',
      number_messages: 0,
      BandejaAut: [],
      lenguajeVisible: false
    };
    this.arrayholder = [];
  }
  seleccionar_idioma(){
      this.setState({
        lenguajeVisible: true
      });
  }
  handleRequest() {
    Actions.auth()
    axios
      .get('/auth/logout/')
      .then(response => {
        console.log(response.status);
        delete axios.defaults.headers.common.Authorization;
        Actions.auth();
      })
      .catch(error =>  console.log(error));
  };

  async componentDidMount() {
    console.log("===============STAR WARS CHRISTMAS SPECIAL============")
    console.log(this.props);
    console.log(global.token);
    console.log("===============STAR WARS CHRISTMAS SPECIAL END============")
    axios
        .post('restgBandAutPend',
        {
          "TOKEN_P": global.token
        }
        ).then(response => {
          if (response.data.SUCCESS){
            this.setState({
              BandejaAut: response.data
            });
            } else {
              Alert.alert(
                'Atención',
                'Ha caducado la sesión.',
                [
                  {text: 'OK', onPress: () => Actions.auth()}
                ],
                {cancelable: false}
              );
              Actions.auth();
            }
          }
        );
        
      this.interval = setInterval(() => axios
        .post('restgBandAutPend',
        {
          "TOKEN_P": global.token
        }
        ).then(response => {
          if (response.data.SUCCESS){
            this.setState({
              BandejaAut: response.data
            });
            } else {
              Alert.alert(
                'Atención',
                'Ha caducado la sesión.',
                [
                  {text: 'OK', onPress: () => Actions.auth()}
                ],
                {cancelable: false}
              );
              Actions.auth();
            }
          }
        ).catch(error =>  console.log(error))
        ,10000);
        // .catch(error =>  console.log(error));
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    let estilos;
    switch (global.style){
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

    var randomImages = [
      require('../../assets/images/sys_kds.png'),
      require('../../assets/images/kds_movil_logo.png')
    ];

    const ContPendientes = this.state.BandejaAut.cont_pendientes;
    console.log("############ ContPendientes");
    console.log(ContPendientes);

    let color_pend;
    let estatus;
    if (ContPendientes < 10) {
      color_pend = 'orange';
      estatus = 'warning';
    } else {
      color_pend = '#ff4d4d';
      estatus = 'error';
    }
    let AutPend;
    let AutBadge;
    if (ContPendientes > 0) {
      AutBadge = <React.Fragment>
        <Badge
          status= {estatus}
          value = {ContPendientes}
          containerStyle={{ position: 'absolute', top: -122, right: 12 }}
        /></React.Fragment>

      AutPend = <Text style={
        {
          width: 25,
          height: 25,
          backgroundColor: color_pend,
          color: 'white',
          textAlign: 'center',
          paddingTop: 3,
          borderRadius: 50,
          top: -35,
          right: -240
        }
        }>
        {ContPendientes}
      </Text>;
    }

       
    var navigationView = (
      <View style={estilos.container}>
        <ScrollView style={estilos.ScrollContainer} contentContainerStyle={estilos.contentContainer}>
            <View>
            <View style ={styles.header}>
                <View >
                    <Image style={styles.profilepicWrap} source={randomImages[0]}/>
                </View> 
            </View>
            
            <View style={estilos.texto}>
                <Text style={estilos.name}>KDS AW&T</Text>
            </View >   

            <TouchableOpacity onPress={() => {Actions.musician_list()}}>
              <View style={estilos.celdaOption}>
                <Text style={estilos.menuOption}>{strings('modules.HomeScreen.employees')}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => {Actions.bandeja_de_autorizaciones()}}>
              <View style={estilos.celdaOption}>
                <Text style={estilos.menuOption}>{strings('modules.HomeScreen.authorization_bin')}</Text>
                {AutPend}
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => {Actions.settings()}}>
              <View style={estilos.celdaOption}>
                <Text style={estilos.menuOption}>{strings('modules.HomeScreen.settings')}</Text>
              </View>
            </TouchableOpacity>

          </View>
          <View style={{paddingBottom: 10}}>
            <TouchableOpacity onPress={this.handleRequest.bind(this)}>
              <View style={estilos.celdaOption}>
                <Text style={estilos.menuOptionFinal}>{strings('modules.HomeScreen.log_out')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>    
    ); 
    
    return ( 
      <DrawerLayoutAndroid style={estilos.container}
      ref = "mainDrawer"
      drawerWidth={300}
      renderNavigationView={() => navigationView}>
      <Header
        backgroundColor= '#1aa6a8' //'#003366'
        leftComponent={{ icon: 'menu', color: '#fff', onPress:() => this.refs['mainDrawer'].openDrawer() }}
        centerComponent={{ text: strings('modules.HomeScreen.title'), style: { color: '#fff' } }}
        containerStyle={{
          marginTop: Platform.OS === 'ios' ? 0 : - 24,
          borderBottomWidth: 0
        }}
      />
            <View >
              <ScrollView>
                <View style = {{flexDirection: 'row', flex: 1, paddingTop: 5}}>
                  <View style={styles.columna}>
                    <TouchableOpacity onPress={() => {Actions.bandeja_de_autorizaciones()}}>  
                      <Card
                        title= {strings('modules.HomeScreen.authorization_bin')}
                        titleStyle={estilos.cardTitleStyle}
                        containerStyle = {estilos.curvedCardLeft}
                        image={require('../../assets/images/autorizaciones_300.png')}
                        imageStyle = {estilos.imgCard}
                      > 
                      {AutBadge}
                      </Card>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {Actions.bandeja_de_autorizaciones()}}>  
                      <Card
                        containerStyle = {estilos.curvedCardLeft}
                        title='Autorizaciones left'
                        titleStyle={estilos.cardTitleStyle}
                        image={require('../../assets/images/autorizaciones_300.png')}
                        imageStyle = {estilos.imgCard}
                      > 
                      {AutBadge}
                      </Card>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.columna}> 
                    <TouchableOpacity onPress={() => {Actions.bandeja_de_autorizaciones()}}>  
                      <Card
                        containerStyle = {estilos.curvedCardRight}
                        title='Autorizaciones right'
                        titleStyle={estilos.cardTitleStyle}
                        image={require('../../assets/images/autorizaciones_300.png')}
                        imageStyle = {estilos.imgCard}
                      > 
                      {AutBadge}
                    </Card>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </DrawerLayoutAndroid>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  columna: {
    flex: 0,
    width: "50%",
    height: undefined,
    // alignSelf: 'flex-end',
    justifyContent: 'flex-start'
  },
  header:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilepicWrap:{
    marginTop:1,
      width: 180,
      height: 180,
      borderRadius: 100,
      borderColor: 'rgba(135,206,235, 0.4)',
      borderWidth: 8,
  }
});