import AppLayout from '@/layouts/AppLayout';
import About from '@/pages/about/About';
import Caro from '@/pages/caro/Caro';
import CaroWithSocket from '@/pages/caro/CaroWithSocket';
import { SocketProvider } from '@/pages/context/SocketContext';
import Dashboard from '@/pages/dashboard/Dashboard';
import Flow from '@/pages/flow/Flow';
import Library from '@/pages/library/Library';
import PerfectwinFlow from '@/pages/ptee-flow/PerfectwinFlow';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'flow',
        element: <Flow />
      },
      {
        path: 'ptee-flow',
        element: <PerfectwinFlow />
      },
      {
        path: 'lib',
        element: <Library />
      },
      {
        path: 'caro',
        element: <Caro />
      },
      {
        path: 'caro-friends',
        element: <CaroWithSocket />
      }
    ]
  }
]);

export default router;
