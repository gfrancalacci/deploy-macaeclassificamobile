import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, FlatList , Button, Text, View, TouchableHighlight, Alert, Image } from 'react-native';
//importacao de variaveis globais
import Globais from '../Globais.js';

export default class AprovarProdutos extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             produtosNaoAprovados: [],
             verProdutoIndividual: false,
             produtoIndividual: {},
             isLoading: false
        }
    }
  
  async preencherLista() {
    try {
      const token = Globais.global_access_token;

      const url = window.servidor + '/produto/naoaprovados'

      const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    };
      const response = await fetch(url, requestOptions);
      const json = await response.json();
      if(Array.isArray(json)){
        this.setState({produtosNaoAprovados: json});
    }
      console.log(json);
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
  }

  componentDidMount(){
    this.preencherLista();
  }    

  criarAlertaProdutoAprovado = () =>
  Alert.alert(
    "Alerta",
    "Produto aprovado com sucesso",
    [
      { text: "OK", onPress: () => console.log("Produto aprovado com sucesso reconhecido") }
    ]
  );   

  produtoPressionado = (item) => {
    this.aprovarProduto(item.id)
  }

  aprovarProduto = (id_produto) => {
    const token = Globais.global_access_token;
        
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    const url = window.servidor + '/produto/aprovar/' + id_produto;

    fetch(url, requestOptions)
        .then(response => {
            console.log("aprovado");
            this.criarAlertaProdutoAprovado();
            this.preencherLista();
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
            <Text style={{fontWeight: "300", fontSize:25,alignSelf:"center"}}>Aprovar Produtos</Text>
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
                        data={this.state.produtosNaoAprovados}
                        renderItem={({ item, index, separators }) => (
                            <TouchableHighlight
                            key={item.id}
                            onPress={() => this.produtoPressionado(item)}
                            onShowUnderlay={separators.highlight}
                            onHideUnderlay={separators.unhighlight}>
                            <View style={{ backgroundColor: 'lightblue', padding: 10, marginVertical: 6, marginHorizontal: 14 }}>
                                <Text style={{fontSize: 16}}>{item.nome}</Text>
                                <Text style={{fontSize: 10, marginTop:5}}>{item.descricao}</Text>
                                <Image source =
                                  {{uri:item.fotoPrincipal.imagem}}
                                  style = {{ width: 300, height: 300, resizeMode: 'stretch', alignSelf:"center", marginTop: 5 }}
                                /> 
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

