import { create } from 'zustand';

const useStore = create((set) => ({
    BASE_URL: 'http://localhost:8080',
}))

export default useStore;