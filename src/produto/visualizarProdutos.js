import React, { Component } from 'react'
import { Button, Text, View } from 'react-native';
import { SafeAreaView, VirtualizedList, StyleSheet, StatusBar } from 'react-native';

//importacao de variaveis globais
import Globais from '../Globais.js';

export default class VisualizarProdutos extends Component {
  constructor(props) {
    super(props)
 
      state = {
        produtos: [],
      }
} 
  async getProdutos() {
    try {
      const url = window.servidor + '/produto/listar';
      const requestOptions = {
        method: 'GET'
      };
      const response = await fetch(url, requestOptions);
      const json = await response.json();
      this.setState({ produtos: json });
      console.log(json);
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
  }

  componentDidMount(){
    this.getProdutos()
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
            <Text style={{fontWeight: "300", fontSize:25,alignSelf:"center"}}>Visualizar Produtos</Text>
            </View>


            <SafeAreaView style={styles.container}>
              <VirtualizedList
                data={this.state.produtos}
                initialNumToRender={4}
                renderItem={({ item }) => <Item title={item.title} />}
                keyExtractor={item => item.key}
                getItemCount={getItemCount}
                getItem={getItem}
                onChange={(option) => this.setState({produtos: option.label})}
              />
            </SafeAreaView>
        </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 32,
  },
});
