import { create } from 'zustand';
import { storage } from '@/utils/storage';


export type ProfileData = {
    fullName: string;
    middleName: string;
    lastName: string;
    username: string;
    professionalTitle: string;
    location: string;
    description: string;
    avatar: string | null;
};

const defaultProfile: ProfileData = {
    fullName: '',
    middleName: '',
    lastName: '',
    username: '',
    professionalTitle: '',
    location: '',
    description: '',
    avatar: null,
};

const PROFILE_KEY = 'profile_data';

type ProfileStore = {
    profile: ProfileData;
    setProfile: (profile: ProfileData) => void;
    loadProfile: () => void;
    isEditing: boolean;
    setEditing: (v: boolean) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: defaultProfile,
    setProfile: (profile) => {
        set({ profile });
        storage.set(PROFILE_KEY, JSON.stringify(profile));
    },
    loadProfile: () => {
        const data = storage.getString(PROFILE_KEY);
        const profile = data ? JSON.parse(data) : defaultProfile;
        set({ profile });
    },
    isEditing: false,
    setEditing: (v) => set({ isEditing: v }),
}));
