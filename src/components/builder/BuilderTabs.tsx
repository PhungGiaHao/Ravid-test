import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  useBuilderStore,
  CategoryType,
  Category,
} from '@/store/useBuilderStore';
import colors from '@/theme/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CategoryForm from './CategoryForm';

const TAB_TYPES: CategoryType[] = ['positions', 'Custom'];

export default function BuilderTabs() {
  const categories = useBuilderStore(s => s.categories);
  const addCategory = useBuilderStore(s => s.addCategory);
  const removeCategory = useBuilderStore(s => s.removeCategory);
  const updateCategory = useBuilderStore(s => s.updateCategory);
  const [adding, setAdding] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const handleAdd = (type: CategoryType, label: string, extra?: any) => {
    addCategory(type, label, extra);
    setAdding(false);
  };

  const handleRemoveTab = (id: string) => {
    Alert.alert('Remove Tab', 'Are you sure you want to remove this tab?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          removeCategory(id);
          setSelectedCategoryId(null);
        },
      },
    ]);
  };

  const handleEdit = (id: string, data: any) => {
    const oldCategory = categories.find(cat => cat.id === id);
    if (!oldCategory) return;
    updateCategory(id, {
      ...oldCategory,
      ...data,
      id, 
      type: data.type || oldCategory.type,
      label: data.label || oldCategory.label,
      sections: data.sections || oldCategory.sections,
      positionTitle: data.positionTitle ?? oldCategory.positionTitle,
      companyName: data.companyName ?? oldCategory.companyName,
      startDate: data.startDate ?? oldCategory.startDate,
    });
    setSelectedCategoryId(null); 
  };

  const selectedCategory =
    categories.find(cat => cat.id === selectedCategoryId) || null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.wrapper}>
        <View style={styles.tabsRow}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.tabBox,
                selectedCategoryId === cat.id && { borderColor: colors.accent },
              ]}
              onPress={() => {
                if (!adding) setSelectedCategoryId(cat.id);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.tabLabel}>
                {cat.type === 'positions'
                  ? cat.positionTitle || cat.label
                  : cat.label}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveTab(cat.id)}
                style={styles.closeBtn}
              >
                <Icon name="close" size={20} color={colors.inputText} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.addRow}>
          <TouchableOpacity
            style={styles.addTabBtn}
            onPress={() => {
              setAdding(true);
              setSelectedCategoryId(null);
            }}
          >
            <Icon name="add" size={24} color={colors.inputText} />
            <Text style={styles.addTabText}>Add a tab</Text>
          </TouchableOpacity>
        </View>
        {adding && (
          <CategoryForm
            defaultType="positions"
            onAdd={handleAdd}
            onCancel={() => setAdding(false)}
          />
        )}
        {!adding && selectedCategory && (
          <CategoryForm
            key={selectedCategoryId} // Thêm dòng này!
            defaultType={selectedCategory.type}
            initialValues={selectedCategory}
            onAdd={(_, __, data) => handleEdit(selectedCategory.id, data)}
            onCancel={() => setSelectedCategoryId(null)}
            onRemove={() => handleRemoveTab(selectedCategory.id)}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  tabBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 120,
  },
  tabLabel: {
    color: colors.inputText,
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 12,
  },
  closeBtn: {
    padding: 4,
  },
  addRow: {
    flexDirection: 'row',
    gap: 16,
  },
  addTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginRight: 12,
  },
  addTabText: {
    color: colors.inputText,
    fontSize: 18,
    marginLeft: 8,
    marginRight: 4,
  },
  addTabType: {
    color: colors.placeholder,
    fontSize: 15,
  },
});
