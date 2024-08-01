import { create } from 'zustand';

const useStore = create((set) => ({
    BASE_URL: process.env.REACT_APP_API_URL
}))

export default useStore;