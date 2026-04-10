# Publicá tu prenda en 4 pasos

Challenge técnico React Native + Expo. Flujo de publicación de una prenda en 4 pasos con validación, estado compartido y preview final.

## Stack

- **Expo SDK 54** + **React Native**
- **TypeScript** end-to-end
- **React Navigation** (native-stack) para el flujo entre pasos
- **Zustand** + `zustand/middleware/persist` + AsyncStorage para el estado del formulario
- **expo-image-picker** para seleccionar imágenes de la galería

## Correr el proyecto

### Requisitos previos
- **Node.js 18+** y **npm**
- Alguna de estas opciones para ver la app:
  - **Expo Go** en tu celular (iOS App Store / Play Store) — recomendado
  - **Simulador de iOS** (requiere Xcode instalado en Mac)
  - **Emulador de Android** (Android Studio)

### Instalación

```bash
npm install
npx expo start
```

### Cómo ver la app

Cuando Metro termine de arrancar vas a ver un QR y un menú de atajos. Elegí una opción:

**Opción A — Celular con Expo Go (la más simple)**
1. Asegurate de que tu celu y tu compu estén en la **misma red WiFi**.
2. Si el QR apunta a `127.0.0.1`, matá el proceso (Ctrl+C) y reiniciá con:
   ```bash
   npx expo start --lan
   ```
3. Escaneá el QR:
   - **iOS**: con la cámara nativa del iPhone → tocar el banner "Abrir en Expo Go".
   - **Android**: desde la app Expo Go → "Scan QR code".

**Opción B — Simulador iOS** (requiere Xcode)
En la terminal de Expo, apretá la tecla **`i`**.

**Opción C — Emulador Android** (requiere Android Studio)
En la terminal de Expo, apretá la tecla **`a`**.

**Opción D — Web**
En la terminal de Expo, apretá **`w`**. La app fue pensada para móvil, así que algunas interacciones (como el image picker nativo) se comportan distinto en browser.

### Notas
- En iOS el selector de imagen pide permiso de galería la primera vez. El plugin de `expo-image-picker` ya está configurado en `app.json`.
- Si aparecen errores raros después de cambiar dependencias, reiniciá con cache limpio: `npx expo start --clear`.

## Estructura del proyecto

```
src/
├── constants/clothing.ts        # SIZES, CONDITIONS, CATEGORIES, ClothingItem, ClothingDraft
├── validation/
│   ├── formValidation.ts        # validateStep1/2/3 + validateAll
│   └── formValidation.test.ts   # tests unitarios de validación
├── store/useFormStore.ts        # Zustand store con persistencia AsyncStorage
├── theme/theme.ts               # colors, spacing, radius
├── components/
│   ├── Button.tsx
│   ├── TextField.tsx
│   ├── Selector.tsx             # selector tipo chips (genérico en T)
│   ├── Toggle.tsx
│   ├── StepIndicator.tsx        # indicador visual de progreso 1..4
│   └── ScreenContainer.tsx      # layout común: SafeArea + header + scroll + footer
├── navigation/
│   ├── types.ts                 # RootStackParamList tipado
│   └── RootNavigator.tsx
└── screens/
    ├── Step1PhotoTitle.tsx
    ├── Step2Details.tsx
    ├── Step3PriceDescription.tsx
    └── Step4Preview.tsx
App.tsx                          # NavigationContainer + SafeAreaProvider
```

## Decisiones técnicas

### ¿Por qué Zustand?
El formulario es global y se comparte entre 4 pantallas, pero no es lo suficientemente complejo como para justificar Redux. Context API funciona, pero re-renderiza todo el árbol cuando cambia el valor a menos que se divida manualmente en varios contextos. Zustand da:

- **Boilerplate mínimo** — un solo hook (`useFormStore`) expuesto globalmente.
- **Selectores finos** — cada pantalla se suscribe sólo al slice que usa (`s => s.draft`, `s => s.setField`), evitando re-renders innecesarios.
- **Persistencia gratis** — el middleware `persist` con `AsyncStorage` cubre el bonus de guardar el borrador entre sesiones sin código adicional.

### Validación
Encapsulé las validaciones en `src/validation/formValidation.ts` como funciones puras que reciben el `ClothingDraft` y devuelven `{ valid, errors }`. Ventajas:

- Se pueden testear en aislamiento (ver `formValidation.test.ts`).
- Las pantallas sólo consumen el resultado — cero duplicación de reglas.
- Cada pantalla decide *cuándo* mostrar errores: mientras el usuario no apriete "Siguiente", no se marca nada; al intentar avanzar se habilita `showErrors` y los mensajes aparecen inline.

### Tipado
`ClothingItem` es el modelo "final" (tal como sale en el PDF). Agregué `ClothingDraft` como su contraparte *mientras el form se está llenando* — con campos nullable y `price: string` para simplificar el input numérico. La conversión a `ClothingItem` sólo sucedería al momento de enviar al backend.

### Componentes reutilizables
- `Selector<T>` es genérico: se usa para talla, estado y categoría sin duplicar UI.
- `TextField` soporta contador de caracteres, error y helper text.
- `ScreenContainer` centraliza SafeArea, KeyboardAvoiding, scroll y footer pegajoso para que cada pantalla sólo defina su contenido.
- `StepIndicator` renderiza las 4 etapas con estado done/active/pending.

### Persistencia del draft
El `persist` middleware escribe el draft en AsyncStorage con la key `clothing-draft-v1`. Si el usuario cierra la app a mitad del flujo, al volver encuentra sus datos. Al publicar con éxito, `reset()` limpia el store y el storage.

## Tests

```bash
npm test
```

Jest está configurado con el preset `jest-expo` (ver `package.json`). Hay 10 tests unitarios para la lógica de validación en `src/validation/formValidation.test.ts` cubriendo los tres pasos individuales y el `validateAll` compuesto — todos pasan.

## Trade-offs y mejoras con más tiempo

- **Animaciones**: hoy uso las transiciones nativas de React Navigation. Con más tiempo agregaría `react-native-reanimated` con un layout animation en el cambio de paso para reforzar la sensación de progreso.
- **Dark mode**: el theming ya vive en `src/theme/theme.ts`, sólo faltaría leer `useColorScheme()` y exportar dos paletas — pero para 2-3 horas prioricé completar el flujo.
- **Accesibilidad**: agregaría `accessibilityLabel` y `accessibilityRole` en chips y botones, y aumentaría contraste en estados disabled.
- **Manejo de errores del image picker**: hoy muestro un `Alert` simple si el usuario deniega permisos. Una UX mejor llevaría al usuario a Settings con `Linking`.
- **Tests de componentes**: con más tiempo agregaría `@testing-library/react-native` para testear los screens end-to-end (selección de imagen mockeada, flujo completo de navegación).
- **Validación con Zod**: reemplazaría los validators manuales por un schema Zod y derivaría el tipo `ClothingItem` del propio schema.
- **Formato de precio mientras se escribe**: hoy formateo con `Intl.NumberFormat` sólo en el preview; sería lindo tener el separador de miles en vivo en el input.

## Qué falta (si quedase algo)

Completé todos los requerimientos funcionales y técnicos del enunciado. Del bonus quedaron hechos: persistencia en AsyncStorage y tests unitarios. Faltan las animaciones de Reanimated y el dark mode — documentados arriba.
