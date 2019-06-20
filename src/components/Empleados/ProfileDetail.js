import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Image, 
} from 'react-native';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';

export default class ProfileDetail extends React.Component {
  constructor(props) {
    super(props);
    // console.log("################The Force Awakens (Remastered)");
    // console.log(this.props);
    this.state = {
      empleado_keys: {
        "TOKEN_P": global.token,
        "MB_CIASID_P": this.props.MB_CIASID,
        "Emp_nie_P": this.props.Emp_nie,
        "Mb_Epr_cod_P": this.props.MB_Epr_cod
      },
      empleado_data: {},
      loading_empleado_data: true,
    };
    // console.log(this.state.empleado_keys);
  }

  componentDidMount() {
    // console.log("############### Han Solo")
    axios.post('http://kyrios.fortidyndns.com:83/KDSProyectosJavaEnvironment/rest/restgEmpleadosInfo', 
      this.state.empleado_keys
     ).then(response => {
       if (response.data.SUCCESS){
        this.setState({
          empleado_data: response.data,
          loading_empleado_data: false
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
      //  console.log(this.state.empleado_data);
     })
     .catch(error =>  console.log(error));
  }

  render() { 
    const loading_empleado_data = this.state.loading_empleado_data;
    const empleado_data = this.state.empleado_data;
    var randomImages = [
      require('../../../assets/user_images/6.png')
    ]; 
    
    if (loading_empleado_data != true) {
      return (   
        <View style={styles.container}>
          <ScrollView style={styles.contentContainer}>
            <View style={styles.innerContentPadding}>
              <ScrollView>
                <View style ={styles.header}>
                  <View style={styles.profilepicWrap}>
                    <Image style={styles.profilepic} source={randomImages[0]}/>
                  </View> 
                  <Text style={styles.profile_data}></Text>
                </View>
              </ScrollView>
              <Text style={styles.at}>{empleado_data.Emp_NombreCom}</Text>
              <Text style ={styles.at2}>{empleado_data.CNCIASDSC}</Text>
              <View style={styles.descriptionArea}>
                <Text style={styles.descriptionText}> DIRECCIÓN: {empleado_data.Emp_DrCalle} #{empleado_data.Emp_DrNumE}, {empleado_data.Emp_DrColonia}</Text>
                <Text style={styles.descriptionText}>MUNICIPIO: {empleado_data.Emp_DrMunicipio}, CP: {empleado_data.Emp_DrCodigoP}</Text>
              </View>
            </View>
            <TouchableHighlight style={styles.navCardTouch}>
              <View style={styles.navCard}>
                <View style={styles.navCardContent}>
                  <Text style={styles.postTitle}>Código postal</Text>
                  <Text style={styles.postContent}>{empleado_data.Emp_DrCodigoP}</Text>
                </View>
              </View>
            </TouchableHighlight> 
          </ScrollView>
        </View>
      );
    } else {
      return (   
        <View style={styles.loadingContainer}>
          {/* <Bars size={50} color="#2b5580" /> */}
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
  header:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  at:{
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    color: 'rgb(232,102,23)',
    fontWeight: 'bold',
    fontSize: 22,
  },
  at2:{
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'rgb(232,159,23)',
    fontWeight: 'bold',
    fontSize: 18,
  },
  pub: {
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 12,
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
    paddingVertical: 0,
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
  }
});