import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Usuario = {
  id: string;
  nome: string;
  email: string;
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const dados = await AsyncStorage.getItem('usuarios');
      if (dados) {
        const parsed: Usuario[] = JSON.parse(dados);
        setUsuarios(parsed);
      }
    } catch (error) {
      console.log('Erro ao carregar:', error);
    }
  };

  const salvarUsuarios = async (dados: Usuario[]) => {
    try {
      await AsyncStorage.setItem('usuarios', JSON.stringify(dados));
    } catch (error) {
      console.log('Erro ao salvar:', error);
    }
  };

  const adicionarUsuario = () => {
    if (!nome || !email) return;

    const novo: Usuario = {
      id: Date.now().toString(),
      nome,
      email,
    };

    const atualizados: Usuario[] = [...usuarios, novo];
    setUsuarios(atualizados);
    salvarUsuarios(atualizados);
    setModalVisible(false);
    setNome('');
    setEmail('');
  };

  const excluirUsuario = (id: string) => {
    Alert.alert('Confirmação', 'Deseja excluir este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          const atualizados = usuarios.filter((u) => u.id !== id);
          setUsuarios(atualizados);
          salvarUsuarios(atualizados);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Usuario }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity
  style={styles.botaoExcluir}
  onPress={() => excluirUsuario(item.id)}
  activeOpacity={0.7}
>
  <Text style={styles.iconeLixeira}>🗑️</Text>
</TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Nenhum usuário cadastrado.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.botaoFlutuante}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.botaoTexto}>＋</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Novo Usuário</Text>
            <TextInput
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.salvarBtn} onPress={adicionarUsuario}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ textAlign: 'center', marginTop: 10 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFF9F2' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#0000CD' },
  email: { color: '#555' },
 botaoExcluir: {
  backgroundColor: '#dc3545',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 6,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 10,
},
  botaoFlutuante: {
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
  botaoTexto: { fontSize: 24, color: 'white', fontWeight: 'bold' },
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
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  salvarBtn: {
    backgroundColor: '#0000CD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  iconeLixeira: {
  fontSize: 20,
  color: 'white',
},
});
