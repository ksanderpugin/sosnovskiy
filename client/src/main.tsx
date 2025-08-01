import { createRoot } from "react-dom/client";
import "./index.scss";
import { App } from "./App";
import { Provider } from "react-redux";
import { store } from "./store/strore";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
