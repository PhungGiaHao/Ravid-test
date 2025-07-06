import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AppInput from '@/components/common/AppInput';
import AppButton from '@/components/common/AppButton';
import colors from '@/theme/colors';
import { CategoryType } from '@/store/useBuilderStore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { categoryFormSchema } from '@/utils/validation';
import { useRef } from 'react';

interface CategoryFormProps {
  defaultType: CategoryType;
  onAdd: (type: CategoryType, label: string, extra?: { positionTitle?: string; companyName?: string; startDate?: string; sections?: Array<{ title: string; value?: string; type: 'text' | 'date' }>; }) => void;
  onCancel: () => void;
  onRemove?: () => void;
  initialValues?: any;
}

const CATEGORY_OPTIONS = [
  { label: 'Positions', value: 'positions' },
  { label: 'Customize', value: 'Custom' },
];

const customSectionSchema = yup.object().shape({
  sections: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Section title is required'),
      type: yup.string().oneOf(['text', 'date']).required(),
      value: yup.mixed().when('type', {
        is: 'date',
        then: s => s.required('Date is required'),
        otherwise: s => s.notRequired(),
      }),
    }),
  ),
});

export default function CategoryForm({
  defaultType,
  onAdd,
  onCancel,
  onRemove,
  initialValues,
}: CategoryFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  type FormValues = {
    type: CategoryType;
    positionTitle: string;
    companyName: string;
    startDate?: Date;
    label: string;
    sections: Array<{
      title: string;
      type: 'text' | 'date';
      value?: string;
      showDatePicker?: boolean;
    }>;
    datePickerIdx?: number;
  };

  const formSchema = categoryFormSchema.concat(customSectionSchema) as any;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues
      ? {
          type: initialValues.type,
          positionTitle: initialValues.positionTitle || '',
          companyName: initialValues.companyName || '',
          startDate: initialValues.startDate
            ? new Date(initialValues.startDate)
            : undefined,
          label: initialValues.label || '',
          sections: initialValues.sections || [],
          datePickerIdx: -1,
        }
      : {
          type: defaultType,
          positionTitle: '',
          companyName: '',
          startDate: undefined,
          label: '',
          sections: [],
          datePickerIdx: -1,
        },
    resolver: yupResolver(formSchema),
  });
  const type: CategoryType = watch('type');
  const startDate = watch('startDate');

  const [addField, setAddField] = useState<{
    title: string;
    type: 'text' | 'date';
    value?: string;
  }>({ title: '', type: 'text', value: '' });
  const [addFieldError, setAddFieldError] = useState<string | null>(null);
  const addFieldTitleRef = useRef<any>(null);
  const [addFieldDatePickerOpen, setAddFieldDatePickerOpen] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sections',
  });

  const validateAddField = () => {
    if (!addField.title.trim()) {
      setAddFieldError('Section title is required');
      addFieldTitleRef.current?.focus?.();
      return false;
    }
    setAddFieldError(null);
    return true;
  };

  const handleAddField = () => {
    if (!validateAddField()) return;
    append({ ...addField });
    setAddField({ title: '', type: 'text', value: '' });
    setAddFieldError(null);
    addFieldTitleRef.current?.focus?.();
  };

  const handleSave = (data: FormValues) => {
    if (initialValues) {
      onAdd(
        data.type,
        data.type === 'positions' ? data.positionTitle : data.label || '',
        {
          positionTitle: data.positionTitle,
          companyName: data.companyName,
          startDate: data.startDate ? new Date(data.startDate).toISOString() : '',
          sections: data.sections,
        }
      );
    } else {
      if (data.type === 'positions') {
        onAdd('positions', data.positionTitle || '', {
          positionTitle: data.positionTitle,
          companyName: data.companyName,
          startDate: data.startDate ? new Date(data.startDate).toISOString() : '',
        });
      } else {
        onAdd('Custom', data.label || '', {
          sections: data.sections,
        });
      }
    }
  };

  return (
    <View style={styles.formBox}>
      <Text style={styles.label}>Category Type</Text>
      <Controller
        control={control}
        name="type"
        render={({ field: { value, onChange } }) => (
          <Dropdown
            data={CATEGORY_OPTIONS}
            labelField="label"
            valueField="value"
            value={value}
            onChange={item => onChange(item.value as CategoryType)}
            style={styles.dropdown}
            placeholder="Select type"
            placeholderStyle={{ color: colors.placeholder }}
            itemTextStyle={{ color: colors.inputText }}
            selectedTextStyle={{ color: colors.inputText }}
            containerStyle={{ backgroundColor: colors.card }}
          />
        )}
      />
      {type === 'positions' ? (
        <>
          <Text style={styles.label}>Position Title</Text>
          <Controller
            control={control}
            name="positionTitle"
            render={({ field: { value, onChange } }) => (
              <AppInput
                value={value}
                onChangeText={onChange}
                placeholder="Position Title"
                style={styles.input}
                error={errors.positionTitle?.message as string}
              />
            )}
          />
          <Text style={styles.label}>Company Name</Text>
          <Controller
            control={control}
            name="companyName"
            render={({ field: { value, onChange } }) => (
              <AppInput
                value={value}
                onChangeText={onChange}
                placeholder="Company Name"
                style={styles.input}
                error={errors.companyName?.message as string}
              />
            )}
          />
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Controller
              control={control}
              name="startDate"
              render={({ field: { value, onChange } }) => (
                <AppInput
                  value={value ? new Date(value).toLocaleDateString() : ''}
                  placeholder="Start Date"
                  style={styles.input}
                  editable={false}
                  pointerEvents="none"
                  error={errors.startDate?.message as string}
                />
              )}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            date={startDate ? new Date(startDate) : new Date()}
            onConfirm={date => {
              setShowDatePicker(false);
              setValue('startDate', date);
            }}
            onCancel={() => setShowDatePicker(false)}
            display="spinner"
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Tab Name</Text>
          <Controller
            control={control}
            name="label"
            render={({ field: { value, onChange } }) => (
              <AppInput
                value={value}
                onChangeText={onChange}
                placeholder="Enter tab name"
                style={styles.input}
                error={errors.label?.message as string}
              />
            )}
          />
          {fields.map((section, idx) => (
            <View key={section.id}>
              <Text style={styles.label}>{section.title}</Text>
              <Controller
                control={control}
                name={`sections.${idx}.value`}
                render={({ field: { value, onChange } }) =>
                  section.type === 'text' ? (
                    <AppInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter value"
                      style={styles.input}
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setValue('datePickerIdx', idx);
                          setAddFieldDatePickerOpen(true);
                        }}
                        activeOpacity={0.8}
                      >
                        <AppInput
                          value={value ? new Date(value).toLocaleDateString() : ''}
                          placeholder="Pick date"
                          style={styles.input}
                          editable={false}
                          pointerEvents="none"
                        />
                      </TouchableOpacity>
                      {addFieldDatePickerOpen && watch('datePickerIdx') === idx && (
                        <DateTimePickerModal
                          isVisible={true}
                          mode="date"
                          date={value ? new Date(value) : new Date()}
                          onConfirm={date => {
                            onChange(date.toISOString());
                            setAddFieldDatePickerOpen(false);
                            setValue('datePickerIdx', -1);
                          }}
                          onCancel={() => {
                            setAddFieldDatePickerOpen(false);
                            setValue('datePickerIdx', -1);
                          }}
                          display="spinner"
                        />
                      )}
                    </>
                  )
                }
              />
              <TouchableOpacity
                onPress={() => remove(idx)}
                style={styles.sectionRemoveBtn}
              >
                <Text style={styles.sectionRemoveText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionLabel}>Title</Text>
            <AppInput
              inputRef={addFieldTitleRef}
              value={addField.title}
              onChangeText={t => setAddField(f => ({ ...f, title: t }))}
              placeholder="Section title"
              style={styles.input}
              error={addFieldError || undefined}
            />
            <Text style={styles.sectionLabel}>Input Feature Format</Text>
            <Dropdown
              data={[
                { label: 'Text', value: 'text' },
                { label: 'Date', value: 'date' },
              ]}
              labelField="label"
              valueField="value"
              value={addField.type}
              onChange={item => setAddField(f => ({ ...f, type: item.value }))}
              style={styles.dropdown}
              placeholder="Select type"
              placeholderStyle={{ color: colors.placeholder }}
              itemTextStyle={{ color: colors.inputText }}
              selectedTextStyle={{ color: colors.inputText }}
              containerStyle={{ backgroundColor: colors.card }}
            />
            {addField.type === 'text' ? (
              <>
                <Text style={styles.sectionLabel}>Value</Text>
                <AppInput
                  value={addField.value}
                  onChangeText={v => setAddField(f => ({ ...f, value: v }))}
                  placeholder="Sample value"
                  style={styles.input}
                />
              </>
            ) : (
              <>
                <Text style={styles.sectionLabel}>Value</Text>
                <TouchableOpacity
                  onPress={() => setAddFieldDatePickerOpen(true)}
                  activeOpacity={0.8}
                >
                  <AppInput
                    value={
                      addField.value
                        ? new Date(addField.value).toLocaleDateString()
                        : ''
                    }
                    placeholder="Pick date"
                    style={styles.input}
                    editable={false}
                    pointerEvents="none"
                  />
                </TouchableOpacity>
                {addFieldDatePickerOpen && (
                  <DateTimePickerModal
                    isVisible={true}
                    mode="date"
                    date={
                      addField.value ? new Date(addField.value) : new Date()
                    }
                    onConfirm={date => {
                      setAddField(f => ({ ...f, value: date.toISOString() }));
                      setAddFieldDatePickerOpen(false);
                    }}
                    onCancel={() => setAddFieldDatePickerOpen(false)}
                    display="spinner"
                  />
                )}
              </>
            )}
            <TouchableOpacity
              style={styles.addSectionBtn}
              onPress={handleAddField}
            >
              <Text style={styles.addSectionBtnText}>+ Add a field</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <View style={styles.buttonRow}>
        <AppButton
          title="Save"
          onPress={handleSubmit(handleSave as any)}
          color={colors.accent}
          textColor={colors.white}
          style={{ padding: 12 }}
        />
        <AppButton
          title="Cancel"
          onPress={onCancel}
          color={colors.error}
          textColor={colors.white}
          style={{ padding: 12 }}
        />
        {onRemove && (
          <AppButton
            title="Remove"
            onPress={onRemove}
            color={colors.error}
            textColor={colors.white}
            style={{ padding: 12 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formBox: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
    marginBottom: 8,
  },
  label: {
    color: colors.inputText,
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
    fontWeight: 'bold',
  },
  dropdown: {
    backgroundColor: colors.input,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 8,
  },
  sectionListBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionBox: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    color: colors.inputText,
    fontSize: 15,
    marginBottom: 4,
    marginTop: 4,
    fontWeight: 'bold',
  },
  sectionRemoveBtn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.error,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  sectionRemoveText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  addSectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  addSectionBtnText: {
    color: colors.inputText,
    fontSize: 18,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});
