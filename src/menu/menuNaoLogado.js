import React, { Component } from 'react'
import { Button, Text, View } from 'react-native';

//importacao de variaveis globais
import Globais from '../Globais.js';
export default class MenuNaoLogado extends Component {
  state = {
  }

  render() {
    return (
        <View style={{width: "85%", height:"100%", alignSelf: "center"}}>
          <View style={{height:"40%", justifyContent: "center"}}>
            <Text style={{fontWeight: "600", fontSize:30,alignSelf:"center"}}>Macaé Classifica</Text>
            <Text style={{fontWeight: "600", fontSize:30,alignSelf:"center"}}>Menu</Text>            
            </View>
            <Button 
              style={{marginTop: 5, fontSize:10, height: 50}}
              title='Entrar'
              color="green"
              onPress={() => {
				this.props.navigation.navigate('Login')
              }} 
            />            
            <Text style={{fontWeight: "300", fontSize:10,alignSelf:"center"}}> </Text>
            <Button 
              title='Cadastre-se'
              color="green"
              onPress={() => {
				this.props.navigation.navigate('Cadastro de Fornecedores')  
              }} 
            />
            <Text style={{fontWeight: "300", fontSize:10,alignSelf:"center"}}> </Text>
            <Button 
              title='Visualizar Produtos'
              color="green"
              onPress={() => {
				this.props.navigation.navigate('Visualizar Produtos')  
              }} 
            />
          </View>
    )
  }
}