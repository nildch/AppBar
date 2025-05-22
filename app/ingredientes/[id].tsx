import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';

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
    const dados = localStorage.getItem('ingredientes');
    if (dados) {
      const lista = JSON.parse(dados) as Ingrediente[];
      const item = lista.find(i => i.id === id);
      if (item) setIngrediente(item);
    }
  }, [id]);

  const excluirIngrediente = () => {
    Alert.alert('Excluir', 'Deseja realmente excluir este ingrediente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          const dados = localStorage.getItem('ingredientes');
          if (dados) {
            const lista = JSON.parse(dados) as Ingrediente[];
            const novaLista = lista.filter(i => i.id !== id);
            localStorage.setItem('ingredientes', JSON.stringify(novaLista));
            router.replace('/ingredientes'); 
          }
        },
      },
    ]);
  };

  const editarIngrediente = () => {
    Alert.alert('Editar', 'Função de editar ainda não implementada.');
  };

  if (!ingrediente) return <Text style={{ padding: 20 }}>Carregando...</Text>;

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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  detalhe: { fontSize: 16, marginBottom: 20 },
  botoes: { flexDirection: 'row', justifyContent: 'space-between' },
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
  textoBotao: { color: '#fff', fontWeight: 'bold' },
});
