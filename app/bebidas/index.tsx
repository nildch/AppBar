import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function BebidasPage() {
  const [bebidas, setBebidas] = useState([
    { id: '1', nome: 'Caipirinha', descricao: 'Clássico brasileiro com limão e cachaça' },
    { id: '2', nome: 'Smoothie de Morango', descricao: 'Refrescante e saudável' },
    { id: '3', nome: 'Café Gelado', descricao: 'Perfeito para os dias quentes' }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  function adicionarBebida() {
    if (nome.trim() && descricao.trim()) {
      const nova = {
        id: Date.now().toString(),
        nome,
        descricao
      };
      setBebidas([...bebidas, nova]);
      setNome('');
      setDescricao('');
      setModalVisible(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Minhas Bebidas</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={bebidas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/bebidas/${item.id}`} asChild>
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemTitle}>{item.nome}</Text>
              <Text style={styles.itemDesc}>{item.descricao}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nova Bebida</Text>
            <TextInput
              placeholder="Nome da bebida"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              placeholder="Descrição"
              style={[styles.input, { height: 80 }]}
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={adicionarBebida}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F0FA', 
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0000CD',
  },
  addButton: {
    backgroundColor: '#0000CD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0000CD',
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 2, 2, 0.5)',
  },
  modalContainer: {
    margin: 50,
    backgroundColor: '#E6F0FA', 
    borderRadius: 12,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0000CD',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
