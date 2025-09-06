import { describe, it, expect } from "vitest";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_GATEWAY = "http://localhost:8080";

describe("Smoke Tests", () => {
  it("API Gateway is up", async () => {
    const res = await axios.get(`${API_GATEWAY}/health`);
    expect(res.status).toBe(200);
  });

  it("Register user responds with 201 and user data", async () => {
    const testUser = {
      username: `smoketest+${Date.now()}@example.com`,
      password: "Test1234",
    };

    const correlationId = `smoke-${Date.now()}`;

    try {
      const res = await axios.post(`${API_GATEWAY}/api/v1/auth/register`, testUser, {
        headers: {
          "Content-Type": "application/json",
          "X-Correlation-Id": correlationId,
          "X-User-Id": "anonymous",
          "Authorization": "",
          "Idempotency-Key": ""
        },
      });

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty("user");
      expect(res.data.user).toHaveProperty("id");
      expect(res.data.user.username).toBe(testUser.username);

      console.log(`[${correlationId}] User registered successfully: ${res.data.user.username}`);
    } catch (err) {
      console.error(`[${correlationId}] Error in register test:`, err.response?.data || err.message);
      throw err;
    }
  });

  it("Balance-Service returns balance", async () => {
    const testUser = {
      username: `balance+${Date.now()}@example.com`,
      password: "Test1234",
    };

    const registerRes = await axios.post(
      `${API_GATEWAY}/api/v1/auth/register`,
      testUser,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": "test-client",
        },
      }
    );

    expect(registerRes.status).toBe(201);
    const user = registerRes.data.user;

    const loginRes = await axios.post(
      `${API_GATEWAY}/api/v1/auth/login`,
      {
        username: testUser.username,
        password: testUser.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": user.id,
        },
      }
    );

    expect(loginRes.status).toBe(200);
    const token = loginRes.data.token;

    const balanceRes = await axios.get(
      `${API_GATEWAY}/api/v1/balance/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": user.id,
        },
      }
    );

    expect(balanceRes.status).toBe(200);
    expect(balanceRes.data).toHaveProperty("balance");
    expect(balanceRes.data.balance).toBe(20);
    console.log(`Initial balance: ${balanceRes.data.balance}`);
  });

  it("Operation-Service executes simple operation", async () => {
    const testUser = {
      username: `balance+${Date.now()}@example.com`,
      password: "Test1234",
    };

    const registerRes = await axios.post(
      `${API_GATEWAY}/api/v1/auth/register`,
      testUser,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": "test-client",
        },
      }
    );

    expect(registerRes.status).toBe(201);
    const user = registerRes.data.user;

    const loginRes = await axios.post(
      `${API_GATEWAY}/api/v1/auth/login`,
      {
        username: testUser.username,
        password: testUser.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": user.id,
        },
      }
    );

    expect(loginRes.status).toBe(200);
    const token = loginRes.data.token;

    await axios.get(
      `${API_GATEWAY}/api/v1/balance/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": user.id,
        },
      }
    );

    const res = await axios.post(
      `${API_GATEWAY}/api/v1/operations/execute`,
      {
        type: "addition",
        operands: [2, 2],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": user.id,
          "Idempotency-Key": uuidv4(),
        },
      }
    );

    expect(res.data).toHaveProperty("result");
    expect(res.data.result).toBe("4.00");
  });

  it("Record-Service returns user records", async () => {
    const testUser = {
      username: `balance+${Date.now()}@example.com`,
      password: "Test1234",
    };

    const registerRes = await axios.post(
      `${API_GATEWAY}/api/v1/auth/register`,
      testUser,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": "test-client",
        },
      }
    );

    expect(registerRes.status).toBe(201);
    const user = registerRes.data.user;

    const loginRes = await axios.post(
      `${API_GATEWAY}/api/v1/auth/login`,
      {
        username: testUser.username,
        password: testUser.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": user.id,
        },
      }
    );

    expect(loginRes.status).toBe(200);
    const token = loginRes.data.token;

    await axios.get(
      `${API_GATEWAY}/api/v1/balance/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": user.id,
        },
      }
    );

    await axios.post(
      `${API_GATEWAY}/api/v1/operations/execute`,
      {
        type: "addition",
        operands: [2, 2],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": user.id,
          "Idempotency-Key": uuidv4(),
        },
      }
    );

    const res = await axios.get(`${API_GATEWAY}/api/v1/records`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": user.id,
          "Idempotency-Key": uuidv4(),
        },
      }
    );

    expect(res.status).toBe(200);
  });
});
