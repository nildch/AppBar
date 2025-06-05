import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Bebida = {
  id: string;
  nome: string;
  descricao: string;
  preparo: string;
};

export default function DetalhesBebida() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [bebida, setBebida] = useState<Bebida | null>(null);

  
  useEffect(() => {
    const carregarBebida = async () => {
      try {
        const dados = await AsyncStorage.getItem('bebidas');
        if (dados) {
          const lista: Bebida[] = JSON.parse(dados);
          const item = lista.find(b => b.id === id);
          if (item) {
            setBebida(item);
          }
        }
      } catch (error) {
        console.log('Erro ao carregar bebida:', error);
      }
    };
    carregarBebida();
  }, [id]);

  
  const excluirBebida = async () => {
    if (!bebida) return;

    Alert.alert('Excluir', 'Deseja excluir esta bebida?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const dados = await AsyncStorage.getItem('bebidas');
            if (dados) {
              const lista: Bebida[] = JSON.parse(dados);
              const novaLista = lista.filter(b => b.id !== bebida.id);
              await AsyncStorage.setItem('bebidas', JSON.stringify(novaLista));
              router.replace('/(tabs)/bebidas');
            }
          } catch (error) {
            console.log('Erro ao excluir bebida:', error);
          }
        },
      },
    ]);
  };

  if (!bebida) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.nome}>{bebida.nome}</Text>
        <View style={styles.divisor} />
        <Text style={styles.label}>Descrição</Text>
        <Text style={styles.text}>{bebida.descricao}</Text>
        <Text style={styles.label}>Modo de Preparo</Text>
        <Text style={styles.text}>{bebida.preparo}</Text>

        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={excluirBebida}
          activeOpacity={0.7}
        >
          <Text style={styles.textoBotao}>Excluir Bebida</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F2',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  nome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0000CD',
    textAlign: 'center',
    marginBottom: 16,
  },
  divisor: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 12,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
    lineHeight: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
  botaoExcluir: {
    marginTop: 24,
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
