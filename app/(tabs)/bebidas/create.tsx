import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function CriarBebida() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  function salvarBebida() {
    if (!nome.trim() || !descricao.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    console.log('Bebida criada:', { nome, descricao });

    Alert.alert('Sucesso', 'Bebida criada com sucesso!');
    router.push('/bebidas');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Bebida</Text>

      <TextInput
        placeholder="Nome da bebida"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={salvarBebida}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F0FA', 
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: '#0000CD',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
  },
  cancelText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
