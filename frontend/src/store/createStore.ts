import {configureStore} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import {api} from "../api/api";


const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
    
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});


setupListeners(store.dispatch);

export default store;
