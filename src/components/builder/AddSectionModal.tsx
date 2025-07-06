import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import AppInput from '@/components/common/AppInput';
import AppButton from '@/components/common/AppButton';
import colors from '@/theme/colors';
import { Dropdown } from 'react-native-element-dropdown';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const SECTION_TYPE_OPTIONS = [
  { label: 'Text', value: 'text' },
  { label: 'Date', value: 'date' },
];

const sectionSchema = yup.object().shape({
  title: yup.string().required('Section title is required'),
  type: yup.string().oneOf(['text', 'date']).required('Section type is required'),
});

interface AddSectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (section: { title: string; type: 'text' | 'date' }) => void;
}

export default function AddSectionModal({ visible, onClose, onSave }: AddSectionModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ title: string; type: 'text' | 'date' }>({
    defaultValues: { title: '', type: 'text' },
    resolver: yupResolver(sectionSchema),
  });

  const handleSave = (data: any) => {
    onSave(data);
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleCancel}
      onBackButtonPress={handleCancel}
      style={styles.modal}
      backdropOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Add Field</Text>
        <Text style={styles.label}>Title</Text>
        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange } }) => (
            <AppInput
              value={value}
              onChangeText={onChange}
              placeholder="Section title"
              style={styles.input}
              error={errors.title?.message as string}
            />
          )}
        />
        <Text style={styles.label}>Input Feature Format</Text>
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <Dropdown
              data={SECTION_TYPE_OPTIONS}
              labelField="label"
              valueField="value"
              value={value}
              onChange={item => onChange(item.value)}
              style={styles.dropdown}
              placeholder="Select type"
              placeholderStyle={{ color: colors.placeholder }}
              itemTextStyle={{ color: colors.inputText }}
              selectedTextStyle={{ color: colors.inputText }}
              containerStyle={{ backgroundColor: colors.card }}
            />
          )}
        />
        {errors.type && <Text style={styles.error}>{errors.type.message as string}</Text>}
        <View style={styles.buttonRow}>
          <AppButton
            title="Save"
            onPress={handleSubmit(handleSave)}
            color={colors.accent}
            textColor={colors.white}
            style={{ marginRight: 8, minWidth: 100 }}
          />
          <AppButton
            title="Cancel"
            onPress={handleCancel}
            color={colors.error}
            textColor={colors.white}
            style={{ minWidth: 100 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  content: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 24,
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    color: colors.inputText,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  label: {
    color: colors.inputText,
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: colors.input,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 8,
  },
}); 