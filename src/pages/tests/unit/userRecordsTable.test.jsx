import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";

vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, username: "Spock" } }),
}));

const mockGet = vi.fn();
const mockDelete = vi.fn();
vi.mock("../../../hooks/useAxiosAuth", () => ({
  __esModule: true,
  default: () => ({
    get: mockGet,
    delete: mockDelete,
  }),
}));

import UserRecordsTable from "../../../components/UserRecordsTable";

describe("UserRecordsTable", () => {

  beforeEach(() => {
    vi.clearAllMocks();

    mockGet.mockResolvedValue({ data: { records: [], total: 0 } });
  });

  it("It renders with initial correct state", async () => {
    render(<UserRecordsTable />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    expect(screen.getByText("No records found")).toBeInTheDocument();
  });

  it("fetchRecords update records and total balance corectly", async () => {
    const mockData = {
      records: [
        { id: 1, operation_type: "addition", amount: 10, user_balance: 100, operation_response: 42, createdAt: "2025-08-27" },
        { id: 2, operation_type: "subtraction", amount: 5, user_balance: 95, operation_response: 20, createdAt: "2025-08-27" }
      ],
      total: 2
    };

    mockGet.mockResolvedValue({ data: mockData });

    render(<UserRecordsTable />);

    await waitFor(() => {
      expect(screen.getByText("addition")).toBeInTheDocument();
      expect(screen.getByText("subtraction")).toBeInTheDocument();
    });

    const additionRows = screen.getAllByText("addition");
    const subtractionRows = screen.getAllByText("subtraction");

    expect(additionRows.length + subtractionRows.length).toBe(mockData.records.length);
  });


});
