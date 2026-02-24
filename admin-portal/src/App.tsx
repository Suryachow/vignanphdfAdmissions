import { useState, useEffect } from 'react'
import Login from './Login'
import AdminDashboard from './AdminDashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  }} />;
}

export default App
