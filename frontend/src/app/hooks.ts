// src/app/hooks.ts 
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store'; // Import types from store


export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

