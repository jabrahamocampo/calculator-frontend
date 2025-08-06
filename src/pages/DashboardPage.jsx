import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useAxiosAuth from "../hooks/useAxiosAuth";
import UserRecordsTable from "../components/UserRecordsTable";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const axiosAuth = useAxiosAuth();

  const [balance, setBalance] = useState(null);
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState('');
  const [operandsInput, setOperandsInput] = useState('');
  const [execResult, setExecResult] = useState(null);
  const [execError, setExecError] = useState('');

  const recordsRef = useRef(null);
  const fetchRecords = async () => {
    recordsRef.current?.refresh();
  };

  const handleExpiredToken = () => {
    alert("Tu sesión ha expirado. Serás redirigido al inicio de sesión.");
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user?.id) {
      const fetchBalance = async () => {
        try {
          const res = await axiosAuth.get(`/balance/${user.id}`);
          setBalance(res.data.balance);
        } catch (err) {
          if (err.response?.status === 401) {
            console.log(err.response);
           // handleExpiredToken();
          }
        } finally {
          setLoading(false);
        }
      };
      fetchBalance();
    }
  }, [user]);

/*  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const res = await axiosAuth.get(`/operations/list`);
        setOperations(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          console.log(err.response);
         // handleExpiredToken();
        }
      }
    };
    fetchOperations();
  }, []);  */

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

/*  const handleExecute = async (e) => {
    e.preventDefault();
    setExecError('');
    setExecResult(null);

    try {
      const body = {
        type: selectedType,
        operands: operandsInput.split(',').map((n) => parseFloat(n.trim()))
      };
      const res = await axiosAuth.post('/operations/execute', body);
      setExecResult(res.data);

      const updatedBalance = await axiosAuth.get(`/balance/${user.id}`);
      setBalance(updatedBalance.data.balance);

      await fetchRecords();
    } catch (err) {
      if (err.response?.status === 401) {
        console.log(err.response);
        //handleExpiredToken();
      } else {
        setExecError(err.response?.data?.error || 'Unexpected error');
      }
    }
  };  */

  return (
    <div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      <main className="dashboard-main">
        <section className="dashboard-header">
          <p><strong>Welcome,</strong> {user?.username || "user"}</p>
        </section>

        <section className="dashboard-cards">
          <div className="card operations-card">
            <h3>Operation / Cost</h3>
            <ul className="operations-list">
              {operations.map((op) => (
                <li key={op.type}>
                  <span>{op.type}</span>
                  <span className="font-semibold text-blue-600">${op.cost}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card execute-card">
            <h3>Execute Operation</h3>
            <form onSubmit={handleExecute} className="space-y-4">
              <div>
                <label htmlFor="operationType" className="select-label">Type:</label>
                <select
                  id="operationType"
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    if (e.target.value === 'random_string') {
                      setOperandsInput('');
                    }
                  }}
                  required
                  className="select-input"
                >
                  <option value="">Operation...</option>
                  {operations.map((op) => (
                    <option key={op.type} value={op.type}>
                      {op.type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-wrapper">
                <label htmlFor="operands" className="input-label">
                  Instructions:
                  <span className="tooltip-icon">?
                    <span className="tooltip-text">
                      Use commas to separate operands. One value for square root. Leave empty for random string.
                    </span>
                  </span>
                </label>
                <input
                  value={operandsInput}
                  onChange={(e) => setOperandsInput(e.target.value)}
                  required={selectedType !== 'random_string'}
                  disabled={selectedType === 'random_string'}
                  type="text"
                  id="operands"
                  placeholder="e.g. 5,10"
                  className="text-input"
                />
              </div>
              <button type="submit" className="execute-button">Execute</button>
            </form>
          </div>

          <div className="card balance-card">
            <h3>Current Balance</h3>
            <p className="balance-amount">${balance}</p>

            {execError && <p className="resultError">{execError}</p>}
            {execResult && (
              <div className="mt-4 space-y-1">
                <p>Operation Result: <strong>{execResult.result}</strong></p>
                <p>Operation Cost: ${execResult.cost}</p>
                <p>New Balance: ${execResult.newBalance}</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <div id="records">
         <!--   <UserRecordsTable ref={recordsRef} /> -->
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
