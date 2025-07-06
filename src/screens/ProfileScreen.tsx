import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import colors from '@/theme/colors';
import AppHeader from '@/components/common/AppHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import WaveHeader from '@/components/profile/ProfileWaveHeader';
import { useProfileStore } from '@/store/useProfileStore';

export default function ProfileScreen() {
  const { isEditing, setEditing } = useProfileStore();
  const [cancelEditFlag, setCancelEditFlag] = React.useState(0);

  const handleEditPress = () => {
    if (!isEditing) {
      setEditing(true);
    } else {
      setEditing(false);
      setCancelEditFlag(f => f + 1);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <WaveHeader onEditPress={handleEditPress} />
        <ScrollView contentContainerStyle={styles.content}>
          <ProfileForm isEditing={isEditing} cancelEditFlag={cancelEditFlag} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 12, paddingTop: 0 },
});
