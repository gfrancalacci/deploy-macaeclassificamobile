//Importacao de componentes
import 'react-native-gesture-handler';
import React, { Component } from 'react'
import { StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importacao de Telas
import Login from './login/Login.js';
import AlterarSenha from './login/AlterarSenha.js';
import Fornecedor from './fornecedor/Fornecedor.js';
import AprovarFornecedor from './fornecedor/aprovarFornecedor.js';
import AprovarProdutos from './produto/aprovarProdutos.js';
import MenuAdministrador from './menu/menuAdministrador.js';
import MenuFornecedor from './menu/menuFornecedor.js';
import MenuNaoLogado from './menu/menuNaoLogado.js';
import VisualizarProdutos from './produto/visualizarProdutos.js';
import NovoProduto from './produto/novoProduto.js';
import MeusProdutos from './produto/meusProdutos.js';


//importacao de variaveis globais
import Globais from './Globais.js';

const Stack = createStackNavigator();


export default class App extends Component {

  constructor(props) {
    super(props)

    Globais.global_autenticado = false;
    Globais.global_usuario = "";
    Globais.global_tipo_usuario = "";
    Globais.global_senha = "";
    Globais.global_access_token = "";
    Globais.global_refresh_token = "";
    Globais.global_expiration_date = "";
    Globais.global_expires_in = "";    
    this.state = {
//       autenticado: false,
//       usuario: {}
    }
  }

  componentDidMount() {
    this.loginAutomatico();
    setInterval(() => this.autoRefreshToken(), 1800000);
  }

  loginAutomatico = () => {

    if(!Globais.global_autenticado){
      if(Globais.global_access_token){
        Autenticar.getUsuarioFromToken(Globais.global_access_token)
          .then(data => {
  console.log(data)
            this.handleAutenticadoChange(true, data);
            this.autoRefreshToken();
          })
          .catch(erro => {
            this.handleAutenticadoChange(false, {});
            Globais.global_login = "";
            Globais.global_senha = "";
            Globais.global_access_token = "";
            Globais.global_refresh_token = "";
            Globais.global_expiration_date = "";
            Globais.global_expires_in = "";            
            console.log(erro);
          })
      }
    }
  }

  autoRefreshToken = () => {
    if(Globais.global_refresh_token && (parseInt(Globais.global_expiration_date - Date.now()) <= 3600000 )) {
      console.log('Tentando refresh_token');
      Autenticar.refreshToken(Globais.global_refresh_token)
        // .then(data => console.log('data', data))
        .catch(erro => {
          console.log(erro);
        })
    }
    else {
      console.log("Não é necessário fazer refresh_token.");
    }
  }  


  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen
            name="Menu"
            component={MenuNaoLogado}
          />	            
          <Stack.Screen
            name="Login"
            component={Login}
          />
          <Stack.Screen
            name="Menu Administrador"
            component={MenuAdministrador}
          />		  
          <Stack.Screen
            name="Menu Fornecedor"
            component={MenuFornecedor}
          />		                  
          <Stack.Screen
            name="Alterar Senha"
            component={AlterarSenha}
          />
          <Stack.Screen
            name="Cadastro de Fornecedores"
            component={Fornecedor}
          />		  
          <Stack.Screen
            name="Aprovar Fornecedores"
            component={AprovarFornecedor}
          />		   
          <Stack.Screen
            name="Aprovar Produtos"
            component={AprovarProdutos}
          />		                  
          <Stack.Screen
            name="Visualizar Produtos"
            component={VisualizarProdutos}
          />
          <Stack.Screen
            name="Cadastrar Produtos"
            component={NovoProduto}
          />		 
          <Stack.Screen
            name="Meus Produtos"
            component={MeusProdutos}
          />		                         		            
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


const styles = StyleSheet.create({
  container: {
	flex: 1,
    padding: 10,
    backgroundColor: 'fff'
  },
  header: {
    fontSize: 10
  },
  nav: {
    flexDirection: "row",
    justifyContent: "center"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    padding: 10
  },
  subNavItem: {
    padding: 5
  },
  topic: {
    textAlign: "center",
    fontSize: 15
  }
});
