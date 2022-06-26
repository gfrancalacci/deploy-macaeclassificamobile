import React, { Component } from 'react'
import { Button, Text, View } from 'react-native';

//importacao de variaveis globais
import Globais from '../Globais.js';
export default class MenuAdministrador extends Component {
  state = {
  }

  render() {
    return (
        <View style={{width: "85%", height:"100%", alignSelf: "center"}}>
          <View style={{height:"40%", justifyContent: "center"}}>
            <Text style={{fontWeight: "600", fontSize:30,alignSelf:"center"}}>Macaé Classifica</Text>
            <Text style={{fontWeight: "600", fontSize:30,alignSelf:"center"}}>Menu Administrador</Text>            
            </View>
            <Button 
              style={{marginTop: 5, fontSize:10, height: 50}}
              title='Alterar Senha'
              color="green"
              onPress={() => {
				this.props.navigation.navigate('Alterar Senha')
              }} 
            />            
            <Text style={{fontWeight: "300", fontSize:10,alignSelf:"center"}}> </Text>
            <Button 
              title='Aprovar Fornecedores'
              color="green"
              onPress={() => {
				this.props.navigation.navigate('Aprovar Fornecedores')  
              }} 
            />
            <Text style={{fontWeight: "300", fontSize:10,alignSelf:"center"}}> </Text>
            <Button 
              title='Aprovar Produtos'
              color="green"
              onPress={() => {
				this.props.navigation.navigate('Aprovar Produtos')  
              }} 
            />            
            <Text style={{fontWeight: "300", fontSize:10,alignSelf:"center"}}> </Text>
            <Button 
              title='Sair'
			        color="green"
              onPress={() => {
                Globais.global_autenticado = false;
                Globais.global_usuario = "";
                Globais.global_tipo_usuario = "";
                Globais.global_senha = "";
                Globais.global_access_token = "";
                Globais.global_refresh_token = "";
                Globais.global_expiration_date = "";
                Globais.global_expires_in = ""; 
                Globais.global_fornecedor_id = "";                               
                this.props.navigation.navigate('Menu')
              }} 
            />
          </View>
    )
  }
}