import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenContainer } from '../components/ScreenContainer';
import { Selector } from '../components/Selector';
import { Button } from '../components/Button';
import { useFormStore } from '../store/useFormStore';
import {
  CATEGORIES,
  CONDITIONS,
  Category,
  Condition,
  SIZES,
  Size,
} from '../constants/clothing';
import { validateStep2 } from '../validation/formValidation';
import { spacing } from '../theme/theme';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Step2'>;

export function Step2Details({ navigation }: Props) {
  const { theme: colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const draft = useFormStore((s) => s.draft);
  const setField = useFormStore((s) => s.setField);
  const [showErrors, setShowErrors] = useState(false);
  const { valid, errors } = validateStep2(draft);

  const onNext = () => {
    if (!valid) {
      setShowErrors(true);
      return;
    }
    navigation.navigate('Step3');
  };

  return (
    <ScreenContainer
      currentStep={2}
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
      <Text style={styles.title}>Detalles de la prenda</Text>
      <Text style={styles.subtitle}>
        Todos los campos son obligatorios.
      </Text>

      <Selector<Size>
        label="Talla"
        options={SIZES}
        value={draft.size}
        onChange={(v) => setField('size', v)}
        error={showErrors ? errors.size : undefined}
      />
      <Selector<Condition>
        label="Estado"
        options={CONDITIONS}
        value={draft.condition}
        onChange={(v) => setField('condition', v)}
        error={showErrors ? errors.condition : undefined}
      />
      <Selector<Category>
        label="Categoría"
        options={CATEGORIES}
        value={draft.category}
        onChange={(v) => setField('category', v)}
        error={showErrors ? errors.category : undefined}
      />
    </ScreenContainer>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
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
  footerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  footerBtn: {
    flex: 1,
  },
});
