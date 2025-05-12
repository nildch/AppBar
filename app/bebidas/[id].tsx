import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

const bebidasMock = [
  {
    id: '1',
    nome: 'Caipirinha',
    descricao: 'Clássico brasileiro com limão e cachaça',
    preparo: 'Amasse o limão com açúcar, adicione gelo e cachaça. Misture bem.'
  },
  {
    id: '2',
    nome: 'Smoothie de Morango',
    descricao: 'Refrescante e saudável',
    preparo: 'Bata morangos, iogurte e gelo no liquidificador até ficar homogêneo.'
  },
  {
    id: '3',
    nome: 'Café Gelado',
    descricao: 'Perfeito para os dias quentes',
    preparo: 'Prepare um café forte, adicione gelo, leite e açúcar a gosto.'
  },
];

export default function DetalhesBebida() {
  const { id } = useLocalSearchParams();
  const bebida = bebidasMock.find((b) => b.id === id);

  if (!bebida) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bebida não encontrada</Text>
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
  });
  