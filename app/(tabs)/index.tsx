import * as Location from 'expo-location';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Index() {
  const [localizacao, setLocalizacao] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [carregando, setCarregando] = useState(false);

  const pegarLocalizacao = async () => {
    setCarregando(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Permissão para acessar localização foi negada.'
        );
        setCarregando(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocalizacao({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch (error) {
      console.log('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter localização.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/icon.jpg')}
        style={styles.banner}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>🍹 Bem-vindo ao BarApp</Text>
        <Text style={styles.subtitle}>
          Gerencie suas bebidas e ingredientes
        </Text>

        <View style={styles.buttonContainer}>
          <Link href="../bebidas" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Cardápio de Bebidas</Text>
            </TouchableOpacity>
          </Link>

          <Link href="../ingredientes" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Nossos Ingredientes</Text>
            </TouchableOpacity>
          </Link>

          <Link href="../usuarios" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Usuários</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={[styles.button, styles.gpsButton]}
            onPress={pegarLocalizacao}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Pegar Localização</Text>
          </TouchableOpacity>
        </View>

        {carregando && (
          <ActivityIndicator
            size="large"
            color="#0000CD"
            style={{ marginTop: 20 }}
          />
        )}

        {localizacao && (
          <View style={styles.info}>
            <Text style={styles.infoText}>
              Latitude: {localizacao.latitude.toFixed(6)}
            </Text>
            <Text style={styles.infoText}>
              Longitude: {localizacao.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F2' },
  banner: { width: '100%', height: 250 },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0000CD',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  buttonContainer: { width: '100%', alignItems: 'center' },
  button: {
    width: '100%',
    backgroundColor: '#0000CD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  gpsButton: {
    backgroundColor: '#0000CD',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  info: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
});
