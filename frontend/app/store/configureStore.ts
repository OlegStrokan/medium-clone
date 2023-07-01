import { configureStore } from '@reduxjs/toolkit';
import {rootReducer} from "@/app/store/rootReducer";
import {api} from "@/app/api/api";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

export default store;
