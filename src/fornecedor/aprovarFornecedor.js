import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, FlatList , Button, Text, View, TouchableHighlight, Alert } from 'react-native';
//importacao de variaveis globais
import Globais from '../Globais.js';

export default class AprovarFornecedor extends Component {
  constructor(props) {
    super(props)

    this.state = {
        fornecedores:[]
    }
}
  
  async getFornecedores() {
    try {
      const token = Globais.global_access_token;

      const url = window.servidor + '/fornecedor/pendentes';

      const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
      };
      const response = await fetch(url, requestOptions);
      const json = await response.json();
      this.setState({ fornecedores: json });
      console.log(json);
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
  }

  componentDidMount(){
    this.getFornecedores()
  }    

  criarAlertaFornecedorAprovado = () =>
  Alert.alert(
    "Alerta",
    "Fornecedor aprovado com sucesso",
    [
      { text: "OK", onPress: () => console.log("Fornecedor aprovado com sucesso reconhecido") }
    ]
  );   

  fornecedorPressionado = (item) => {
    this.aprovar(item.id)
  }

  aprovar = (id) => {
    const token = Globais.global_access_token;
        
    const requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(id)
    };

    const url = window.servidor + "/fornecedor/aprovar/"+ id

    fetch(url, requestOptions)
        .then(response => {
            console.log("aprovado");
            this.criarAlertaFornecedorAprovado();
            this.getFornecedores();
        })
        .catch(erro => console.log(erro));
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
          <View style={{height:"10%", justifyContent: "center"}}>
            <Text style={{fontWeight: "300", fontSize:25,alignSelf:"center"}}>Macaé Classifica</Text>            
            <Text style={{fontWeight: "300", fontSize:25,alignSelf:"center"}}>Aprovar Fornecedores</Text>
          </View>
            <View style={{height:"82%", justifyContent: "center"}}>
                <SafeAreaView style={styles.container}>
                    <FlatList
                        ItemSeparatorComponent={
                            Platform.OS !== 'android' &&
                            (({ highlighted }) => (
                            <View
                                style={[
                                style.separator,
                                highlighted && { marginLeft: 0 }
                                ]}
                            />
                            ))
                        }
                        data={this.state.fornecedores}
                        renderItem={({ item, index, separators }) => (
                            <TouchableHighlight
                            key={item.id}
                            onPress={() => this.fornecedorPressionado(item)}
                            onShowUnderlay={separators.highlight}
                            onHideUnderlay={separators.unhighlight}>
                            <View style={{ backgroundColor: 'lightblue', padding: 10, marginVertical: 6, marginHorizontal: 14 }}>
                                <Text style={{fontSize: 16}}>{'Nome - ' + item.nome}</Text>
                                <Text style={{fontSize: 10}}>{'CPF - ' + item.cic}</Text>
                                <Text style={{fontSize: 10}}>{'Endereço - ' + item.endereco}</Text>
                                <Text style={{fontSize: 10}}>{'Bairro - ' + item.bairro}</Text>
                            </View>
                            </TouchableHighlight>
                        )}
                    />        
                </SafeAreaView>
            </View>   
          <Text style={{fontWeight: "300", fontSize:5,alignSelf:"center"}}> </Text>
          <Button 
	        style={{marginTop: 5, fontSize:10, height: 45}}
            title='Cancelar'              
            onPress={() => {
	          this.redirect();
            }} 
           />            
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 5
    },
    item: {
      backgroundColor: 'lightblue',
      padding: 10,
      marginVertical: 6,
      marginHorizontal: 14,
    },
    title: {
      fontSize: 16,
    },
  });

