import { create } from 'zustand';

const useStore = create((set) => ({
    BASE_URL: 'http://i11a708.p.ssafy.io:5000/api/sessions',
}))

export default useStore;