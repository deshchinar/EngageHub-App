import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers, Reducer } from 'redux';
import { persistReducer, PersistConfig } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import analysisReducer from './features/analysis/analysisSlice';

interface RootStateInitial {
  analysis: ReturnType<typeof analysisReducer>;
}

const persistConfig: PersistConfig<RootStateInitial> = {
  key: 'root',
  storage: AsyncStorage,
};

const reducers = combineReducers({
  analysis: analysisReducer
});

const persistedReducer = persistReducer<RootStateInitial>(persistConfig, reducers as Reducer<RootStateInitial>);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {analysis: AnalysisState}
export type AppDispatch = typeof store.dispatch
