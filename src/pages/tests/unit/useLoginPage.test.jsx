import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';

// Mocks for external dependencies
const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockPost = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    token: '',
  }),
}));

vi.mock('../../../hooks/useAxiosAuth', () => ({
  __esModule: true,
  default: () => ({
    post: mockPost,
  }),
}));

import useLoginPage from '../../../hooks/useLoginPage';

afterEach(() => {
  vi.clearAllMocks();
});

describe('useLoginPage', () => {
  it('initializes form as empty with no error', () => {
    const { result } = renderHook(() => useLoginPage());

    expect(result.current.form).toEqual({ username: '', password: '' });
    expect(result.current.error).toBe('');
    expect(typeof result.current.handleChange).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
  });

  it('updates form when handleChange is called', () => {
    const { result } = renderHook(() => useLoginPage());

    act(() => {
      result.current.handleChange({ target: { name: 'username', value: 'Spock' } });
    });

    expect(result.current.form.username).toBe('Spock');
    expect(result.current.form.password).toBe('');

    act(() => {
      result.current.handleChange({ target: { name: 'password', value: 'Enterprise' } });
    });

    expect(result.current.form).toEqual({ username: 'Spock', password: 'Enterprise' });
  });

  it('shows error if API fails in handleSubmit', async () => {
    const { result } = renderHook(() => useLoginPage());

    act(() => {
      result.current.handleChange({ target: { name: 'username', value: 'Spock' } });
      result.current.handleChange({ target: { name: 'password', value: 'Enterprise' } });
    });

    mockPost.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    expect(result.current.error).toBe('Invalid credentials');
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('performs login and navigates if API responds correctly', async () => {
    const { result } = renderHook(() => useLoginPage());

    act(() => {
      result.current.handleChange({ target: { name: 'username', value: 'Spock' } });
      result.current.handleChange({ target: { name: 'password', value: 'Enterprise' } });
    });

    mockPost.mockResolvedValueOnce({
      data: { token: 'fake-jwt-token' },
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    expect(result.current.error).toBe('');
    expect(mockPost).toHaveBeenCalledWith('/auth/login', {
      username: 'Spock',
      password: 'Enterprise',
    });
    expect(mockLogin).toHaveBeenCalledWith('fake-jwt-token');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
