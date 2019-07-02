package com.kdsmovil;

import com.facebook.react.ReactActivity;
// react-native-splash-screen >= 0.3.1
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
//    @Override
//     protected void onCreate(Bundle savedInstanceState) {
       
//         super.onCreate(savedInstanceState);
//     }
    @Override
    protected String getMainComponentName() {
         SplashScreen.show(this);  // here
        return "KDSMovil";
    }
}
