import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';

type Bebida = {
  id: string;
  nome: string;
  descricao: string;
};

export default function ListaBebidas() {
  const [bebidas, setBebidas] = useState<Bebida[]>([
  { id: '1', nome: 'Caipirinha', descricao: 'Limão, açúcar e cachaça' },
  { id: '2', nome: 'Mojito', descricao: 'Hortelã, rum e água com gás' },
  { id: '3', nome: 'Piña Colada', descricao: 'Abacaxi, leite de coco e rum' },
  { id: '4', nome: 'Bloody Mary', descricao: 'Suco de tomate, vodka e especiarias' },
  { id: '5', nome: 'Sex on the Beach', descricao: 'Vodka, licor de pêssego e sucos' },
  { id: '6', nome: 'Tequila Sunrise', descricao: 'Tequila, suco de laranja e grenadine' },
  { id: '7', nome: 'Cuba Libre', descricao: 'Rum, cola e limão' },
  { id: '8', nome: 'Gin Tônica', descricao: 'Gin, água tônica e limão' }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Bebida | null>(null);
  const [form, setForm] = useState<Omit<Bebida, 'id'>>({ nome: '', descricao: '' });

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

  const salvarBebida = () => {
    if (editando) {
      setBebidas(bebidas.map(b => b.id === editando.id ? { ...editando, ...form } : b));
    } else {
      const nova = { ...form, id: Date.now().toString() };
      setBebidas([...bebidas, nova]);
    }
    setModalVisible(false);
  };

  const excluirBebida = () => {
    if (editando) {
      Alert.alert("Excluir", "Deseja excluir esta bebida?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir", style: "destructive", onPress: () => {
            setBebidas(bebidas.filter(b => b.id !== editando.id));
            setModalVisible(false);
          }
        }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bebidas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => abrirModal(item)}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.descricao}>{item.descricao}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => abrirModal()}>
        <Text style={styles.addButtonText}>Adicionar Bebida</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editando ? 'Editar' : 'Nova'} Bebida</Text>
          <TextInput style={styles.input} placeholder="Nome" value={form.nome} onChangeText={nome => setForm({ ...form, nome })} />
          <TextInput style={styles.input} placeholder="Descrição" value={form.descricao} onChangeText={descricao => setForm({ ...form, descricao })} multiline />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            {editando && (
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={excluirBebida}>
                <Text style={styles.cancelButtonText}>Excluir</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={salvarBebida}>
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
  item: { padding: 16, backgroundColor: '#FFEFD5', marginBottom: 8, borderRadius: 8 },
  nome: { fontWeight: 'bold', fontSize: 16 },
  descricao: { fontSize: 14, color: '#333' },
  addButton: { backgroundColor: '#0000CD', padding: 16, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 12, borderRadius: 8 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#ccc' },
  deleteButton: { backgroundColor: '#dc3545' },
  cancelButtonText: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#28a745' },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});
