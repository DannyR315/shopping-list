import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (password === import.meta.env.VITE_APP_PASSWORD) {
      sessionStorage.setItem('auth', 'true');
      onLogin();
    } else {
      setError(true);
      setShaking(true);
      setPassword('');
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-icon">🛒</div>
        <h1 className="login-title">Shopping List</h1>
        <p className="login-subtitle">Enter the password to continue</p>
        <form onSubmit={handleSubmit} className={shaking ? 'shake' : ''}>
          <input
            type="password"
            className={`login-input ${error ? 'login-input--error' : ''}`}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            autoFocus
          />
          {error && <p className="login-error">Incorrect password</p>}
          <button type="submit" className="login-button">
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
