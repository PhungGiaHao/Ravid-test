# RavidTest

## Demo Video

[![Watch the demo](https://img.youtube.com/vi/OxhTJxyEibg/0.jpg)](https://youtu.be/OxhTJxyEibg)

> Click the image above or [watch the demo here](https://youtu.be/OxhTJxyEibg)

## Installation & Build Instructions

### Prerequisites
- Node.js >= 18
- Yarn or npm
- Xcode (for iOS development)
- Android Studio (for Android development)
- React Native CLI

### 1. Install dependencies

```
yarn install
# or
npm install
```

### 2. iOS Setup
- Install CocoaPods dependencies:
  ```
  cd ios && pod install && cd ..
  ```
- Run on iOS simulator:
  ```
  yarn ios
  # or
  npm run ios
  ```
- To run on a real device, connect your device and select it in Xcode, or use:
  ```
  npx react-native run-ios --device
  ```

### 3. Android Setup
- Start an Android emulator or connect a real device (with USB debugging enabled).
- Run:
  ```
  yarn android
  # or
  npm run android
  ```

### 4. Start Metro Bundler (if not started automatically)
```
yarn start
# or
npm start
```

## How to Run
- **iOS:** Use a simulator or real device as above.
- **Android:** Use an emulator or real device as above.
- The app will hot-reload on code changes.

## Assumptions & Notes
- The app uses React Native 0.80+ and React 19+.
- All state management is handled with [zustand](https://github.com/pmndrs/zustand).
- Local storage is handled with [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) for fast, persistent storage.
- Form validation uses [React Hook Form](https://react-hook-form.com/) and [Yup](https://github.com/jquense/yup).
- The Builder tab's categories and fields are persisted locally and will remain after app restarts.
- The Profile tab is also persisted locally.
- No backend or remote API is used; all data is local.

## Brief Design Overview

### Architecture
- **State Management:**
  - Uses `zustand` for global state (categories, profile, etc.).
  - Builder and Profile data are stored in zustand stores and persisted to MMKV.
- **Persistence:**
  - The `src/utils/storage.ts` file exports a singleton MMKV instance.
  - Builder and Profile stores save and load data from MMKV using JSON serialization.
- **Forms:**
  - All forms use [React Hook Form](https://react-hook-form.com/) for state and validation.
  - [Yup](https://github.com/jquense/yup) is used for schema-based validation.
  - The Builder tab uses dynamic forms with `useFieldArray` for custom sections.
- **UI:**
  - Built with React Native components and [react-native-element-dropdown](https://github.com/hoaphantn7604/react-native-element-dropdown) for dropdowns.
  - [react-native-modal-datetime-picker](https://github.com/mmazzarolo/react-native-modal-datetime-picker) for date selection.
  - [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) for icons.
  - Keyboard handling is improved with `KeyboardAvoidingView`.

### Builder Tab
- Users can add, edit, and remove categories (tabs).
- Each category can be a "positions" type (with position/company/date fields) or "Custom" (with dynamic sections).
- All changes are persisted locally using MMKV.
- The UI updates instantly when switching between categories.

### Profile Tab
- Profile data is editable and validated.
- Changes are persisted locally using MMKV.
- Uses the same form/validation approach as Builder.

### Libraries Used
- `react-hook-form`, `@hookform/resolvers`, `yup`: Form state and validation
- `zustand`: State management
- `react-native-mmkv`: Local storage
- `react-native-element-dropdown`, `react-native-modal-datetime-picker`, `react-native-vector-icons`: UI components

---

For any issues or questions, please check the code comments or open an issue.
