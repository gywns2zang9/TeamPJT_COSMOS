import { create } from 'zustand';
import { deleteRequest, get, patch, post } from '../api/api.js';
import useStore from './index.js';

const BASE_URL = useStore.getState().BASE_URL;

const useUserStore = create((set) => ({

}))