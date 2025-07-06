import React from 'react';
import Svg, { Path } from 'react-native-svg';
import {
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
} from 'react-native';
import colors from '@/theme/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useImagePicker from '@/hooks/UseCameraPicker';
import { useProfileStore } from '@/store/useProfileStore';
interface WaveHeaderProps {
  onEditPress?: () => void;
}
export default function WaveHeader({ onEditPress }: WaveHeaderProps) {
  const { handleImagePicker } = useImagePicker();
  const { profile } = useProfileStore();
  console.log(profile.avatar);
  return (
    <View style={styles.container}>
      <View>
        <Svg
          height="120"
          width="100%"
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
          pointerEvents="none"
          style={{
            zIndex: 2,
          }}
        >
          <Path
            d="M0,0 C120,140 280,-40 400,20 L400,120 L0,120 Z"
            fill={colors.card}
            opacity={0.7}
          />
        </Svg>
      </View>
      <TouchableOpacity
        onPress={handleImagePicker}
        style={[
          styles.cameraWrapper,
          {
            zIndex: (profile.avatar && 5) || 1,
          },
        ]}
        activeOpacity={0.8}
      >
        {profile.avatar ? (
          <Image
            source={{ uri: profile.avatar }}
            style={[styles.avatar]}
            resizeMode="cover"
          />
        ) : (
          <Icon name="photo-camera" size={40} color="#fff" />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.editWrapper} onPress={onEditPress}>
        <Icon name="edit" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.background,
    marginTop: 16,
    paddingHorizontal: 12,
    marginBottom: 60,
    zIndex: 4,
  },
  cameraWrapper: {
    position: 'absolute',
    left: 16,
    bottom: -40,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 1,
  },
  editWrapper: {
    position: 'absolute',
    top: 40,
    right: 30,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 8,
    padding: 6,
    zIndex: 3,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#ccc',
  },
});
