import { describe, it, expect } from "vitest";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_GATEWAY = process.env.API_GATEWAY || "http://localhost:8080/api/v1";

describe("E2E - Calculator Flow", () => {
  let token;
  let user;
  let correlationId;
  let createdRecordId;

  it("1. Register user", async () => {
    correlationId = uuidv4();
    const testUser = {
      username: `e2e+${Date.now()}@example.com`,
      password: "Test1234",
    };

    const res = await axios.post(`${API_GATEWAY}/auth/register`, testUser, {
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-Id": correlationId,
        "X-User-Id": "e2e-client",
      },
    });

    expect(res.status).toBe(201);
    expect(res.data.user).toHaveProperty("id");
    user = res.data.user;
  });

  it("2. Login user", async () => {
    const res = await axios.post(
      `${API_GATEWAY}/auth/login`,
      {
        username: user.username,
        password: "Test1234",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Correlation-Id": uuidv4(),
          "X-User-Id": user.id,
        },
      }
    );

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("token");
    token = res.data.token;
  });

  it("3. Check initial balance", async () => {
    const res = await axios.get(`${API_GATEWAY}/balance/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Correlation-Id": uuidv4(),
        "X-User-Id": user.id,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("balance");
    expect(res.data.balance).toBe(20); // balance inicial
  });

  it("4. Execute operation (addition)", async () => {
    const res = await axios.post(
      `${API_GATEWAY}/operations/execute`,
      {
        type: "addition",
        operands: [5, 5],
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

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("result");
    expect(res.data.result).toBe("10.00");

    expect(res.data).toHaveProperty("newBalance");
    createdRecordId = res.data.recordId || null; // si tu service lo retorna
  });

  it("5. Get user records", async () => {
    const res = await axios.get(`${API_GATEWAY}/records`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Correlation-Id": uuidv4(),
        "X-User-Id": user.id,
        "Idempotency-Key": uuidv4(),
      },
    });

    expect(res.status).toBe(200);
    expect(res.data.records.length).toBeGreaterThan(0);

    // Guardamos un record para borrarlo
    createdRecordId = createdRecordId || res.data.records[0].id;
  });

  it("6. Soft delete a record", async () => {
    const res = await axios.delete(`${API_GATEWAY}/records/${createdRecordId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Correlation-Id": uuidv4(),
        "X-User-Id": user.id,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data.message).toBe("Record successfully deleted");
  });

  it("7. Export user records (S3)", async () => {
    const res = await axios.get(`${API_GATEWAY}/records/export`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Correlation-Id": uuidv4(),
        "X-User-Id": user.id,
      },
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("url");
    expect(res.data.url).toContain("amazonaws.com");
  });
});
