// src/pages/Login.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Login failed');

      // Decode the JWT payload to get the role (in a real app, use jwt-decode library)
      // For this implementation, we assume the backend returns the role with the token,
      // or we extract it. Let's decode the base64 payload:
      const payload = JSON.parse(atob(data.token.split('.')[1]));

      // Save to Redux and LocalStorage [cite: 22]
      dispatch(setCredentials({ 
        token: data.token, 
        user: payload.id, 
        role: payload.role 
      }));

      // Branch the router based on role [cite: 24]
      if (payload.role === 'WHOLESALER') {
        navigate('/wholesaler/dashboard');
      } else if (payload.role === 'RETAILER') {
        navigate('/retailer/catalog');
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">SmartB2B Login</h2>
        
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full p-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center">
  Don't have an account? <a href="/signup" className="text-blue-600 font-bold">Register here</a>
</p>
      </div>
    </div>
  );
}