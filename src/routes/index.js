import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import Layout from '../layouts';

// Pages
import Login from '../pages/authentication/Login';
import Register from '../pages/authentication/Register';
import Portfolio from '../pages/Portfolio';
import IndividualCrypto from '../pages/IndividualCrypto';
import NotFound from '../pages/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth Routes
    {
      path: 'auth',
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> }
      ]
    },

    // Portfolio Routes
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Portfolio /> },
        { path: '/:crypto_id', element: <IndividualCrypto /> },
        { path: '/page404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/page404" replace /> }
      ]
    }
  ]);
}
