import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

function AdminLogin() {

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      const response = await fetch(
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            username,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message || 'Invalid username or password.'
        );

        setLoading(false);
        return;
      }

      /*
       * Store JWT
       */
      localStorage.setItem(
        'adminToken',
        data.token
      );

      /*
       * Login successful
       */
      navigate('/admin');

    } catch (error) {

      console.error('Login error:', error);

      setError(
        'Unable to connect to the server.'
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <main className="admin-login-page">

      <div className="admin-login-container">

        <div className="admin-login-header">

          <p className="admin-login-eyebrow">
            WATCHPROJECT
          </p>

          <h1>
            ADMINISTRATION
          </h1>

          <p className="admin-login-subtitle">
            Private access to the WatchProject inventory.
          </p>

        </div>


        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          <div className="admin-login-field">

            <label htmlFor="username">
              USERNAME
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              autoComplete="username"
              required
            />

          </div>


          <div className="admin-login-field">

            <label htmlFor="password">
              PASSWORD
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
              required
            />

          </div>


          {error && (

            <p className="admin-login-error">
              {error}
            </p>

          )}


          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >

            {loading
              ? 'AUTHENTICATING...'
              : 'ENTER ADMINISTRATION →'
            }

          </button>

        </form>


        <button
          type="button"
          className="admin-login-back"
          onClick={() => navigate('/')}
        >
          ← RETURN TO WATCHPROJECT
        </button>

      </div>

    </main>

  );

}

export default AdminLogin;