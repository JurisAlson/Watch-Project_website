import { Navigate } from 'react-router-dom';

function isTokenValid(token) {
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1])
    );

    if (!payload.exp) {
      return false;
    }

    return payload.exp * 1000 > Date.now();

  } catch {
    return false;
  }
}

function ProtectedRoute({ children }) {

  const token = localStorage.getItem('adminToken');

  if (!token || !isTokenValid(token)) {

    localStorage.removeItem('adminToken');

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;