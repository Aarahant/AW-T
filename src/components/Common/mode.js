import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    justificación: {
      flexDirection: 'row',
      justifyContent: 'center'
    },
    loadingContainer: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: "center",
      alignItems: "center"
    },
    kds_logo_image: {
      height: 260,
      width: 260,
    },
    textInputStyle: {
      padding: 4,
      fontSize: 16,
      flex: 1,
      backgroundColor: 'rgb(103, 173, 179)',
      marginHorizontal: 5
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    containerButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 15,
      marginTop: 5
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
    pieAutorización: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundColor: 'rgb(13, 114, 109)'
    },
    datosContainer: {
      paddingVertical: 10,
      paddingHorizontal: 25,
      flex: 1,
      justifyContent: 'flex-start'
    },
    header:{
      alignItems: 'center',
      justifyContent: 'center',
    },
    ScrollContainer:{
      height: '100%',
    },
    contentContainer: {
      flexGrow: 1,
      flexDirection: "column",
      justifyContent: "space-between"
    },
    información: {
      fontFamily: 'sans-serif-condensed',
      fontSize: 16,
      color: '#b7b6b6'
    },
    subTitulo: {
      fontFamily: 'sans-serif-condensed',
      color: 'rgb(99,99,99)',
      fontSize: 16
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
    TotalInsumoArgent: {
      fontFamily: 'sans-serif-condensed',
      fontSize: 19,
      color: 'rgb(0, 143, 41)'
      // color: '#a5c97f'
    },
    emailItem:{
      borderBottomWidth: 0.5,
      borderColor: 'rgba(0,0,0,0.3)',
      padding: 10
    }
});