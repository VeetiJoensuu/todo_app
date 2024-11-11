import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './screens/Home';
import Authentication, { AuthenticationMode } from './screens/Authentication';
import ErrorPage from './screens/ErrorPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.js'
import UserProvider from './context/UserProvider'
import reportWebVitals from './reportWebVitals';

// Create a browser router for client-side routing
const router = createBrowserRouter([
  {
    errorElement: <ErrorPage /> // Route for handling errors
  },
  {
    path: "/signin", // Route for sign-in page
    element: <Authentication authenticationMode={AuthenticationMode.Login} />
  },
  {
    path: "/signup", // Route for sign-up page
    element: <Authentication authenticationMode={AuthenticationMode.Register} />
  },
  {
    element: <ProtectedRoute />, // Protect routes that need authentication
    children: [
      {
        path: "/",
        element: <Home />, // Home page route
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
// Wrap application with UserProvider for context
// Provide the router to the app
// Render the application
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
