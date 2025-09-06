import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useRegisterPage from '../../../hooks/useRegisterPage';
import useAxiosAuth from '../../../hooks/useAxiosAuth';
import { useNavigate } from 'react-router-dom';

vi.mock('../../../hooks/useAxiosAuth');
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('useRegisterPage', () => {
  let mockPost;
  let mockNavigate;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPost = vi.fn();
    mockNavigate = vi.fn();
    useAxiosAuth.mockReturnValue({ post: mockPost });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('initializes the form as empty', () => {
    const { result } = renderHook(() => useRegisterPage());
    expect(result.current.form).toEqual({ username: '', password: '' });
    expect(result.current.error).toBe('');
  });

  it('updates the form when inputs change', () => {
    const { result } = renderHook(() => useRegisterPage());

    act(() => {
      result.current.handleChange({ target: { name: 'username', value: 'testuser' } });
    });
    act(() => {
      result.current.handleChange({ target: { name: 'password', value: '123456' } });
    });

    expect(result.current.form).toEqual({ username: 'testuser', password: '123456' });
  });

  it('navigates to /login if registration is successful', async () => {
    mockPost.mockResolvedValueOnce({});
    const { result } = renderHook(() => useRegisterPage());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(mockPost).toHaveBeenCalledWith('/auth/register', result.current.form);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('sets error if registration fails with backend message', async () => {
    mockPost.mockRejectedValueOnce({ response: { data: 'Username exists' } });
    const { result } = renderHook(() => useRegisterPage());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(result.current.error).toBe('Username exists');
  });

  it('sets generic error if failure has no response', async () => {
    mockPost.mockRejectedValueOnce({});
    const { result } = renderHook(() => useRegisterPage());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });

    expect(result.current.error).toBe('Unexpected error');
  });
});
