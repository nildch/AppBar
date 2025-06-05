import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Ingrediente = {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
};

export default function ListaIngredientes() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Ingrediente | null>(null);
  const [form, setForm] = useState<Omit<Ingrediente, 'id'>>({
    nome: '',
    quantidade: 0,
    unidade: 'g',
  });


  useEffect(() => {
    const carregarIngredientes = async () => {
      try {
        const dados = await AsyncStorage.getItem('ingredientes');
        if (dados) {
          setIngredientes(JSON.parse(dados));
        }
      } catch (error) {
        console.log('Erro ao carregar ingredientes:', error);
      }
    };
    carregarIngredientes();
  }, []);

  
  const salvarLista = async (lista: Ingrediente[]) => {
    try {
      await AsyncStorage.setItem('ingredientes', JSON.stringify(lista));
    } catch (error) {
      console.log('Erro ao salvar ingredientes:', error);
    }
  };

  
  const abrirModal = (item?: Ingrediente) => {
    if (item) {
      setEditando(item);
      setForm({
        nome: item.nome,
        quantidade: item.quantidade,
        unidade: item.unidade,
      });
    } else {
      setEditando(null);
      setForm({ nome: '', quantidade: 0, unidade: 'g' });
    }
    setModalVisible(true);
  };


  const salvarIngrediente = async () => {
    if (!form.nome.trim() || form.quantidade <= 0 || !form.unidade.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente.');
      return;
    }

    let novaLista: Ingrediente[];
    if (editando) {
      novaLista = ingredientes.map(i =>
        i.id === editando.id
          ? { ...i, nome: form.nome, quantidade: form.quantidade, unidade: form.unidade }
          : i
      );
    } else {
      const novo: Ingrediente = {
        id: Date.now().toString(),
        nome: form.nome,
        quantidade: form.quantidade,
        unidade: form.unidade,
      };
      novaLista = [...ingredientes, novo];
    }

    setIngredientes(novaLista);
    await salvarLista(novaLista);
    setModalVisible(false);
  };

  
  const excluirIngrediente = async () => {
    if (editando) {
      Alert.alert('Excluir', 'Deseja realmente excluir este ingrediente?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const novaLista = ingredientes.filter(i => i.id !== editando.id);
            setIngredientes(novaLista);
            await salvarLista(novaLista);
            setModalVisible(false);
          },
        },
      ]);
    }
  };

  
  const renderItem = ({ item }: { item: Ingrediente }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => abrirModal(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.detalhe}>
        {item.quantidade} {item.unidade}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={ingredientes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Nenhum ingrediente cadastrado.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => abrirModal()}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editando ? 'Editar Ingrediente' : 'Novo Ingrediente'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={form.nome}
              onChangeText={nome => setForm({ ...form, nome })}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.quantidade]}
                placeholder="Qtd"
                keyboardType="numeric"
                value={form.quantidade.toString()}
                onChangeText={text => setForm({ ...form, quantidade: Number(text) || 0 })}
              />
              <TextInput
                style={[styles.input, styles.unidade]}
                placeholder="Un"
                value={form.unidade}
                onChangeText={unidade => setForm({ ...form, unidade })}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              {editando && (
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={excluirIngrediente}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Excluir</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={salvarIngrediente}
                activeOpacity={0.7}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF9F2' },
  item: { padding: 16, backgroundColor: '#E3F2FD', marginBottom: 8, borderRadius: 8 },
  nome: { fontWeight: 'bold', fontSize: 16 },
  detalhe: { fontSize: 14, marginTop: 4 },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#0000CD',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: { fontSize: 24, color: 'white', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  input: { backgroundColor: '#f1f1f1', padding: 10, borderRadius: 6, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  quantidade: { flex: 0.6 },
  unidade: { flex: 0.35 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 10 },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#ccc' },
  deleteButton: { backgroundColor: '#dc3545' },
  cancelButtonText: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#28a745' },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});
