import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import {api} from "../api/api";
 // Your API definition file

const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        // Add your other reducers here
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export default store;
