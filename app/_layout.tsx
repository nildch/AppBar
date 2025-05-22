import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#FFF9F2' }, 
        }}
      >
        
        <Stack.Screen 
          name="index" 
          options={{
            animationTypeForReplace: 'push', 
          }}
        />

        
        <Stack.Screen 
          name="ingredientes/index"
          options={{ 
            title: 'Ingredientes',
            gestureEnabled: true 
          }} 
        />
        <Stack.Screen 
          name="ingredientes/[id]"
          options={{ 
            title: 'Detalhes',
            presentation: 'modal'
          }} 
        />

        
        <Stack.Screen 
          name="bebidas/index" 
          options={{
            title: 'Bebidas',
            gestureDirection: 'horizontal' 
          }} 
        />
        <Stack.Screen 
          name="bebidas/[id]" 
          options={{ 
            title: 'Detalhes da Bebida',
            animation: 'slide_from_right' 
          }} 
        />
        <Stack.Screen 
          name="bebidas/create" 
          options={{ 
            title: 'Nova Bebida',
            presentation: 'formSheet' 
          }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
}