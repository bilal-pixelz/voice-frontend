'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../api';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(formData);
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="first_name">First name</label>
        <input id="first_name" className="input" type="text" placeholder="John" onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="last_name">Last name</label>
        <input id="last_name" className="input" type="text" placeholder="Doe" onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input id="email" className="input" type="email" placeholder="you@example.com" onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="phone_number">Phone number</label>
        <input id="phone_number" className="input" type="text" placeholder="+1234567890" onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input id="password" className="input" type="password" placeholder="Choose a password" onChange={handleChange} />
      </div>

      <button className="button" type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Create account'}
      </button>

      {error && <p className="small-text error" style={{ marginTop: 12 }}>{error}</p>}
    </form>
  );
}
