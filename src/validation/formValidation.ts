import { ClothingDraft } from '../constants/clothing';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 300;

export type ValidationResult = { valid: boolean; errors: Record<string, string> };

export function validateStep1(draft: ClothingDraft): ValidationResult {
  const errors: Record<string, string> = {};
  if (!draft.imageUri) errors.imageUri = 'Seleccioná una imagen';
  const title = draft.title.trim();
  if (!title) errors.title = 'Ingresá un título';
  else if (title.length > TITLE_MAX) errors.title = `Máximo ${TITLE_MAX} caracteres`;
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStep2(draft: ClothingDraft): ValidationResult {
  const errors: Record<string, string> = {};
  if (!draft.size) errors.size = 'Elegí una talla';
  if (!draft.condition) errors.condition = 'Elegí un estado';
  if (!draft.category) errors.category = 'Elegí una categoría';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStep3(draft: ClothingDraft): ValidationResult {
  const errors: Record<string, string> = {};
  const parsed = Number(draft.price);
  if (!draft.price.trim()) errors.price = 'Ingresá un precio';
  else if (Number.isNaN(parsed)) errors.price = 'Precio inválido';
  else if (parsed <= 0) errors.price = 'El precio debe ser mayor a 0';
  if (draft.description && draft.description.length > DESCRIPTION_MAX) {
    errors.description = `Máximo ${DESCRIPTION_MAX} caracteres`;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateAll(draft: ClothingDraft): ValidationResult {
  const s1 = validateStep1(draft);
  const s2 = validateStep2(draft);
  const s3 = validateStep3(draft);
  return {
    valid: s1.valid && s2.valid && s3.valid,
    errors: { ...s1.errors, ...s2.errors, ...s3.errors },
  };
}
