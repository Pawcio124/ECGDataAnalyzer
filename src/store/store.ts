import { combineReducers, configureStore } from "@reduxjs/toolkit";
// @ts-ignore
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import ekgDataSlice from "./ekgDataSlice";
import thunk from "redux-thunk";

const reducers = combineReducers({
  ekgData: ekgDataSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducers = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
