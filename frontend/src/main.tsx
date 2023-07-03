import ReactDOM from 'react-dom/client'
import {App} from "./App";
import {ReactNode} from "react";
import React from 'react';
import {Provider} from "react-redux";
import store from "./store/createStore";

ReactDOM.createRoot(document.getElementById("root") as Element).render(
    <React.StrictMode>
        <Provider store={store}>
        <App />
        </Provider>
    </React.StrictMode> as ReactNode);
