import registerRootComponent from 'expo/build/launch/registerRootComponent';
//window.servidor = 'http://localhost:8080'
window.servidor = 'https://macaeclassificabackend.herokuapp.com'

import App from './App';

registerRootComponent(App);
