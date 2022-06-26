import React, { Component } from 'react'
import { Button, Text, View , Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import ModalSelector from 'react-native-modal-selector'

export default class Fornecedor extends Component {
  state = {
    cpf: "",
    nome: "",
    login: "",
    senha: "",
    rsenha: "",
    endereco: "",
    bairro: "",
	  bairros: [],
    isLoading: false
  }

  limparInterface = () => {
    this.setState({
      cpf: "",
      nome: "",
      login: "",
      senha: "",
      rsenha: "",
      endereco: "",
      bairro: ""
      })
  }

  async getBairros() {
    try {
      const url = window.servidor + '/bairro/listar';
      const requestOptions = {
        method: 'GET'
      };
      const response = await fetch(url, requestOptions);
      const json = await response.json();
      this.setState({ bairros: json });
      console.log(json);
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
  }

  componentDidMount(){
    this.getBairros()
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

  async gravar() {
    try {
      const dados = {
        "login": this.state.login,
        "senha": this.state.senha,
        "bairro": this.state.bairro,
        "cic": this.state.cpf,
        "endereco": this.state.endereco,
        "nome": this.state.nome
      }      

      const requestOptions = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(dados)
      };      

      const url = window.servidor + "/fornecedor/cadastrar";

      const response = await fetch(url, requestOptions);
      } catch (error) {
        console.log(error);
        this.criarAlertaErroNoCadastro();
      } finally {
        this.setState({ isLoading: false });
        this.criarAlertaCadastroSucesso();
        this.limparInterface();
      }
      
  }

  criarAlertaErroNoCadastro = () =>
  Alert.alert(
    "Alerta",
    "Erro no cadastro - Tente novamente",
    [
      { text: "OK", onPress: () => console.log("Erro no cadastro reconhecido") }
    ]
  );   

  criarAlertaCadastroSucesso = () =>
  Alert.alert(
    "Alerta",
    "Cadastro realizado com sucesso",
    [
      { text: "OK", onPress: () => console.log("Cadastro realizado com sucesso reconhecido") }
    ]
  );   

  criarAlertaSenhaAtualErrada = () =>
  Alert.alert(
    "Alerta",
    "Falha no cadastro - Senhas diferentes",
    [
      { text: "OK", onPress: () => console.log("Falha senha errada reconhecida") }
    ]
  );  

  render() {
    return (
        <View style={{width: "85%", alignSelf: "center"}}>
          <View style={{height:"10%", justifyContent: "center"}}>
          <Text style={{fontWeight: "300", fontSize:25,alignSelf:"center"}}>Macaé Classifica</Text>            
            <Text style={{fontWeight: "300", fontSize:25,alignSelf:"center"}}>Cadastro de Fornecedor</Text>
            </View>

            <Text style={{fontWeight: "300", fontSize:15,marginTop: 5,alignSelf:"center"}}>CPF / CNPJ:</Text>
            <TextInput      
              style={{marginTop: 5, fontSize:10, height: 45}}        
              placeholder="CPF / CNPJ:"
              value={this.state.cpf}
              onChangeText={texto => this.setState({cpf: texto})}
            />

            <Text style={{fontWeight: "300", fontSize:15,alignSelf:"center"}}>Nome:</Text>
            <TextInput              
              style={{marginTop: 5, fontSize:10, height: 45}}
              placeholder="Nome"
              value={this.state.nome}
              onChangeText={texto => this.setState({nome: texto})}
            />

            <Text style={{fontWeight: "300", fontSize:15,alignSelf:"center"}}>Login:</Text>
            <TextInput              
              style={{marginTop: 5, fontSize:10, height: 45}}
              placeholder="Login"
              value={this.state.login}
              onChangeText={texto => this.setState({login: texto})}
            />

            <Text style={{fontWeight: "300", fontSize:15,alignSelf:"center"}}>Senha:</Text>
            <TextInput              
              style={{marginTop: 5, fontSize:10, height: 45}}
              placeholder="Senha"
              value={this.state.senha}
              onChangeText={texto => this.setState({senha: texto})}
              secureTextEntry = {true}
            />

            <Text style={{fontWeight: "300", fontSize:15,alignSelf:"center"}}>Repetir Senha:</Text>
            <TextInput              
              style={{marginTop: 5, fontSize:10, height: 45}}
              placeholder="Repetir Senha"
              value={this.state.rsenha}
              onChangeText={texto => this.setState({rsenha: texto})}
              secureTextEntry = {true}
            />

            <Text style={{fontWeight: "300", fontSize:15,alignSelf:"center"}}>Endereço:</Text>
            <TextInput              
              style={{marginTop: 5, fontSize:10, height: 45}}
              placeholder="Endereço"
              value={this.state.endereco}
              onChangeText={texto => this.setState({endereco: texto})}
            />

            <Text style={{fontWeight: "300", fontSize:15,alignSelf:"center"}}>Bairro:</Text>
			      <ModalSelector
				      data={this.state.bairros}
				      keyExtractor= {item => item.id}
				      labelExtractor= {item => item.nome}
				      onChange={(option) => this.setState({bairro: option.nome})}
			      />

            <Text style={{fontWeight: "300", fontSize:5,alignSelf:"center"}}> </Text>
            <Button 
              style={{marginTop: 5, fontSize:10, height: 45}}
              title='Limpar'
              color="#ff0000"
              onPress={() => {
                this.limparInterface();    
              }} 
            />

            <Text style={{fontWeight: "300", fontSize:5,alignSelf:"center"}}> </Text>
            <Button 
			        style={{marginTop: 5, fontSize:10, height: 45}}
              title='Confirmar'
              color="#adff2f"
              onPress={() => {
                if (this.state.senha !== this.state.rsenha){ 
                  this.criarAlertaSenhaAtualErrada();
                  this.limparInterface();					
                }						
                else {
                  this.gravar();
                }
              }} 
            />
            
            <Text style={{fontWeight: "300", fontSize:5,alignSelf:"center"}}> </Text>
            <Button 
			        style={{marginTop: 5, fontSize:10, height: 45}}
              title='Cancelar'              
              onPress={() => {
                  this.limparInterface();                
				          this.props.navigation.navigate('Menu') 
              }} 
            />            
          </View>
    )
  }
}

