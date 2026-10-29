import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { actions, createAppStore } from "./store";
import "./styles.css";
let storage: Storage | undefined;
try {
  storage = window.localStorage;
} catch {
  /* Browser may deny storage access. */
}
const store = createAppStore(storage);
if (!storage) store.dispatch(actions.storageFailed());
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
