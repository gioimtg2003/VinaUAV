import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './constants';
import ShellLayout from './layout/ShellLayout';
import CalibrationScreen from './screen/Calibration';
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
      {
        path: ROUTES.CALI_SENSOR,
        element: <CalibrationScreen />,
      },
    ],
  },
]);

export default router;
