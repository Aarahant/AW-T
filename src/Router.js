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
import { strings } from './i18n';
import Login from './components/Login';
import HomeScreen from './components/HomeScreen';
import MusicianList from './components/Empleados/MusicianList';
import ProfileDetail from './components/Empleados/ProfileDetail';
import BandejaDeAutorizaciones from './components/Autorizaciones/BandejaDeAutorizaciones';
import AutorizacionPorTDC from './components/Autorizaciones/AutorizacionPorTDC';
import AutorizacionOC from './components/Autorizaciones/AutorizacionOC';
import Settings from './components/Settings/Settings';
import Idioma from './components/Settings/Idioma';
import LoadingScreen from './components/LoadingScreen';
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
                        title="Principio"
                        key="home_screen"
                        component={HomeScreen}
                        initial                        
                    />

                    {/* Escenas relacionadas al Personal */}
                    <Scene
                        title="Personal"
                        key="musician_list"
                        component={MusicianList}
                    />
                    <Scene
                        title="Perfil del empleado"
                        key="profile_detail"
                        component={ProfileDetail}
                    />

                    {/* Bandeja de autorizaciones */}
                    <Scene
                        // Distribución de autorizaciones pendientes según su tipo de documento
                        title="Bandeja de Autorizaciones"
                        key="bandeja_de_autorizaciones"
                        component={BandejaDeAutorizaciones}
                    />
                    <Scene
                        // Autorizaciones pendientes por tipo de documento seleccionado
                        title="Bandeja de Autorizaciones"
                        key="autorizacion_por_tdc"
                        component={AutorizacionPorTDC}
                    />
                    <Scene
                        // Detalles de la autorizacion de orden de compra
                        title="Orden de Compra"
                        key="autorizacion_oc"
                        component={AutorizacionOC}
                    />

                    {/* Configuración */}
                    <Scene
                        title="Configuración"
                        key="settings"
                        component={Settings}
                    />
                    <Scene
                        title="Selección de Idioma"
                        key="idiomas"
                        component={Idioma}
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
