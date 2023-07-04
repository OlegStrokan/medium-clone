import ReactDOM from 'react-dom/client'
import {App} from "./App";
import React from 'react';
import {Provider} from "react-redux";
import store from "./store/createStore";


ReactDOM.createRoot(document.getElementById('root') as any).render(
    <Provider store={store}>
        <App />
    </Provider>
);
