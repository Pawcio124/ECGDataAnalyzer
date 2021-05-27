import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import ekgDataSlice from "./ekgDataSlice";
import thunk from "redux-thunk";
import createIdbStorage from "@piotr-cz/redux-persist-idb-storage";

const reducers = combineReducers({
  ekgData: ekgDataSlice,
});

const persistConfig = {
  version: 1,
  key: "root",
  storage: createIdbStorage({ name: "ECGSelector", storeName: "redux" }),
};

const persistedReducers = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persist = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
