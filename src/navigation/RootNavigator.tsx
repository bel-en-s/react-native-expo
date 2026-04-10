import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { Step1PhotoTitle } from '../screens/Step1PhotoTitle';
import { Step2Details } from '../screens/Step2Details';
import { Step3PriceDescription } from '../screens/Step3PriceDescription';
import { Step4Preview } from '../screens/Step4Preview';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: { fontWeight: '700' },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Step1"
        component={Step1PhotoTitle}
        options={{ title: 'Publicar prenda' }}
      />
      <Stack.Screen
        name="Step2"
        component={Step2Details}
        options={{ title: 'Detalles' }}
      />
      <Stack.Screen
        name="Step3"
        component={Step3PriceDescription}
        options={{ title: 'Precio' }}
      />
      <Stack.Screen
        name="Step4"
        component={Step4Preview}
        options={{ title: 'Confirmar' }}
      />
    </Stack.Navigator>
  );
}
