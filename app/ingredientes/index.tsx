import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';

type Ingrediente = {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
};

export default function ListaIngredientes() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([
  { id: '1', nome: 'Vodka', quantidade: 500, unidade: 'ml' },
  { id: '2', nome: 'Limão', quantidade: 5, unidade: 'un' },
  { id: '3', nome: 'Gelo', quantidade: 1, unidade: 'kg' },
  { id: '4', nome: 'Hortelã', quantidade: 50, unidade: 'g' },
  { id: '5', nome: 'Cachaça', quantidade: 750, unidade: 'ml' },
  { id: '6', nome: 'Xarope de açúcar', quantidade: 200, unidade: 'ml' },
  { id: '7', nome: 'Rum branco', quantidade: 500, unidade: 'ml' },
  { id: '8', nome: 'Água com gás', quantidade: 1, unidade: 'L' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Ingrediente | null>(null);
  const [form, setForm] = useState<Omit<Ingrediente, 'id'>>({ nome: '', quantidade: 0, unidade: 'g' });

  const abrirModal = (ingrediente?: Ingrediente) => {
    if (ingrediente) {
      setEditando(ingrediente);
      setForm({ nome: ingrediente.nome, quantidade: ingrediente.quantidade, unidade: ingrediente.unidade });
    } else {
      setEditando(null);
      setForm({ nome: '', quantidade: 0, unidade: 'g' });
    }
    setModalVisible(true);
  };

  const salvarIngrediente = () => {
    if (editando) {
      setIngredientes(ingredientes.map(i => i.id === editando.id ? { ...editando, ...form } : i));
    } else {
      const novo = { ...form, id: Date.now().toString() };
      setIngredientes([...ingredientes, novo]);
    }
    setModalVisible(false);
  };

  const excluirIngrediente = () => {
    if (editando) {
      Alert.alert("Excluir", "Deseja excluir este ingrediente?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir", style: "destructive", onPress: () => {
            setIngredientes(ingredientes.filter(i => i.id !== editando.id));
            setModalVisible(false);
          }
        }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ingredientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => abrirModal(item)}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.detalhe}>{item.quantidade} {item.unidade}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => abrirModal()}>
        <Text style={styles.addButtonText}>Adicionar Ingrediente</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editando ? 'Editar' : 'Novo'} Ingrediente</Text>
          <TextInput style={styles.input} placeholder="Nome" value={form.nome} onChangeText={nome => setForm({ ...form, nome })} />
          <View style={styles.row}>
            <TextInput style={[styles.input, styles.quantidade]} placeholder="Qtd" keyboardType="numeric" value={form.quantidade.toString()} onChangeText={text => setForm({ ...form, quantidade: Number(text) || 0 })} />
            <TextInput style={[styles.input, styles.unidade]} placeholder="Un" value={form.unidade} onChangeText={unidade => setForm({ ...form, unidade })} />
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            {editando && (
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={excluirIngrediente}>
                <Text style={styles.cancelButtonText}>Excluir</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={salvarIngrediente}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 16, backgroundColor: '#E3F2FD', marginBottom: 8, borderRadius: 8 },
  nome: { fontWeight: 'bold', fontSize: 16 },
  detalhe: { fontSize: 14 },
  addButton: { backgroundColor: '#0000CD', padding: 16, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 12, borderRadius: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  quantidade: { flex: 0.6 },
  unidade: { flex: 0.35 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#ccc' },
  deleteButton: { backgroundColor: '#dc3545' },
  cancelButtonText: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#28a745' },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});
