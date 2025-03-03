import { RouterProvider } from 'react-router-dom';
import router from '@/routes/index';
import ErrorBoundary from './ErrorBoundary';
import { RecoilRoot } from 'recoil';
import { SocketProvider } from '@/pages/context/SocketContext';

function App() {
  return (
    <ErrorBoundary>
      <SocketProvider>
        <RecoilRoot>
          <RouterProvider router={router}></RouterProvider>
        </RecoilRoot>
      </SocketProvider>
    </ErrorBoundary>
  );
}

export default App;
