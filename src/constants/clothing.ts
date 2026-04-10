export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export const CONDITIONS = [
  'Nuevo con etiqueta',
  'Como nuevo',
  'Buen estado',
  'Usado',
] as const;

export const CATEGORIES = [
  'Remeras',
  'Pantalones',
  'Vestidos',
  'Camperas',
  'Calzado',
  'Accesorios',
] as const;

export type Size = (typeof SIZES)[number];
export type Condition = (typeof CONDITIONS)[number];
export type Category = (typeof CATEGORIES)[number];

export type ClothingItem = {
  imageUri: string;
  title: string;
  size: Size;
  condition: Condition;
  category: Category;
  price: number;
  description?: string;
  acceptsTrade: boolean;
};

/**
 * Draft state used while the user is filling the form.
 * Most fields are partial/nullable because they are empty
 * until the user completes each step.
 */
export type ClothingDraft = {
  imageUri: string | null;
  title: string;
  size: Size | null;
  condition: Condition | null;
  category: Category | null;
  price: string; // stored as string to simplify numeric input
  description: string;
  acceptsTrade: boolean;
};

export const EMPTY_DRAFT: ClothingDraft = {
  imageUri: null,
  title: '',
  size: null,
  condition: null,
  category: null,
  price: '',
  description: '',
  acceptsTrade: false,
};
