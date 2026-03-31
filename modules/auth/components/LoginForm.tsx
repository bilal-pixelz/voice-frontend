'use client';
import { handleApiError } from '@/lib/error-handler';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../api';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useAuthStore();
  const { setMessage } = useNotificationStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append('username', formData.username);
      form.append('password', formData.password);
      const data = await login(form);
      setToken(data.access_token, data.expires_in);
    
      if (data.user) {
        setUser({
          email: data.user.email,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          phone_number: data.user.phone_number,
          //avatar: data.user.avatar,
        });
      }
      setMessage('Logged in successfully');
      router.push('/dashboard');
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="username">Email</label>
        <input id="username" className="input" type="email" placeholder="you@example.com" onChange={handleChange} required />
      </div>

      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input id="password" className="input" type="password" placeholder="••••••••" onChange={handleChange} required />
      </div>

      <button className="button" type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Continue to Voice 2 Invoice'}
      </button>
    </form>
  );
}
