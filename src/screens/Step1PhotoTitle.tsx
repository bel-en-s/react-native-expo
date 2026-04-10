import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { useFormStore } from '../store/useFormStore';
import { radius, spacing } from '../theme/theme';
import { useTheme } from '../context/ThemeContext';
import { TITLE_MAX, validateStep1 } from '../validation/formValidation';

type Props = NativeStackScreenProps<RootStackParamList, 'Step1'>;

export function Step1PhotoTitle({ navigation }: Props) {
  const { theme: colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const draft = useFormStore((s) => s.draft);
  const setField = useFormStore((s) => s.setField);
  const [showErrors, setShowErrors] = useState(false);

  const { errors, valid } = validateStep1(draft);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a tu galería para seleccionar una imagen.',
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setField('imageUri', result.assets[0].uri);
    }
  };

  const onNext = () => {
    if (!valid) {
      setShowErrors(true);
      return;
    }
    navigation.navigate('Step2');
  };

  return (
    <ScreenContainer
      currentStep={1}
      footer={
        <Button
          title="Siguiente"
          onPress={onNext}
          disabled={!valid && showErrors}
        />
      }
    >
      <Text style={styles.title}>Mostrá tu prenda</Text>
      <Text style={styles.subtitle}>
        Subí una foto clara y elegí un título descriptivo.
      </Text>

      <Pressable onPress={pickImage} style={styles.imagePicker}>
        {draft.imageUri ? (
          <Image source={{ uri: draft.imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>Tocá para elegir una foto</Text>
          </View>
        )}
      </Pressable>
      {showErrors && errors.imageUri ? (
        <Text style={styles.error}>{errors.imageUri}</Text>
      ) : null}

      <View style={{ height: spacing.lg }} />

      <TextField
        label="Título"
        placeholder="Ej: Campera de jean oversized"
        value={draft.title}
        onChangeText={(text) => setField('title', text.slice(0, TITLE_MAX))}
        maxLength={TITLE_MAX}
        counter={{ current: draft.title.length, max: TITLE_MAX }}
        error={showErrors ? errors.title : undefined}
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
  imagePicker: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
