import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/icon.png')} 
        style={styles.banner}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>🍹 Bem-vindo ao BarApp</Text>
        <Text style={styles.subtitle}>Gerencie suas bebidas e ingredientes</Text>

        <View style={styles.buttonContainer}>
          <Link href="/bebidas" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Cardápio de Bebidas</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/ingredientes" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Nossos Ingredientes</Text>
            </TouchableOpacity>
          </Link>
        </View>
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
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
