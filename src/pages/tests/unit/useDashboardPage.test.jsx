import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, afterEach } from "vitest";

const mockNavigate = vi.fn();
const mockLogout = vi.fn();
const mockGet = vi.fn();
const mockPost = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 1, username: "Spock" },
    logout: mockLogout,
  }),
}));

vi.mock("../../../hooks/useAxiosAuth", () => ({
  __esModule: true,
  default: () => ({
    get: mockGet,
    post: mockPost,
  }),
}));

import useDashboardPage from "../../../hooks/useDashboardPage";

afterEach(() => {
  vi.clearAllMocks();
});

describe("useDashboardPage", () => {
  it("initializes with correct state", () => {
    const { result } = renderHook(() => useDashboardPage());

    expect(result.current.user.username).toBe("Spock");
    expect(result.current.balance).toBe(null);
    expect(result.current.operations).toEqual([]);
    expect(typeof result.current.handleLogout).toBe("function");
    expect(typeof result.current.handleExecute).toBe("function");
  });

  it("handleLogout calls logout() and navigates to /login", () => {
    const { result } = renderHook(() => useDashboardPage());

    act(() => {
      result.current.handleLogout();
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("successful fetch balance updates balance", async () => {
    mockGet.mockImplementation((url) => {
      if (url?.startsWith?.("/balance/")) {
        return Promise.resolve({ data: { balance: 150 } });
      }
      if (url === "/operations/list") {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });

    const { result } = renderHook(() => useDashboardPage());

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith(`/balance/1`);
    });

    await waitFor(() => {
      expect(result.current.balance).toBe(150);
    });
  });

  it("handleExecute runs operation and updates balance", async () => {
    mockPost.mockResolvedValueOnce({
      data: { result: 42, cost: 5, newBalance: 95 },
    });

    mockGet.mockImplementation((url) => {
      if (url?.startsWith?.("/balance/")) {
        return Promise.resolve({ data: { balance: 95 } });
      }
      if (url === "/operations/list") {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });

    const { result } = renderHook(() => useDashboardPage());

    act(() => {
      result.current.setSelectedType("addition");
    });

    await waitFor(() => {
      expect(result.current.operandsInput).toBe("");
    });

    act(() => {
      result.current.setOperandsInput("20,22");
    });

    await act(async () => {
      await result.current.handleExecute({ preventDefault: () => {} });
    });

    expect(mockPost).toHaveBeenCalledWith("/operations/execute", {
      type: "addition",
      operands: [20, 22],
    });
    expect(result.current.execResult).toEqual({
      result: 42,
      cost: 5,
      newBalance: 95,
    });
    expect(result.current.balance).toBe(95);
  });
});
