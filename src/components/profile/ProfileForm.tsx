import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AppInput from '@/components/common/AppInput';
import { profileSchema } from '@/utils/validation';
import { useProfileStore } from '@/store/useProfileStore';
import AppButton from '@/components/common/AppButton';
import { useState } from 'react';
import colors from '@/theme/colors';

interface ProfileFormProps {
  isEditing: boolean;
  cancelEditFlag?: number;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ isEditing, cancelEditFlag }) => {
  const { profile, setProfile, loadProfile ,setEditing } = useProfileStore();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: profile,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    Object.entries(profile).forEach(([key, value]) => {
      setValue(key as any, value);
    });
  }, [profile]);

  useEffect(() => {
    if (!isEditing && cancelEditFlag !== undefined) {
      reset(profile);
    }
  }, [cancelEditFlag, isEditing, profile, reset]);

  const onSubmit = (data: any) => {
    setLoading(true);
    setProfile(data);
    setEditing(false)
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <View>
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, value } }) => (
          <AppInput
            placeholder="Full Name"
            value={value}
            onChangeText={onChange}
            error={errors.fullName?.message}
            editable={isEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="middleName"
        render={({ field: { onChange, value } }) => (
          <AppInput
            placeholder="Middle Name"
            value={value}
            onChangeText={onChange}
            error={errors.middleName?.message}
            editable={isEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <AppInput
            placeholder="Last Name"
            value={value}
            onChangeText={onChange}
            error={errors.lastName?.message}
            editable={isEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <AppInput
            placeholder="Username"
            value={value}
            onChangeText={onChange}
            error={errors.username?.message}
            editable={isEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="professionalTitle"
        render={({ field: { onChange, value } }) => (
          <AppInput
            placeholder="Professional Name and Title"
            value={value}
            onChangeText={onChange}
            error={errors.professionalTitle?.message}
            editable={isEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="location"
        render={({ field: { onChange, value } }) => (
          <AppInput
            placeholder="Location"
            value={value}
            onChangeText={onChange}
            error={errors.location?.message}
            editable={isEditing}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <AppInput
            placeholder="Describe yourself..."
            value={value}
            onChangeText={onChange}
            error={errors.description?.message}
            multiline
            style={{ minHeight: 60 }}
            editable={isEditing}
          />
        )}
      />
      {isEditing && (
        <AppButton
          title="Save"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          color={colors.accent}
          textColor={colors.white}
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );
};

export default ProfileForm;
