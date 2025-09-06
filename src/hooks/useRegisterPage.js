import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosAuth from './useAxiosAuth';

export default function useRegisterPage() {
  const axiosAuth = useAxiosAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axiosAuth.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Unexpected error');
    }
  };

  return {
    form,
    error,
    handleChange,
    handleSubmit,
  };
}
