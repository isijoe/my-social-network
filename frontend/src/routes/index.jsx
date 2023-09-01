import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from '../authProvider';
import { ProtectedRoute } from "./ProtectedRoute";
import { Home, Profile, Search, Explore, Messages, Create } from '../pages';
import Login from '../pages/Login';

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/service",
      element: <div>Service Page</div>,
    },
    {
      path: "/about",
      element: <div>About</div>,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:profileId",
          element: <Profile />,
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/explore",
          element: <Explore />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: '/create',
          element: <Create />,
        },

      ]
    }
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <Login />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
