import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, FlatList , Button, Text, View, TouchableHighlight, Alert, Image } from 'react-native';
//importacao de variaveis globais
import Globais from '../Globais.js';

export default class MeusProdutos extends Component {
  constructor(props) {
    super(props)

    this.state = {
        produtos: [],
        isLoading: false         
    }
 }


  async preencherLista () {
    try {
      this.setState({ isLoading: true });
      const url = window.servidor + '/produto/listar/fornecedor/' + Globais.global_fornecedor_id
      const response = await fetch(url);
      const json = await response.json();
      if(Array.isArray(json)){
        this.setState({ produtos: json });
      }
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }

  componentDidMount() {
      this.preencherLista();
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
        <View style={{width: "90%", alignSelf: "center"}}>
          <View style={{height:"10%", justifyContent: "center"}}>
          <Text style={{fontWeight: "300", fontSize:25,alignSelf:"center"}}>Macaé Classifica</Text>            
            <Text style={{fontWeight: "300", fontSize:25,alignSelf:"center"}}>Meus Produtos</Text>
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
                        data={this.state.produtos}
                        renderItem={({ item, index, separators }) => (
                            <TouchableHighlight
                            key={item.id}
                            onShowUnderlay={separators.highlight}
                            onHideUnderlay={separators.unhighlight}>
                            <View style={{ backgroundColor: 'lightblue', padding: 10, marginVertical: 6, marginHorizontal: 14 }}>
                                <Text style={{fontSize: 20}}>{item.nome}</Text>
                                <Text style={{fontSize: 13, marginTop: 5}}>{item.descricao}</Text>
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
