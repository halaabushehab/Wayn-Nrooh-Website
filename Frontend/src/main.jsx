import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store.js'; // تأكد أن المسار صحيح
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')).render(
   <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">

 <Provider store={store}>
      <App />
    </Provider>
    </GoogleOAuthProvider>,

    
);
