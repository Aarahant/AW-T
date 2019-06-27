import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  DrawerLayoutAndroid,
  Picker,
  CheckBox,
} from 'react-native'; 
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import {  Header} from 'react-native-elements';
import { strings } from '../../i18n';

export default class MusicianList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      Empleados: [],
      data: [],
      error: null,
      searchTerm: '',
      checkHom: false,
      checkMuj: false,
      checkCla: false,
      checkRoc: false,
      checkJaz: false,
      checkBlu: false,
      checkRalt: false,
      checkMet: false,
      checkHeaMet: false,
      checkEle: false,
      checkPop: false,
      checkCumb: false,
      checkPia: false,
      checkAco: false,
      checkGui: false,
      checkGuiEle: false,
      checkVoc: false,
      checkVio: false,
      checkChe: false,
      checkBat: false,
      token2: this.props.token
    };
  }

  async componentDidMount() {
    this.titleInterval = setInterval(() => this.updateTitle(),1);
    // console.log("############## Props en MusicianList");
    // console.log(this.props);
    // console.log(global.token);
    this.arrayholder = [];
    // console.log("#####################rouge one")
    axios
      .post('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/restgEmpleados',
      {
        "TOKEN_P": global.token,
        "MB_CIASID_P": 1,
        "Mb_Epr_cod_P": "",
        "Emp_nie_P": 0,
        "Emp_NombreCom_P": ""
      }
      ).then(response => {
        if (response.data.SUCCESS){
          this.setState({
            Empleados: response.data,
            loading: false
          });
          this.arrayholder = response.data;
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
      })
      .catch(error =>  console.log(error));
  }

  updateTitle() {
    Actions.refresh({title: strings("modules.Settings.Idioma.title")});
    clearInterval(this.titleInterval);
  }

  renderItem(data){
    var randomImages = [
      require('../../../assets/user_images/6.png')
    ];

    return (
      <TouchableOpacity
        style={styles.emailItem}
        onPress={() => Actions.profile_detail(data.item)}
      >
       <View style={{flexDirection: 'row'}}>
          <Image source={randomImages[0]} style={{width: 45, height: 45}}/>
          <View style={{flex:1, margin:5}}>
            <Text style = {{fontWeight: "bold"}} >{data.item.Emp_NombreCom}</Text>
            <Text style={styles.emailSubject}>{data.item.MB_CIASID} | {data.item.Emp_nie} | {data.item.Emp_DrMunicipio}</Text>                  
            <View style={{ flex: 1 }}>
            </View>
          </View> 
        </View>
      </TouchableOpacity>
    );
  }
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  render() { 
    const loading = this.state.loading;
    const profile_data = this.state.Empleados;
    const filteredData= profile_data.sdtEmpleados;// .filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    
    var navigationView = (
      <View >
          <ScrollView>
            <View style={styles.texto}>
                <Text style={{fontWeight: 'bold'}}>Criterios de busqueda</Text>
                <Text style={{color: 'grey'}}>Si no se cambia el criterio de busqueda, buscara todo por default</Text>
                <Text>Genero</Text>
  
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkHom} onChange={()=>this.checkboxHom()}/>
                      <Text>Masculino</Text>
                </View>                    
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkMuj} onChange={()=>this.checkboxMuj()}/>
                      <Text>Femenino</Text>
                </View>
                
                <Text>Generos Musicales</Text>

                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkCla} onChange={()=>this.checkboxCla()}/>
                      <Text>Clasica</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkRoc} onChange={()=>this.checkboxRoc()}/>
                      <Text>Rock</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkJaz} onChange={()=>this.checkboxJaz()}/>
                      <Text>Jazz</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkBlu} onChange={()=>this.checkboxBlu()}/>
                      <Text>Blues</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkRalt} onChange={()=>this.checkboxRalt()}/>
                      <Text>Rock Alternativo</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkMet} onChange={()=>this.checkboxMet()}/>
                      <Text>Metal</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkHeaMet} onChange={()=>this.checkboxHeaMet()}/>
                      <Text>Heavy Metal</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkEle} onChange={()=>this.checkboxEle()}/>
                      <Text>Eléctronica</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkPop} onChange={()=>this.checkboxPop()}/>
                      <Text>Pop</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkCumb} onChange={()=>this.checkboxCumb()}/>
                      <Text>Cumbia</Text>
                </View>

                <Text>Instrumentos musicales</Text>

                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkGui} onChange={()=>this.checkboxGui()}/>
                      <Text>Guitarra</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkPia} onChange={()=>this.checkboxPia()}/>
                      <Text>Piano</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkAco} onChange={()=>this.checkboxAco()}/>
                      <Text>Acordeon</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkGuiEle} onChange={()=>this.checkboxGuiEle()}/>
                      <Text>Guitarra Eléctrica</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkVoc} onChange={()=>this.checkboxVoc()}/>
                      <Text>Vocalista</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkVio} onChange={()=>this.checkboxVio()}/>
                      <Text>Violin</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkChe} onChange={()=>this.checkboxChe()}/>
                      <Text>Chelo</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                      <CheckBox value={this.state.checkBat} onChange={()=>this.checkboxBat()}/>
                      <Text>Baterista</Text>
                </View>
                </View>
          </ScrollView>
      </View>
    ); 
    if (loading != true) {
      return (   
        <DrawerLayoutAndroid
        ref = "mainDrawer"
        drawerWidth={300}
       // drawerPosition={DrawerLayoutAndroid.positions.Left} 
        renderNavigationView={() => navigationView}>
        <View style={styles.container}>   
          <Header
              backgroundColor='#003366'
              leftComponent={{ icon: "search", color: '#fff', onPress:() => this.refs['mainDrawer'].openDrawer() }}
              centerComponent={{ text: 'Lista de Personal', style: { color: '#fff' } }}
          />
        <View style={styles.container}>
          {/* <SearchInput 
            onChangeText={(term) => { this.searchUpdated(term) }} 
            style={styles.searchInput}  
            placeholder="Buscar Persona..."
          /> */}
          <View> 
            <ScrollView contentContainerStyle={styles.contentContainer}>
              <FlatList
                data={filteredData}
                keyExtractor= {(item, index) => item.Emp_nie.toString() }
                renderItem={this.renderItem}
              />
            </ScrollView>
          </View>
        </View>
        </View>
        </DrawerLayoutAndroid>
      )     ;
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
  texto:{
    margin: 10,
    padding: 10,
  },
  contentContainer: {
    paddingTop: 0,
    height: '100%'
  },
  navCardTouch: {
    marginVertical: 4,
    marginHorizontal: 8,
  },
  navCard: {
    elevation: 3,
    backgroundColor: 'white', 
  },
  navCardContent: {
    margin: 5,
  },
  searchInput:{
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1
  },
  emailItem:{
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 10
  },
  emailSubject: {
    color: 'rgba(0,0,0,0.5)'
  },
});