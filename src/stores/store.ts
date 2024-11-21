import { create } from 'zustand';

type Store = {
  imageUploaded: File | null;
  setImageUploaded: (file: File) => void;
}

const useBuilder = create<Store>()((set) => ({
  imageUploaded: null,
  setImageUploaded: (value) => set({ imageUploaded: value })
}));

export default useBuilder;