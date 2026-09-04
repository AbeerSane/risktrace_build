import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Disputes from './pages/Disputes';
import DisputeDetail from './pages/DisputeDetail';
import CreateDispute from './pages/CreateDispute';
import Patterns from './pages/Patterns';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="disputes" element={<Disputes />} />
            <Route path="disputes/new" element={<CreateDispute />} />
            <Route path="disputes/:id" element={<DisputeDetail />} />
            <Route path="patterns" element={<Patterns />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
