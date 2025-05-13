import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Categories from './pages/Categories';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';

function App() {
  const token = localStorage.getItem('token');

  return (
    <>
      {token && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <AuthPage />}
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/transactions"
          element={token ? <Transactions /> : <Navigate to="/" />}
        />
        <Route
          path="/budgets"
          element={token ? <Budgets /> : <Navigate to="/" />}
        />
        <Route
          path="/categories"
          element={token ? <Categories /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;