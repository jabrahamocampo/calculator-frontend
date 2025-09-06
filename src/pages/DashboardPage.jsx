import UserRecordsTable from "../components/UserRecordsTable";
import useDashboardPage from "../hooks/useDashboardPage";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const {
    user,
    balance,
    operations,
    selectedType,
    setSelectedType,
    operandsInput,
    setOperandsInput,
    execResult,
    execError,
    randomNum,
    setRandomNum,
    randomLen,
    setRandomLen,
    randomDigits,
    setRandomDigits,
    randomUpper,
    setRandomUpper,
    randomLower,
    setRandomLower,
    randomUnique,
    setRandomUnique,
    recordsRef,
    handleLogout,
    handleExecute,
  } = useDashboardPage();

  return (
    <div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      <main className="dashboard-main">
        <section className="dashboard-header">
          <p>
            <strong>Welcome,</strong> {user?.username || "user"}
          </p>
        </section>

        <section className="dashboard-cards">
          {/* Operations List */}
          <div className="card operations-card">
            <h3>Operation / Cost</h3>
            <div className="operations-list-container">
              <ul className="operations-list">
                {operations.map((op) => (
                  <li key={op.type}>
                    <span>{op.type}</span>
                    <span className="font-semibold text-blue-600">
                      ${op.cost}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card execute-card">
            <h3>Execute Operation</h3>

            <form onSubmit={handleExecute} className="space-y-4">
              <div>
                <label htmlFor="operationType" className="select-label">
                  Operation Type:
                  <span className="tooltip-icon">
                    ?
                    <span className="tooltip-text">
                      Keyboard shortcuts:
                      <br />( + ) Addition
                      <br />( - ) Subtraction
                      <br />( * ) Multiplication
                      <br />( / ) Division
                      <br />( r ) Square Root
                      <br />( a ) Random String
                      <br />( Enter ) Execute
                    </span>
                  </span>
                </label>
                <select
                  className="select-input"
                  id="operationType"
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    if (e.target.value === "random_string") {
                      setOperandsInput("");
                    }
                  }}
                  required
                >
                  <option value="">Operation...</option>
                  {operations.map((op) => (
                    <option key={op.type} value={op.type}>
                      {op.type}
                    </option>
                  ))}
                </select>
              </div>

              {selectedType !== "random_string" && (
                <div className="input-wrapper">
                  <label htmlFor="operands" className="input-label">
                    Instructions:
                    <span className="tooltip-icon">
                      ?
                      <span className="tooltip-text">
                        Use commas to separate operands. One value for square
                        root.
                      </span>
                    </span>
                  </label>
                  <input
                      value={operandsInput}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (!/^[0-9.,-]*$/.test(value)) {
                          return; 
                        }
                        const valid = value
                          .split(",")
                          .map((num) => {
                            if ((num.match(/-/g) || []).length > 1) return null;
                            if (num.includes("-") && !num.startsWith("-")) return null;
                            if ((num.match(/\./g) || []).length > 1) return null;

                            return num;
                          })
                          .every((n) => n !== null);
                        if (valid) {
                          setOperandsInput(value);
                        }
                      }}
                      required={selectedType !== "random_string"}
                      disabled={selectedType === "random_string"}
                      type="text"
                      id="operands"
                      placeholder="e.g. 5, -10.5, 3"
                      className="text-input focus:ring-2 focus:ring-blue-500"
                    />
                </div>
              )}

              {selectedType === "random_string" && (
                <div className="space-y-2">
                  <div>
                    <label className="input-label">Number of Strings</label>
                    <input
                      type="number"
                      value={randomNum}
                      onChange={(e) => setRandomNum(parseInt(e.target.value))}
                      className="text-input focus:ring-2 focus:ring-blue-500"
                      min={1}
                      max={4}
                    />
                  </div>

                  <div>
                    <label className="input-label">Length</label>
                    <input
                      type="number"
                      value={randomLen}
                      onChange={(e) => setRandomLen(parseInt(e.target.value))}
                      className="text-input focus:ring-2 focus:ring-blue-500"
                      min={1}
                      max={20}
                    />
                  </div>

                  <div>
                    <label className="input-label">
                      <input
                        type="checkbox"
                        checked={randomDigits}
                        onChange={(e) => setRandomDigits(e.target.checked)}
                        className="mr-2"
                      />
                      Include Digits
                    </label>
                  </div>

                  <div>
                    <label className="input-label">
                      <input
                        type="checkbox"
                        checked={randomUpper}
                        onChange={(e) => setRandomUpper(e.target.checked)}
                        className="mr-2"
                      />
                      Uppercase Letters
                    </label>
                  </div>

                  <div>
                    <label className="input-label">
                      <input
                        type="checkbox"
                        checked={randomLower}
                        onChange={(e) => setRandomLower(e.target.checked)}
                        className="mr-2"
                      />
                      Lowercase Letters
                    </label>
                  </div>

                  <div>
                    <label className="input-label">
                      <input
                        type="checkbox"
                        checked={randomUnique}
                        onChange={(e) => setRandomUnique(e.target.checked)}
                        className="mr-2"
                      />
                      Unique Strings
                    </label>
                  </div>
                </div>
              )}

              <button type="submit" className="execute-button">
                Execute
              </button>
            </form>
          </div>

          <div className="card balance-card">
            <h3>Current Balance</h3>
            <p className="balance-amount">${balance}</p>

            {execError && <p className="resultError">{execError.message || execError}</p>}
            {execResult && (
              <div className="balance-card-results">
                <p>Operation Result: {execResult.result}</p>
                <p>Operation Cost: ${execResult.cost}</p>
                <p>New Balance: ${execResult.newBalance}</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <div id="records">
            <UserRecordsTable ref={recordsRef} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
