import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { Toggle } from '../components/Toggle';
import { useFormStore } from '../store/useFormStore';
import {
  DESCRIPTION_MAX,
  validateStep3,
} from '../validation/formValidation';
import { colors, spacing } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Step3'>;

export function Step3PriceDescription({ navigation }: Props) {
  const draft = useFormStore((s) => s.draft);
  const setField = useFormStore((s) => s.setField);
  const [showErrors, setShowErrors] = useState(false);
  const { valid, errors } = validateStep3(draft);

  const onNext = () => {
    if (!valid) {
      setShowErrors(true);
      return;
    }
    navigation.navigate('Step4');
  };

  return (
    <ScreenContainer
      currentStep={3}
      footer={
        <View style={styles.footerRow}>
          <Button
            title="Atrás"
            variant="secondary"
            onPress={() => navigation.goBack()}
            style={styles.footerBtn}
          />
          <Button title="Siguiente" onPress={onNext} style={styles.footerBtn} />
        </View>
      }
    >
      <Text style={styles.title}>Precio y descripción</Text>
      <Text style={styles.subtitle}>
        Definí cuánto vale y contá los detalles.
      </Text>

      <TextField
        label="Precio (ARS)"
        placeholder="0"
        keyboardType="numeric"
        value={draft.price}
        onChangeText={(t) => setField('price', t.replace(/[^0-9.]/g, ''))}
        error={showErrors ? errors.price : undefined}
      />
      <TextField
        label="Descripción (opcional)"
        placeholder="Detalles, medidas, material…"
        multiline
        numberOfLines={4}
        value={draft.description}
        onChangeText={(t) => setField('description', t.slice(0, DESCRIPTION_MAX))}
        maxLength={DESCRIPTION_MAX}
        counter={{ current: draft.description.length, max: DESCRIPTION_MAX }}
        style={styles.textarea}
        error={showErrors ? errors.description : undefined}
      />
      <Toggle
        label="Acepto intercambio"
        description="Permitir que otros usuarios propongan un intercambio."
        value={draft.acceptsTrade}
        onChange={(v) => setField('acceptsTrade', v)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  textarea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  footerBtn: {
    flex: 1,
  },
});
