import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { useFormStore } from '../store/useFormStore';
import { radius, spacing } from '../theme/theme';
import { useTheme } from '../context/ThemeContext';
import { validateAll } from '../validation/formValidation';

type Props = NativeStackScreenProps<RootStackParamList, 'Step4'>;

function formatPrice(value: string): string {
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(num);
}

export function Step4Preview({ navigation }: Props) {
  const { theme: colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const draft = useFormStore((s) => s.draft);
  const reset = useFormStore((s) => s.reset);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const { valid } = validateAll(draft);

  const goToStep = (step: 'Step1' | 'Step2' | 'Step3') => {
    navigation.navigate(step);
  };

  const onEdit = () => {
    const options = ['Foto y título', 'Detalles', 'Precio y descripción', 'Cancelar'];
    const screens: Array<'Step1' | 'Step2' | 'Step3'> = ['Step1', 'Step2', 'Step3'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: '¿Qué querés editar?',
          options,
          cancelButtonIndex: 3,
        },
        (index) => {
          if (index < 3) goToStep(screens[index]);
        },
      );
    } else {
      Alert.alert('¿Qué querés editar?', undefined, [
        { text: options[0], onPress: () => goToStep('Step1') },
        { text: options[1], onPress: () => goToStep('Step2') },
        { text: options[2], onPress: () => goToStep('Step3') },
        { text: 'Cancelar', style: 'cancel' },
      ]);
    }
  };

  const onPublish = async () => {
    if (!valid) {
      Alert.alert('Faltan datos', 'Revisá los pasos anteriores.');
      return;
    }
    setPublishing(true);
    // Simulate a backend call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setPublishing(false);
    setPublished(true);
  };

  const onPublishAnother = () => {
    reset();
    setPublished(false);
    navigation.popToTop();
  };

  if (published) {
    return (
      <ScreenContainer
        currentStep={4}
        footer={<Button title="Publicar otra prenda" onPress={onPublishAnother} />}
      >
        <View style={styles.successWrap}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>¡Publicado!</Text>
          <Text style={styles.successText}>
            Tu prenda ya está disponible para que la vean otras personas.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      currentStep={4}
      footer={
        <View style={styles.footerRow}>
          <Button
            title="Editar"
            variant="secondary"
            onPress={onEdit}
            style={styles.footerBtn}
            disabled={publishing}
          />
          <Button
            title="Publicar"
            onPress={onPublish}
            loading={publishing}
            style={styles.footerBtn}
          />
        </View>
      }
    >
      <Text style={styles.title}>Revisá tu publicación</Text>
      <Text style={styles.subtitle}>
        Confirmá que todo esté correcto antes de publicar.
      </Text>

      <View style={styles.card}>
        <Pressable onPress={() => goToStep('Step1')}>
          {draft.imageUri && (
            <Image source={{ uri: draft.imageUri }} style={styles.image} />
          )}
        </Pressable>
        <View style={styles.cardBody}>
          <Pressable onPress={() => goToStep('Step1')} style={styles.editable}>
            <Text style={styles.itemTitle}>{draft.title}</Text>
          </Pressable>

          <Pressable onPress={() => goToStep('Step3')} style={styles.editable}>
            <Text style={styles.price}>{formatPrice(draft.price)}</Text>
          </Pressable>

          <Pressable
            onPress={() => goToStep('Step2')}
            style={[styles.editable, styles.tagRow]}
          >
            {draft.category && <Tag text={draft.category} />}
            {draft.size && <Tag text={`Talle ${draft.size}`} />}
            {draft.condition && <Tag text={draft.condition} />}
          </Pressable>

          {draft.description ? (
            <Pressable onPress={() => goToStep('Step3')} style={styles.editable}>
              <Text style={styles.sectionLabel}>Descripción</Text>
              <Text style={styles.description}>{draft.description}</Text>
            </Pressable>
          ) : null}

          <View style={styles.divider} />
          <Pressable onPress={() => goToStep('Step3')} style={styles.metaRow}>
            <Text style={styles.metaLabel}>Acepta intercambio</Text>
            <Text style={styles.metaValue}>
              {draft.acceptsTrade ? 'Sí' : 'No'}
            </Text>
          </Pressable>
          <Text style={styles.hint}>
            Tocá cualquier sección o el botón "Editar" para modificarla.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

function Tag({ text }: { text: string }) {
  const { theme: colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
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
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
  },
  cardBody: {
    padding: spacing.md,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionLabel: {
    marginTop: spacing.md,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editable: {
    marginTop: spacing.xs,
  },
  hint: {
    marginTop: spacing.md,
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  metaValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  footerBtn: {
    flex: 1,
  },
  successWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  successIcon: {
    fontSize: 64,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  successText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
});
