import React, { Component } from 'react'
import { Button, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import ModalSelector from 'react-native-modal-selector'
//importacao de variaveis globais
import Globais from '../Globais.js';

export default class NovoProduto extends Component {
  constructor(props) {
    super(props)

    this.state = {
        nome: "",
        descricao: "",
        preco: 0,
        maiorDeIdade: false,
        subcategorias: [],
        subcategoria: {},
        subcategoriaid: -1,
        fotoPrincipal: "/images/produto-sem-foto.png",
        outrasFotos: [],
        fornecedorid: 0         
    }
}
  
  async getSubCategorias() {
    try {
      const url = window.servidor + '/subcategoria/listar';
      const requestOptions = {
        method: 'GET'
      };
      const response = await fetch(url, requestOptions);
      const json = await response.json();
      this.setState({ subcategorias: json });
      console.log(json);
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
  }

  componentDidMount(){
    this.getSubCategorias()
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
        <View style={{width: "85%", alignSelf: "center"}}>
          <View style={{height:"30%", justifyContent: "center"}}>
          <Text style={{fontWeight: "300", fontSize:25,alignSelf:"center"}}>Macaé Classifica</Text>            
            <Text style={{fontWeight: "300", fontSize:25,alignSelf:"center"}}>Cadastrar Produto</Text>
            </View>

            <Text style={{fontWeight: "300", fontSize:15,marginTop: 5,alignSelf:"center"}}>Nome:</Text>
            <TextInput      
              style={{marginTop: 5, fontSize:10, height: 45}}        
              placeholder="NOME:"
              value={this.state.nome}
              onChangeText={texto => this.setState({nome: texto})}
            />

            <Text style={{fontWeight: "300", fontSize:15,alignSelf:"center"}}>Descrição:</Text>
            <TextInput              
              style={{marginTop: 5, fontSize:10, height: 45}}
              placeholder="DESCRIÇÂO"
              value={this.state.descricao}
              onChangeText={texto => this.setState({descricao: texto})}
            />

            <Text style={{fontWeight: "300", fontSize:15,alignSelf:"center"}}>Preço:</Text>
            <TextInput              
              style={{marginTop: 5, fontSize:10, height: 45}}
              placeholder="PREÇO"
              value={this.state.preco}
              onChangeText={texto => this.setState({preco: texto})}
            />

            <Text style={{fontWeight: "300", fontSize:15,alignSelf:"center"}}>Subcategoria:</Text>
			      <ModalSelector
				      data={this.state.subcategorias}
				      keyExtractor= {item => item.id}
				      labelExtractor= {item => item.nome}
				      onChange={(option) => this.setState({subcategoria: option.label})}
			      />

            <Text style={{fontWeight: "300", fontSize:5,alignSelf:"center"}}> </Text>
            <Button 
              style={{marginTop: 5, fontSize:10, height: 45}}
              title='Limpar'
              color="#ff0000"
              onPress={() => {
                this.setState({nome: ''}) 
                this.setState({descricao: ''}) 
                this.setState({preco: ''})  
                this.setState({subcategoria: ''}) 
              }} 
            />

            <Text style={{fontWeight: "300", fontSize:5,alignSelf:"center"}}> </Text>
            <Button 
			        style={{marginTop: 5, fontSize:10, height: 45}}
              title='Confirmar'
              color="#adff2f"
              onPress={() => {
                this.setState({login: 'confirmar'})											
              }} 
            />
            
            <Text style={{fontWeight: "300", fontSize:5,alignSelf:"center"}}> </Text>
            <Button 
			        style={{marginTop: 5, fontSize:10, height: 45}}
              title='Cancelar'              
              onPress={() => {
				          this.props.navigation.navigate('Menu') 
              }} 
            />            
          </View>
    )
  }
}

