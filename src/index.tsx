import ReactDOM from "react-dom";
import App from "./App.js";
import { Provider } from "react-redux";
import { persist, store } from "./store/store";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { PersistGate } from "redux-persist/integration/react";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persist}>
      <BrowserRouter>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  rootElement
);
