import { handleApiError } from '@/lib/error-handler';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../api';
import { toast } from 'react-hot-toast';

export default function RegisterForm() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const data = await register(formData);
      setToken(data.access_token, data.expires_in);
      setUser(data.user);
      toast.success('Registration successful! You are now logged in.');
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
        <label htmlFor="first_name">First name</label>
        <input id="first_name" className="input" type="text" placeholder="John" onChange={handleChange} required />
      </div>
      <div className="form-field">
        <label htmlFor="last_name">Last name</label>
        <input id="last_name" className="input" type="text" placeholder="Doe" onChange={handleChange} required />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input id="email" className="input" type="email" placeholder="you@example.com" onChange={handleChange} required />
      </div>
      <div className="form-field">
        <label htmlFor="phone_number">Phone number</label>
        <input id="phone_number" className="input" type="text" placeholder="+1234567890" onChange={handleChange} />
      </div>
      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input id="password" className="input" type="password" placeholder="Choose a password" onChange={handleChange} required minLength={8} />
      </div>
      <div className="form-field">
        <label htmlFor="confirm_password">Confirm Password</label>
        <input id="confirm_password" className="input" type="password" placeholder="Confirm your password" onChange={handleChange} required minLength={8} />
      </div>

      <button className="button" type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
