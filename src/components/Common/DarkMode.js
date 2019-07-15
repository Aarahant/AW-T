import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  imgCard: {
    backgroundColor: 'rgb(26, 81, 115)', 
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
    color: 'rgb(227, 249, 250)',
    fontSize: 16,
    width: 260,
    borderTopWidth: 1,
    borderColor: 'rgb(224,224,224)'
  },
  menuOptionFinal:{
    padding: 10,
    marginHorizontal: 20,
    color: 'rgb(227, 249, 250)',
    fontSize: 16,
    width: 260,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgb(224,224,224)'
  },
  curvedCardLeft:{
    borderRadius: 10,
    backgroundColor: 'rgb(26, 81, 115)',
    borderColor: 'rgb(26, 81, 115)',
    elevation: 6,
    marginTop: 0,
    marginBottom: 10,
    marginLeft: 8,
    marginRight: 5
  },
  curvedCardRight:{
    borderRadius: 10,
    backgroundColor: 'rgb(26, 81, 115)',
    borderColor: 'rgb(26, 81, 115)',
    elevation: 6,
    marginTop: 0,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 10
  },
  cardTitleStyle: {
    color: 'rgb(227, 249, 250)'
  },
  name:{
      fontSize: 16,
      color: 'rgb(227, 249, 250)',
      fontWeight: 'bold',
      textAlign:'center',
  },
  texto:{
    alignItems: 'center',
    justifyContent: 'space-between',
    margin:5
  },
  // drawer: {
  //   backgroundColor: 'rgb(18, 56, 79)',
  //   justifyContent: 'space-between'
  // },

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
    backgroundColor: 'rgb(18, 56, 79)',
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
    backgroundColor: 'rgb(13, 97, 114)'
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
    backgroundColor: 'rgb(18, 56, 79)',
    justifyContent: "center",
    alignItems: "center"
  },
  kds_logo_image: {
    height: 260,
    width: 260,
  },
  Titulo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 22,
    color: 'rgb(227, 249, 250)'
  },
  TotalInsumo: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 19,
    // color: 'rgb(182, 202, 214)'
    color: 'rgb(195, 218, 232)'
  },
  información: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 16,
    color: 'rgb(207, 253, 255)'
  },
  informaciónGrande: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 18,
    color: 'rgb(207, 253, 255)'
  },
  subTitulo: {
    fontFamily: 'sans-serif-condensed',
    // color: 'rgb(182, 202, 214)',
    color :'rgb(195, 218, 232)',
    fontSize: 16
  },
  subtitulo: {
    color: 'rgb(227, 249, 250)',
    fontFamily: 'sans-serif-condensed',
    fontSize: 18,
    marginTop: 10
  },
  subtituloGrande: {
    color: 'rgb(227, 249, 250)',
    fontFamily: 'sans-serif-condensed',
    fontSize: 19
  },
  contenido: {
    fontFamily: 'sans-serif-condensed',
    color: 'rgb(207, 253, 255)',
    fontSize: 18
  },
  contenidoBold: {
    fontFamily: 'sans-serif-condensed',
    fontWeight: 'bold',
    color: 'rgb(207, 253, 255)',
    fontSize: 18
  },
  contenidoLargo: {
    fontFamily: 'sans-serif-condensed',
    color: 'rgb(207, 253, 255)',
    fontSize: 18,
    textAlign: 'justify'
  },
  contenidoNoDoc: {
    fontFamily: 'Roboto',
    color: 'rgb(145, 159, 255)',
    fontSize: 20
  },
  NumOC: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 19,
    color: 'rgb(145, 159, 255)',
  },
  titulo_linea: {
    fontSize: 16,
    color: 'rgb(145, 159, 255)'
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
    backgroundColor: 'rgb(26, 81, 115)'
  },
  separador: {
    alignItems: 'flex-start',
    fontSize: 24,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 15,
    color: 'rgb(227, 249, 250)'
  },

  postTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgb(227, 249, 250)'
  },

  PressListItem: {
    backgroundColor: 'rgb(18, 56, 79)'
  },

  // PDFs
  titleListItem: {
    color: 'rgb(207, 253, 255)'
  },
  subtitleListItem:{
    color: 'rgb(207, 253, 255)'
  },

  emailItem:{
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.8)',
    padding: 10
  },
  
  justification_title_style: {
    color: 'rgb(227, 249, 250)',
    fontSize: 20,
  },
  justification_input_style: {
    borderWidth: 1,
    borderColor: 'rgb(207, 253, 255)',
    color: 'rgb(207, 253, 255)',
    margin: 6,
    textAlignVertical: 'top'
  },
  Overlay: {
    backgroundColor: 'rgb(26, 81, 115)'
  },
  
  curvedCard:{
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgb(26, 81, 115)',
    elevation: 10,
    marginTop: 5,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15
  },
  curvedCardHeader:{
    fontSize: 26,
    color: "rgb(227, 249, 250)"
  },
  curvedCardHeaderHighlighted: {
    fontSize: 26,
    color: "rgb(145, 159, 255)"
  },
  curvedCardSubtitle: {
    fontSize: 16,
    color: "rgb(227, 249, 250)",
    fontFamily: 'sans-serif-condensed'
  },
  curvedCardContent: {
    fontSize: 16,
    color: "rgb(207, 253, 255)"
  },
  curvedCardSubtitleHighlighted: {
    fontSize: 18,
    color: "rgb(227, 249, 250)",
    fontFamily: 'sans-serif-condensed'
  },
  non_pending: {
    width: 250, 
    textAlign: "center", 
    fontSize: 20,
    color: "rgb(227, 249, 250)"
  },
  
  //table_styles
  general_cell_style: {
  },
  general_table: { 
    marginVertical: 3
  },
  table_general_head: {
    backgroundColor: 'rgb(26, 81, 115)'
  },
  general_title:{
    fontFamily: 'sans-serif-condensed',
    color: 'rgb(207, 253, 255)',
    fontSize: 16,
    margin: 4
  },
  general_subtitle:{
    fontFamily: 'sans-serif-condensed',
    color: 'rgb(195, 218, 232)',
    fontSize: 16,
    margin: 4
  },
  // Router Navbar
  navBar: {
      backgroundColor: "#1aa6a8",
      color: "#FFF",
      fontWeight: "normal"
  } 
});