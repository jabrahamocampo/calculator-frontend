import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import useAxiosAuth from '../../../hooks/useAxiosAuth';
import { useAuth } from '../../../context/AuthContext';
import { v4 as uuid4 } from 'uuid';

vi.mock('axios');
vi.mock('../../../context/AuthContext');
vi.mock('uuid', () => ({ v4: vi.fn() }));

describe('useAxiosAuth', () => {
  const mockInstance = { interceptors: { request: { use: vi.fn() } } };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(axios.create).mockReturnValue(mockInstance);
    vi.mocked(uuid4).mockReturnValue('mock-uuid');
    vi.mocked(useAuth).mockReturnValue({
      token: 'mock-token',
      user: { id: 'user123' },
    });
  });

  it('creates an axios instance with baseURL and configures headers', () => {
    useAxiosAuth();

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: expect.any(String),
    });

    const requestInterceptor = mockInstance.interceptors.request.use.mock.calls[0][0];

    const config = { method: 'post', headers: {} };
    const result = requestInterceptor(config);

    expect(result.headers['Authorization']).toBe('Bearer mock-token');
    expect(result.headers['Idempotency-Key']).toBe('mock-uuid');
    expect(result.headers['X-User-Id']).toBe('user123');
    expect(result.headers['X-Correlation-ID']).toBe('mock-uuid');
  });
});
