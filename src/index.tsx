import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './app';
// import { startServiceWorker } from './services/serviceWorker/serviceWorker';
import './styles/global.pcss';
import { store } from './store';

ReactDOM.hydrate(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);

// startServiceWorker();
