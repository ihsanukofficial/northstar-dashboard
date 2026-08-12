import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './components/Layout/AppLayout/AppLayout';
import { ROUTES } from './constants/routes';

const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage/AnalyticsPage'));
const CustomersPage = lazy(() => import('./pages/CustomersPage/CustomersPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage/MessagesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage/ProductsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage/SettingsPage'));

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate replace to={ROUTES.analytics} />} />
        <Route path={ROUTES.analytics} element={<AnalyticsPage />} />
        <Route path={ROUTES.products} element={<ProductsPage />} />
        <Route path={ROUTES.messages} element={<MessagesPage />} />
        <Route path={ROUTES.customers} element={<CustomersPage />} />
        <Route path={ROUTES.settings} element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
