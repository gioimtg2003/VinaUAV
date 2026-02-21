import { createBrowserRouter } from 'react-router-dom';
import ShellLayout from './layout/ShellLayout';
import OverviewScreen from './screen/Overview';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ShellLayout />,
    children: [
      {
        index: true,
        element: <OverviewScreen />,
      },
    ],
  },
]);

export default router;
