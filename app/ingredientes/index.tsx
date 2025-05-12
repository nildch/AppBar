import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';


type Ingrediente = {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
};

export default function ListaIngredientes() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([
    { id: '1', nome: 'Limão', quantidade: 2, unidade: 'un' },
    { id: '2', nome: 'Morangos', quantidade: 100, unidade: 'g' },
    { id: '3', nome: 'Iogurte', quantidade: 200, unidade: 'ml' },
    { id: '4', nome: 'Café', quantidade: 50, unidade: 'ml' }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [novoIngrediente, setNovoIngrediente] = useState<Omit<Ingrediente, 'id'>>({ 
    nome: '', 
    quantidade: 0,
    unidade: 'g'
  });

  const adicionarIngrediente = () => {
    const novoItem = {
      ...novoIngrediente,
      id: (ingredientes.length + 1).toString()
    };
    setIngredientes([...ingredientes, novoItem]);
    setModalVisible(false);
    setNovoIngrediente({ nome: '', quantidade: 0, unidade: 'g' });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ingredientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} activeOpacity={1}>
          <View>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.detalhe}>{item.quantidade} {item.unidade}</Text>
          </View>
        </TouchableOpacity>        
        )}
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Adicionar Ingrediente</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Novo Ingrediente</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={novoIngrediente.nome}
            onChangeText={(text) => setNovoIngrediente({...novoIngrediente, nome: text})}
          />
          
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.quantidade]}
              placeholder="Quantidade"
              keyboardType="numeric"
              value={novoIngrediente.quantidade.toString()}
              onChangeText={(text) => setNovoIngrediente({
                ...novoIngrediente, 
                quantidade: Number(text) || 0
              })}
            />
            <TextInput
              style={[styles.input, styles.unidade]}
              placeholder="Unidade"
              value={novoIngrediente.unidade}
              onChangeText={(text) => setNovoIngrediente({
                ...novoIngrediente, 
                unidade: text
              })}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={adicionarIngrediente}
            >
              <Text style={{ color: '#fff' }}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#2196F3'
  },
  nome: { fontWeight: 'bold', fontSize: 16, color: '#0D47A1' },
  detalhe: { fontSize: 14, color: '#1565C0' },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    margin: 20,
    marginTop: 60
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 16,
    borderRadius: 4
  },
  row: { flexDirection: 'row' },
  quantidade: { flex: 0.7, marginRight: 8 },
  unidade: { flex: 0.3 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    flex: 0.48
  },
  cancelButton: { backgroundColor: '#f3f3f3' },
  saveButton: { backgroundColor: '#2196F3' }
});
