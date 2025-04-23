import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router';
import AppProvider from './context/AppContext';
import routes from './routes/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/stylesheets/all.scss';
import { Provider } from 'react-redux';
import { store } from './store';

const router = createHashRouter(routes);

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </Provider>
  // </StrictMode>,
)
