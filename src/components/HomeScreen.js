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
import I18n from 'react-native-i18n';

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
        .post('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/restgBandAutPend',
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
        .post('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/restgBandAutPend',
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
      <View >
           <ScrollView>
            <View style ={styles.header}>
                <View >
                    <Image style={styles.profilepicWrap} source={randomImages[0]}/>
                </View> 
            </View>
            
            <View style={styles.texto}>
                <Text style={styles.name}>KDS AW&T</Text>
                {/* <Text style={styles.pos}>{profile_data.profile_instrument}</Text> */}
            </View >   
            
            {/* <TouchableOpacity onPress={() => {Actions.user_profile()}}>
              <View>
                <Text style={styles.menuOption}>Mi perfil</Text>
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity onPress={() => {Actions.musician_list()}}>
              <View>
                <Text style={styles.menuOption}>{strings('modules.HomeScreen.employees')}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => {Actions.bandeja_de_autorizaciones()}}>
              <View>
                <Text style={styles.menuOption}>{strings('modules.HomeScreen.authorization_bin')}</Text>
              </View>
              {AutPend}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => {Actions.settings()}}>
              <View>
                <Text style={styles.menuOption}>{strings('modules.HomeScreen.settings')}</Text>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={this.seleccionar_idioma.bind(this)}>
              <View>
                <Text style={styles.menuOptionFinal}>{strings('modules.HomeScreen.language')}</Text>
              </View>
            </TouchableOpacity> */}


            <TouchableOpacity onPress={this.handleRequest.bind(this)}>
              <View>
                <Text style={styles.menuOptionFinal}>{strings('modules.HomeScreen.log_out')}</Text>
              </View>
            </TouchableOpacity>

            </ScrollView>
      </View>    
    ); 

    
    let AutCardStyle;
    switch (global.language){
      case 'en-US':
        AutCardStyle = styles.cardAutLvl1;
        break;
      case 'es-MX':
        AutCardStyle = styles.cardAutLvl2;
        break;
      default:
        AutCardStyle = styles.cardAutLvl2;
        break;
    }
    
    return ( 
      // <View style={styles.overAllContainer}>
        <DrawerLayoutAndroid
          ref = "mainDrawer"
          drawerWidth={300}
        // drawerPosition={DrawerLayoutAndroid.positions.Left} 
        renderNavigationView={() => navigationView}>
          <Header
            backgroundColor= '#1aa6a8' //'#003366'
            leftComponent={{ icon: 'menu', color: '#fff', onPress:() => this.refs['mainDrawer'].openDrawer() }}
            centerComponent={{ text: strings('modules.HomeScreen.title'), style: { color: '#fff' } }}
            containerStyle={{
              elevation: 5,
              borderWidth: 0
            }}
          />
            <View style={styles.container}>
              <ScrollView>
                <View style = {{flexDirection: 'row', flex: 1, paddingTop: 5}}>
                  <View style={styles.columna}>
                    <TouchableOpacity onPress={() => {Actions.bandeja_de_autorizaciones()}}>  
                      <Card
                        title= {strings('modules.HomeScreen.authorization_bin')}
                        containerStyle = {styles.curvedCardLeft}
                        image={require('../../assets/images/autorizaciones_300.png')}
                        imageStyle = {styles.imgCard}
                      > 
                      {AutBadge}
                      </Card>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {Actions.bandeja_de_autorizaciones()}}>  
                      <Card
                        containerStyle = {styles.curvedCardLeft}
                        title='Autorizaciones left'
                        image={require('../../assets/images/autorizaciones_300.png')}
                        imageStyle = {styles.imgCard}
                      > 
                      {AutBadge}
                      </Card>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.columna}> 
                    <TouchableOpacity onPress={() => {Actions.bandeja_de_autorizaciones()}}>  
                      <Card
                        containerStyle = {styles.curvedCardRight}
                        title='Autorizaciones right'
                        image={require('../../assets/images/autorizaciones_300.png')}
                        imageStyle = {styles.imgCard}
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
  buttonContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 270
  },
  listHeader: {
    flex: 1,
    height: 30,
    backgroundColor: '#c9d6e8',
    justifyContent: 'center',
  },
  listHeaderText: {
    marginLeft: 20,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 0,
    height: '100%'
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  imgCard: {
    backgroundColor: 'white', 
    height: 120,
    width: 120,
    alignSelf: 'center'
  },
  cardAutLvl1: {
    width: '95%',
    height: 200
  },
  cardAutLvl2: {
    width: '95%',
    height: 220
  },
  columna: {
    flex: 0,
    width: "50%",
    height: undefined,
    // alignSelf: 'flex-end',
    justifyContent: 'flex-start'
  },
  paddedContainer: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  navCardTouch: {
    marginVertical: 3
  },
  navCard: {
    elevation: 3,
    backgroundColor: 'white', 
  },
  navCardTitle: {
    fontWeight: 'bold',
    marginHorizontal: 15,
    fontSize: 16,
    marginTop: 15
  },
  navCardDescription: {
    marginTop: 3,
    fontSize: 16,
    marginHorizontal: 15,
    marginBottom:15
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
},
headerBackground:{
  width: null,
  alignSelf: 'stretch',
  
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
},
profilepic:{
    flex: 1,
    alignSelf: 'center',
    alignItems:'center',
    borderRadius: 75,
    borderColor: '#fff',
    borderWidth: 4,
},
name:{
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlign:'center',
    
},
nameDos:{
  fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign:'center',
    margin:5,
},
pos:{
    fontSize: 14,
    color: '#0394c0',
    fontWeight: '100',
    fontStyle: 'italic',
    

    },
texto:{
  alignItems: 'center',
  justifyContent: 'space-between',
  margin:5
},
barra:{
flexDirection: 'row',
},
menuOption: {
  paddingVertical:10,
  marginHorizontal: 20,
  color: 'black',
  fontSize: 16,
  width: 260,
  borderTopWidth: 1,
  borderColor: 'rgb(244,244,244)' 
},
menuOptionFinal:{
  padding: 10,
  marginHorizontal: 20,
  color: 'black',
  fontSize: 16,
  width: 260,
  borderWidth: 1,
  borderBottomWidth: 1,
  borderColor: 'rgb(224,224,224)'
},
curvedCardLeft:{
  // padding: 20,
  borderRadius: 10,
  backgroundColor: 'white',
  elevation: 6,
  marginTop: 0,
  marginBottom: 10,
  marginLeft: 8,
  marginRight: 5
},
curvedCardRight:{
  // padding: 20,
  borderRadius: 10,
  backgroundColor: 'white',
  elevation: 6,
  marginTop: 0,
  marginBottom: 10,
  marginLeft: 5,
  marginRight: 10
},
curvedCardHeader:{
  fontSize: 26,
  color: "black"
},
// ,
// overAllContainer: {
//   marginTop: 80
// }
});