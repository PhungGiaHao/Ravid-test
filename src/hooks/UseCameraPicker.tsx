import { useCallback } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';
import { useProfileStore } from '@/store/useProfileStore';

const useImagePicker = () => {
  const { profile, setProfile } = useProfileStore();

  const requestPermission = useCallback(async (permission: string) => {
    try {
      const result = await check(permission as Permission);
      if (result === RESULTS.GRANTED) return true;
      const requestResult = await request(permission as Permission);
      return requestResult === RESULTS.GRANTED;
    } catch (error) {
      Alert.alert('Permission error', 'Could not check permission.');
      return false;
    }
  }, []);

  const checkCameraPermission = useCallback(async () => {
    const perm = Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
    return await requestPermission(perm);
  }, [requestPermission]);

  const checkLibraryPermission = useCallback(async () => {
    let perm;
    if (Platform.OS === 'ios') {
      perm = PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else if (Platform.OS === 'android') {
      perm = Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    }
    return perm ? await requestPermission(perm) : false;
  }, [requestPermission]);

  const openSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Cannot open settings');
    });
  };

  const saveImageToApp = async (imagePath: string) => {
    try {
      const fileName = `avatar_${Date.now()}.jpg`;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.copyFile(imagePath, destPath);
      if (profile.avatar) {
        const oldPath = profile.avatar.replace('file://', '');
        await RNFS.unlink(oldPath).catch(() => {});
      }
      setProfile({ ...profile, avatar: Platform.OS === 'android' ? 'file://' + destPath : destPath });
    } catch (err) {
      Alert.alert('Save error', 'Could not save image.');
    }
  };
  const pickFromCamera = useCallback(async () => {
    const hasPermission = await checkCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Camera permission required',
        'Please allow camera access to take a photo.',
        [
          { text: 'Open settings', onPress: openSettings },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }
    try {
      const image = await ImageCropPicker.openCamera({
        cropping: true,
        mediaType: 'photo',
        forceJpg: true,
        cropperCircleOverlay: true,
      });
      if (image?.path) await saveImageToApp(image.path);
    } catch (err) {
      console.log(err)
    }
  }, [checkCameraPermission, saveImageToApp]);

  const pickFromLibrary = useCallback(async () => {
    const hasPermission = await checkLibraryPermission();
    if (!hasPermission) {
      Alert.alert(
        'Library permission required',
        'Please allow photo library access to select a photo.',
        [
          { text: 'Open settings', onPress: openSettings },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }
    try {
      const image = await ImageCropPicker.openPicker({
        cropping: true,
        mediaType: 'photo',
        forceJpg: true,
        cropperCircleOverlay: true,
      });
      if (image?.path) await saveImageToApp(image.path);
    } catch (err) {
      console.log(err)
    }
  }, [checkLibraryPermission, saveImageToApp]);

  const handleImagePicker = useCallback(() => {
    Alert.alert(
      'Select Image',
      'Choose an image from Camera or Photo Library.',
      [
        { text: 'Camera', onPress: pickFromCamera },
        { text: 'Photo Library', onPress: pickFromLibrary },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  }, [pickFromCamera, pickFromLibrary]);

  return {
    handleImagePicker,
  };
};

export default useImagePicker;
