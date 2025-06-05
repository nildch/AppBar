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

type Bebida = {
  id: string;
  nome: string;
  descricao: string;
};

export default function ListaBebidas() {
  const [bebidas, setBebidas] = useState<Bebida[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Bebida | null>(null);
  const [form, setForm] = useState<Omit<Bebida, 'id'>>({ nome: '', descricao: '' });


  useEffect(() => {
    const carregarBebidas = async () => {
      try {
        const dados = await AsyncStorage.getItem('bebidas');
        if (dados) {
          setBebidas(JSON.parse(dados));
        }
      } catch (error) {
        console.log('Erro ao carregar bebidas:', error);
      }
    };
    carregarBebidas();
  }, []);

 
  const salvarLista = async (lista: Bebida[]) => {
    try {
      await AsyncStorage.setItem('bebidas', JSON.stringify(lista));
    } catch (error) {
      console.log('Erro ao salvar bebidas:', error);
    }
  };

  
  const abrirModal = (bebida?: Bebida) => {
    if (bebida) {
      setEditando(bebida);
      setForm({ nome: bebida.nome, descricao: bebida.descricao });
    } else {
      setEditando(null);
      setForm({ nome: '', descricao: '' });
    }
    setModalVisible(true);
  };

  
  const salvarBebida = async () => {
    if (!form.nome.trim() || !form.descricao.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    let novaLista: Bebida[];
    if (editando) {
      
      novaLista = bebidas.map(b =>
        b.id === editando.id ? { ...b, nome: form.nome, descricao: form.descricao } : b
      );
    } else {
      
      const nova: Bebida = {
        id: Date.now().toString(),
        nome: form.nome,
        descricao: form.descricao,
      };
      novaLista = [...bebidas, nova];
    }

    setBebidas(novaLista);
    await salvarLista(novaLista);
    setModalVisible(false);
  };

  
  const excluirBebida = async () => {
    if (editando) {
      Alert.alert('Excluir', 'Deseja excluir esta bebida?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const novaLista = bebidas.filter(b => b.id !== editando.id);
            setBebidas(novaLista);
            await salvarLista(novaLista);
            setModalVisible(false);
          },
        },
      ]);
    }
  };

  
  const renderItem = ({ item }: { item: Bebida }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => abrirModal(item)}
      activeOpacity={0.7}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.descricao}>{item.descricao}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bebidas}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Nenhuma bebida cadastrada.
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
              {editando ? 'Editar Bebida' : 'Nova Bebida'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={form.nome}
              onChangeText={nome => setForm({ ...form, nome })}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Descrição"
              value={form.descricao}
              onChangeText={descricao => setForm({ ...form, descricao })}
              multiline
            />

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
                  onPress={excluirBebida}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={salvarBebida}
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF9F2',
  },
  item: {
    padding: 16,
    backgroundColor: '#FFEFD5',
    marginBottom: 8,
    borderRadius: 8,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  descricao: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
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
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
