import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ClothingDraft, EMPTY_DRAFT } from '../constants/clothing';

type FormState = {
  draft: ClothingDraft;
  setField: <K extends keyof ClothingDraft>(key: K, value: ClothingDraft[K]) => void;
  setMany: (partial: Partial<ClothingDraft>) => void;
  reset: () => void;
};

/**
 * Zustand store with AsyncStorage persistence so the draft survives
 * app restarts. Persistence is a bonus requirement; it's opt-in via
 * the `persist` middleware and degrades gracefully on web.
 */
export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      draft: EMPTY_DRAFT,
      setField: (key, value) =>
        set((state) => ({ draft: { ...state.draft, [key]: value } })),
      setMany: (partial) =>
        set((state) => ({ draft: { ...state.draft, ...partial } })),
      reset: () => set({ draft: EMPTY_DRAFT }),
    }),
    {
      name: 'clothing-draft-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
