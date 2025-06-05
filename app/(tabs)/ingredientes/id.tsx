import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Ingrediente = {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
};

export default function DetalheIngrediente() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [ingrediente, setIngrediente] = useState<Ingrediente | null>(null);


  useEffect(() => {
    const carregarIngrediente = async () => {
      try {
        const dados = await AsyncStorage.getItem('ingredientes');
        if (dados) {
          const lista: Ingrediente[] = JSON.parse(dados);
          const item = lista.find(i => i.id === id);
          if (item) setIngrediente(item);
        }
      } catch (error) {
        console.log('Erro ao carregar ingrediente:', error);
      }
    };
    carregarIngrediente();
  }, [id]);

  
  const excluirIngrediente = () => {
    if (!ingrediente) return;

    Alert.alert('Excluir', 'Deseja realmente excluir este ingrediente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const dados = await AsyncStorage.getItem('ingredientes');
            if (dados) {
              const lista: Ingrediente[] = JSON.parse(dados);
              const novaLista = lista.filter(i => i.id !== ingrediente.id);
              await AsyncStorage.setItem('ingredientes', JSON.stringify(novaLista));
              
              router.replace('/(tabs)/ingredientes');
            }
          } catch (error) {
            console.log('Erro ao excluir ingrediente:', error);
          }
        },
      },
    ]);
  };

  const editarIngrediente = () => {
    Alert.alert('Editar', 'Função de editar ainda não implementada.');
  };

  if (!ingrediente) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{ingrediente.nome}</Text>
      <Text style={styles.detalhe}>
        Quantidade: {ingrediente.quantidade} {ingrediente.unidade}
      </Text>

      <View style={styles.botoes}>
        <TouchableOpacity style={styles.botaoEditar} onPress={editarIngrediente}>
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoExcluir} onPress={excluirIngrediente}>
          <Text style={styles.textoBotao}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF9F2',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0000CD',
    textAlign: 'center',
  },
  detalhe: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoEditar: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  botaoExcluir: {
    backgroundColor: '#FF5252',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
