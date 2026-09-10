import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProductList } from './pages/ProductList';
import { ProductRegistration } from './pages/ProductRegistration';
import { Settings } from './pages/Settings';
import { ThemeProvider } from '../components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="auto-price-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductRegistration />} />
            <Route path="settings" element={<Settings />} />
            <Route path="logs" element={<div className="p-4">Log page placeholder</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
