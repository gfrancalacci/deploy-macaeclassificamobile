import React, { Component } from 'react'
import { Button, Text, View, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
//importacao de variaveis globais
import Globais from '../Globais.js';
import Autenticar from './Autenticar'
export default class AlterarSenha extends Component {
  state = {
    login: '',
    senha: '',
    senhaAntiga: '',
    senhaRepetida: ''
  }

  cancelar = () => {
    this.limparInterface();
  }

  limparInterface = () => {
      this.setState({senha: "", login: "", senhaAntiga: "", senhaRepetida: ""})
  }

  handleSenhaAtualChange = (event) => {
      this.setState({senhaAntiga: event.target.value})
  }

  handleNovaSenhaChange = (event) => {
      this.setState({senha: event.target.value})
  }

  handleRepetirSenhaChange = (event) => {
      this.setState({senhaRepetida: event.target.value})
  }

  criarAlertaFalhaSenha = () =>
  Alert.alert(
    "Alerta",
    "Falha na Troca da Senha - Tente novamente",
    [
      { text: "OK", onPress: () => console.log("Falha na troca da senha reconhecida") }
    ]
  );

  criarAlertaSenhaRepetida = () =>
  Alert.alert(
    "Alerta",
    "Falha na Troca da Senha - Senhas diferentes",
    [
      { text: "OK", onPress: () => console.log("Falha na troca da senha reconhecida") }
    ]
  );

  criarAlertaUsuarioDiferenteLogado = () =>
  Alert.alert(
    "Alerta",
    "Falha na Troca da Senha - Login diferente do atual",
    [
      { text: "OK", onPress: () => console.log("Falha Login diferente do atual reconhecida") }
    ]
  );  

  criarAlertaSenhaAtualErrada = () =>
  Alert.alert(
    "Alerta",
    "Falha na Troca da Senha - Senha atual errada",
    [
      { text: "OK", onPress: () => console.log("Falha senha atual errada reconhecida") }
    ]
  );  

  criarAlertaSenhaAlteradaSucesso = () =>
  Alert.alert(
    "Alerta",
    "Senha alterada com sucesso",
    [
      { text: "OK", onPress: () => console.log("Senha alterada com sucesso reconhecida") }
    ]
  );   

  criarAlertaErroAlterarSenha = () =>
  Alert.alert(
    "Alerta",
    "Erro ao alterar a senha",
    [
      { text: "OK", onPress: () => console.log("Erro ao alterar a senha reconhecida") }
    ]
  );   

  alterarSenha = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = Globais.global_access_token;

    if(this.state.login !== Globais.global_usuario){
      this.criarAlertaUsuarioDiferenteLogado();
      this.limparInterface();
    } else if (this.state.senhaAntiga !== Globais.global_senha){ 
        this.criarAlertaSenhaAtualErrada();
        this.limparInterface();
    } else if(this.state.senha !== this.state.senhaRepetida){
        this.criarAlertaSenhaRepetida();
        this.limparInterface();        
    } else {
        Autenticar.login(Globais.global_usuario, this.state.senhaAntiga, token)
          .then(data => {
              this.alterarUsuario(data);              
          })
          .catch(erro => {
              this.criarAlertaErroAlterarSenha();
              this.limparInterface();
              console.log(erro);
          })
    }
  }

  alterarUsuario = (usuario) => {
    const dados = {
        "id": usuario.id,
        "login": usuario.login,
        "senha": this.state.senhaRepetida
    }

    const token = Globais.global_access_token;
        
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(dados)
    };

    const url = window.servidor + '/usuario/alterar'

    fetch(url, requestOptions)
        .then(response => {
            this.criarAlertaSenhaAlteradaSucesso();
            Globais.global_senha = this.state.senhaRepetida;
            this.limparInterface();
        })
        .catch(erro => {
            this.criarAlertaErroAlterarSenha();
            this.limparInterface();            
            console.log(erro);
        });
            
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
          <View style={{height:"15%", justifyContent: "center"}}>
            <Text style={{fontWeight: "600", fontSize:25,alignSelf:"center"}}>Macaé Classifica</Text>
            <Text style={{fontWeight: "600", fontSize:25,alignSelf:"center"}}>Alterar Senha</Text>            
            </View>			
            <Text style={{fontWeight: "600", fontSize:15,alignSelf:"center"}}>Login</Text>
            <TextInput      
              style={{marginTop: 15}}        
              placeholder="Login"
              value={this.state.login}
              onChangeText={texto => this.setState({login: texto})}
            />
            <Text style={{fontWeight: "600", fontSize:15,marginTop: 15,alignSelf:"center"}}>Senha Antiga</Text>
            <TextInput              
              style={{marginTop: 15}}
              placeholder="Senha Antiga"
              value={this.state.senhaAntiga}
              onChangeText={texto => this.setState({senhaAntiga: texto})}
              secureTextEntry = {true}
            />
            <Text style={{fontWeight: "600", fontSize:15,marginTop: 15,alignSelf:"center"}}>Nova Senha</Text>
            <TextInput              
              style={{marginTop: 15}}
              placeholder="Nova Senha"
              value={this.state.senha}
              onChangeText={texto => this.setState({senha: texto})}
              secureTextEntry = {true}
            />
            <Text style={{fontWeight: "600", fontSize:15,marginTop: 15,alignSelf:"center"}}>Repetir Nova Senha</Text>
            <TextInput              
              style={{marginTop: 15}}
              placeholder="Repetir Nova Senha"
              value={this.state.senhaRepetida}
              onChangeText={texto => this.setState({senhaRepetida: texto})}
              secureTextEntry = {true}
            />
            <Text style={{fontWeight: "300", fontSize:5,alignSelf:"center"}}> </Text>
            <Button 
              style={{marginTop: 5, fontSize:10, height: 50}}
              title='Limpar'
              color="#ff0000"
              onPress={() => {
                this.limparInterface();
              }} 
            />            
            <Text style={{fontWeight: "300", fontSize:5,alignSelf:"center"}}> </Text>
            <Button 
              title='Enviar'
              color="#adff2f"
              onPress={(enviar) => {
                this.alterarSenha(enviar);
              }} 
            />
            <Text style={{fontWeight: "300", fontSize:5,alignSelf:"center"}}> </Text>
            <Button 
              title='Cancelar'
              onPress={() => {
                this.redirect();
              }} 
            />
          </View>
    )
  }
}