import { RouterProvider } from 'react-router-dom';
import router from '@/routes/index';
import ErrorBoundary from './ErrorBoundary';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <ErrorBoundary>
      <RecoilRoot>
        <RouterProvider router={router}></RouterProvider>
      </RecoilRoot>
    </ErrorBoundary>
  );
}

export default App;
