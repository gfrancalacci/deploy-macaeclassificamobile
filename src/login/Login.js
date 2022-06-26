import React, { Component } from 'react'
import { Button, Text, View, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import Autenticar from './Autenticar'
//importacao de variaveis globais
import Globais from '../Globais.js';

export default class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
        login: "",
        senha: "",
    }
  }

  componentDidMount() {
    this.loginAutomatico();
  }

  loginAutomatico = () => {
    if(!Globais.global_autenticado){
      if(Globais.global_access_token){
        Autenticar.getUsuarioFromToken(Globais.global_access_token)
          .then(data => {         
            Globais.global_autenticado = true;
            this.autoRefreshToken();
            this.redirect();
          })
          .catch(erro => {
            this.limparInterface();
            Globais.global_autenticado = false;
            Globais.global_usuario = "";
            Globais.global_senha = "";
            Globais.global_tipo_usuario = "";
            this.erro("Falha no login!", "alertPlaceholder");
            console.log(erro);
          })
      }
    }
  }

  criarAlertaFalhaLogin = () =>
    Alert.alert(
      "Alerta",
      "Falha no Login - Tente novamente",
      [
        { text: "OK", onPress: () => console.log("Falha no login reconhecida") }
      ]
    );

  autoRefreshToken = () => {
    if(((Globais.global_refresh_token) && (parseInt(Globais.global_expiration_date) - Date.now()) <= 3600000 )) {
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

  handleLoginChange = (event) => {
    this.setState({login: event.target.value})
  }

  handleSenhaChange = (event) => {
    this.setState({senha: event.target.value})
  }

  cancelar = () => {
    this.limparInterface();
    this.props.history.push("/");
  }

  limparInterface = () => {
    this.setState({login: "", senha: ""})
  }

  erro = (msg, elementId) => {
    var element = document.getElementById(elementId);
    element.innerHTML = '';

    var wrapper = document.createElement('div');
    wrapper.innerHTML = '<div class="alert alert-danger alert-dismissible py-1" role="alert">'
                        + msg
                        + '<button type="button" class="btn-close py-2" data-bs-dismiss="alert" aria-label="Close"></button>'
                        + '</div>'

    element.append(wrapper);
  }

  logar = (e) => {
    e.preventDefault();
    e.stopPropagation();

    Autenticar.getToken(this.state.login, this.state.senha)
        .then(data => {    
            console.log('data', data);                        
            Globais.global_access_token = data.access_token;
            Autenticar.login(this.state.login, this.state.senha, data.access_token)
                .then(data => {
                   console.log('data', data);
                    if(data.error === undefined){
                        Globais.global_autenticado = true;
                        Globais.global_usuario = this.state.login;
                        Globais.global_senha = this.state.senha;                  
                        Globais.global_tipo_usuario = data.tipoUsuario;
                        if(data.tipoUsuario === "fornecedor"){
                          Globais.global_fornecedor_id = data.fornecedor_id;
                        } else {
                          Globais.global_fornecedor_id = "";
                        }
                        this.limparInterface();                        
                        this.redirect();
                    }
                    else{
                        this.limparInterface();
                        Globais.global_autenticado = false;                     
                        Globais.global_usuario = "";
                        Globais.global_senha = "";
                        Globais.global_tipo_usuario = "";
                        Globais.global_fornecedor_id = "";
                        this.criarAlertaFalhaLogin();
                        this.erro("Falha no login.", "alertPlaceholder");                        
                        console.error(data.error + ": " + data.error_description);
                    }
                })
                .catch(erro => {
                    this.limparInterface();
                    Globais.global_autenticado = false;
                    Globais.global_usuario = "";
                    Globais.global_senha = "";    
                    Globais.global_tipo_usuario = "";
                    Globais.global_fornecedor_id = "";                               
                    this.criarAlertaFalhaLogin();
                    this.erro("Falha no login.", "alertPlaceholder");                    
                });
        })
        .catch(erro => {
            console.log('erro', erro);
            this.limparInterface();
            Globais.global_autenticado = false;
            Globais.global_usuario = "";
            Globais.global_senha = "";     
            Globais.global_tipo_usuario = "";
            Globais.global_fornecedor_id = "";            
            this.criarAlertaFalhaLogin();   
            this.erro("Falha no login.", "alertPlaceholder");            
        })
   
  }

  redirect = () => {
    if(Globais.global_autenticado && (Globais.global_tipo_usuario === 'administrador')) {
      this.props.navigation.navigate('Menu Administrador')
    }
    else if(Globais.global_autenticado && (Globais.global_tipo_usuario === 'fornecedor')) {
      this.props.navigation.navigate('Menu Fornecedor')
    }    
    else {
      this.props.navigation.navigate('Menu')  
    }
  }

  render() {
    return (
        <View style={{width: "85%", height:"100%", alignSelf: "center"}}>
          <View style={{height:"40%", justifyContent: "center"}}>
            <Text style={{fontWeight: "600", fontSize:30,alignSelf:"center"}}>Macaé Classifica</Text>
            <Text style={{fontWeight: "600", fontSize:30,alignSelf:"center"}}>Login</Text>
            </View>
            <TextInput      
              style={{marginTop: 20}}        
              placeholder="Login"
              value={this.state.login}
              onChangeText={texto => this.setState({login: texto})}
            />
            <TextInput              
              style={{marginTop: 5}}
              placeholder="Senha"
              value={this.state.senha}
              onChangeText={texto => this.setState({senha: texto})}
              secureTextEntry = {true}
            />
            <Button 
              title='Enviar'
              onPress={(enviar) => {
                this.logar(enviar);   
              }} 
            />
          </View>
    )
  }
}