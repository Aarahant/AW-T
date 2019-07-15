import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  imgCard: {
    backgroundColor: 'white', 
    height: 120,
    width: 120,
    alignSelf: 'center'
  },
  celdaOption: {
    height: 40
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
  cardTitleStyle: {},
  name:{
      fontSize: 16,
      color: 'black',
      fontWeight: 'bold',
      textAlign:'center',
  },
  texto:{
    alignItems: 'center',
    justifyContent: 'space-between',
    margin:5
  },
  drawer: {
    justifyContent: 'space-between'
  },

  justificación: {
    flexDirection: 'row',
    justifyContent: 'center'
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
    justifyContent: "space-around"
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingContainerCommon: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: "center"
  },
  kds_logo_image: {
    height: 260,
    width: 260,
  },
  Titulo: {
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
  informaciónGrande: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 18,
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
  subtituloGrande: {
    color: 'black',
    fontFamily: 'sans-serif-condensed',
    fontSize: 19
  },
  contenido: {
    fontFamily: 'sans-serif-condensed',
    color: 'grey',
    fontSize: 18
  },
  contenidoBold: {
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
  NumOC: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 19,
    color: 'rgb(38, 51, 140)',
  },
  titulo_linea: {
    fontSize: 16,
    color: "rgb(38, 51, 140)"
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
  },
  separadorContainer:{
    alignItems: 'flex-start',
    backgroundColor: '#f2f2f2'
  },
  separador: {
    alignItems: 'flex-start',
    fontSize: 24,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 15
  },

  postTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgb(66, 66, 66)'
  },

  PressListItem: {
    backgroundColor: '#fff'
  },
  titleListItem: {},
  subtitleListItem:{},

  emailItem:{
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 10
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
  Overlay: {
    backgroundColor: "rgba(255, 255, 255, 1)"
  },

  curvedCard:{
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 10,
    marginTop: 5,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15
  },
  curvedCardHeader:{
    fontSize: 26,
    color: "black"
  },
  curvedCardHeaderHighlighted: {
    fontSize: 26,
    color: "rgb(38, 51, 140)"
  },
  curvedCardSubtitle: {
    fontSize: 16,
    color: "grey",
    fontFamily: 'sans-serif-condensed'
  },
  curvedCardContent: {
    fontSize: 16,
    color: "#B7B6B6"
  },
  curvedCardSubtitleHighlighted: {
    fontSize: 18,
    color: "black",
    fontFamily: 'sans-serif-condensed'
  },
  non_pending: {
    width: 250, 
    textAlign: "center", 
    fontSize: 20
  },

  //table_styles
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
  },
  // Router Navbar
  navBar: {
    backgroundColor: "red",
    color: "#FFF",
    fontWeight: "normal"
  } 
});