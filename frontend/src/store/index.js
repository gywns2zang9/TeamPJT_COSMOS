import { create } from 'zustand';

const useStore = create((set) => ({
    BASE_URL: '',
}))

export default useStore;