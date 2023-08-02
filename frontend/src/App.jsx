import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './SideBar';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home, Profile, Search, Explore, Messages, Create } from './pages'


function App() {
  // const navigate = useNavigate();
  const router = createBrowserRouter([
    {
      element: <SideBar />,
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
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
