// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'RETAILER' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://smart-b2b.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        alert('Signup failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSignup} className="p-8 bg-white rounded shadow w-96 space-y-4">
        <h2 className="text-xl font-bold">Create Account</h2>
        <input className="w-full border p-2" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
        <input className="w-full border p-2" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input className="w-full border p-2" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <select className="w-full border p-2" onChange={(e) => setFormData({...formData, role: e.target.value})}>
          <option value="RETAILER">Retailer</option>
          <option value="WHOLESALER">Wholesaler</option>
        </select>
        <button className="w-full bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
