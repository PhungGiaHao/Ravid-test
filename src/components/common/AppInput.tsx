import React from 'react';
import { TextInput, StyleSheet, Text, View, TextInputProps } from 'react-native';
import colors from '@/theme/colors';

type AppInputProps = TextInputProps & {
  error?: string;
  inputRef?: React.Ref<any>;
};

export default function AppInput({ error, style, inputRef, ...props }: AppInputProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        ref={inputRef}
        style={[styles.input, style]}
        placeholderTextColor={colors.placeholder}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  input: {
    backgroundColor: colors.input,
    color: colors.inputText,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 8,
  },
});
