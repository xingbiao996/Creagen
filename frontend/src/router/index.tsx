import { createBrowserRouter } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import Home from '@/pages/Home';
import Detail from '@/pages/Detail';
import History from '@/pages/History';
import Settings from '@/pages/Settings';
import Favorites from '@/pages/Favorites';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'detail/:id',
        element: <Detail />
      },
      {
        path: 'history',
        element: <History />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'favorites',
        element: <Favorites />
      }
    ]
  }
]);
