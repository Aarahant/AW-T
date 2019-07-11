import React from 'react';
import {
    Scene,
    Stack,
    Router
} from 'react-native-router-flux';
import { 
    StyleSheet,
    StatusBar 
} from 'react-native';
import Login from './components/Login';
import HomeScreen from './components/HomeScreen';
import MusicianList from './components/Empleados/MusicianList';
import ProfileDetail from './components/Empleados/ProfileDetail';
import BandejaDeAutorizaciones from './components/Autorizaciones/BandejaDeAutorizaciones';
import AutorizacionPorTDC from './components/Autorizaciones/AutorizacionPorTDC';
import AutorizacionOC from './components/Autorizaciones/AutorizacionOC';
import AutorizacionPag from './components/Autorizaciones/AutorizacionPag';
import AutorizacionPagCXP from './components/Autorizaciones/AutorizacionPagCXP';
import AutorizacionRav from './components/Autorizaciones/AutorizacionRav';
import AutorizacionReq from './components/Autorizaciones/AutorizacionReq';
import Settings from './components/Settings/Settings';
import Idioma from './components/Settings/Idioma';
import Pantalla from './components/Settings/Pantalla';
import LoadingScreen from './components/Common/LoadingScreen';
import IdiomaInicial from './components/IdiomaInicial';

const RouterComponent = () => {
    return (
        <Router tintColor='white' navigationBarStyle={style.navBar} titleStyle={{color: "white"}}>
            <Stack hideNavBar key="root">
                <Stack
                    key="auth"
                    type="reset"
                    style={style.navBarStyle}
                > 
                    <Scene
                        hideNavBar
                        title="Inicio de sesión"
                        key="login"
                        component={Login}
                        initial
                        style={style.sceneStyle}
                    />
                    <Scene
                        title = "Elegir Idioma"
                        key="idioma_inicial"
                        component={IdiomaInicial}
                    />
                </Stack>
                <Stack
                    key="load"
                    type="reset"
                    style={style.navBarStyle}
                >
                    <Scene
                        // title="Inicio de sesión"
                        key="loading_screen"
                        component={LoadingScreen}
                        initial
                    />
                </Stack>
                <Stack
                    key="main"
                    type="reset"
                    style={style.titleStyle}
                >
                    <Scene
                        hideNavBar
                        title=""
                        key="home_screen"
                        component={HomeScreen}
                        initial                        
                    />

                    {/* Escenas relacionadas al Personal */}
                    <Scene
                        title=""
                        key="musician_list"
                        component={MusicianList}
                    />
                    <Scene
                        title=""
                        key="profile_detail"
                        component={ProfileDetail}
                    />

                    {/* Bandeja de autorizaciones */}
                    <Scene
                        // Distribución de autorizaciones pendientes según su tipo de documento
                        title=""
                        key="bandeja_de_autorizaciones"
                        component={BandejaDeAutorizaciones}
                    />
                    <Scene
                        // Autorizaciones pendientes por tipo de documento seleccionado
                        title=""
                        key="autorizacion_por_tdc"
                        component={AutorizacionPorTDC}
                    />
                    <Scene
                        // Detalles de la autorizacion de orden de compra
                        title=""
                        key="autorizacion_oc"
                        component={AutorizacionOC}
                    />
                    <Scene
                        // Detalles de la autorizacion de pago
                        title=""
                        key="autorizacion_pag"
                        component={AutorizacionPag}
                    />
                    <Scene
                        // Detalles de la autorizacion de pago --> Cuentas por pagar asociadas
                        title=""
                        key="autorizacion_pag_cxp"
                        component={AutorizacionPagCXP}
                    />
                    <Scene
                        // Detalles de la autorizacion de requisiciones
                        title=""
                        key="autorizacion_req"
                        component={AutorizacionReq}
                    />
                    <Scene
                        // Detalles de la autorizacion de registro de avance
                        title=""
                        key="autorizacion_rav"
                        component={AutorizacionRav}
                    />
                    {/* Configuración */}
                    <Scene
                        title=""
                        key="settings"
                        component={Settings}
                    />
                    <Scene
                        title=""
                        key="idiomas"
                        component={Idioma}
                    />
                    <Scene
                        title=""
                        key="pantalla"
                        component={Pantalla}
                    />
                </Stack>
            </Stack>
        </Router>
    );
};

const style = StyleSheet.create({
    navBarStyle: {
        top: StatusBar.currentHeight,
        backgroundColor: "#1aa6a8",
        color: "white"
    },
    navBar: {
        backgroundColor: "#1aa6a8",
        color: "#FFF",
        fontWeight: "normal"
    },
    barButtonIconStyle: {
        tintColor: "#FFF"
    },
    titleStyle: {
        flexDirection: 'row',
        width: 200
    }
});  
  
export default RouterComponent;
