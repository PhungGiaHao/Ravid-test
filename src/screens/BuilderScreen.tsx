import AppHeader from '@/components/common/AppHeader';
import colors from '@/theme/colors';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useBuilderStore } from '@/store/useBuilderStore';
import BuilderTabs from '@/components/builder/BuilderTabs';

export default function BuilderScreen() {
  const loadCategories = useBuilderStore((s) => s.loadCategories);
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <View style={styles.container}>
      <AppHeader title="Builder" />
      <BuilderTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});

