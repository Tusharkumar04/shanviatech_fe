import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { AppRoutes } from '@/app/router';
import { ErrorBoundary } from '@/components/common/error-boundary';

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter basename="/admin">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </BrowserRouter>
    </AppProviders>
  );
}
