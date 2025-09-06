import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useAxiosAuth from "./useAxiosAuth";
import useKeyboardShortcuts from "./useKeyboardShortcuts";

export default function useDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const axiosAuth = useAxiosAuth();

  const [balance, setBalance] = useState(null);
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState("");
  const [operandsInput, setOperandsInput] = useState("");
  const [execResult, setExecResult] = useState(null);
  const [execError, setExecError] = useState("");
  const recordsRef = useRef(null);
  const selectRef = useRef(null);

  const [randomNum, setRandomNum] = useState(1);
  const [randomLen, setRandomLen] = useState(5);
  const [randomDigits, setRandomDigits] = useState(false);
  const [randomUpper, setRandomUpper] = useState(false);
  const [randomLower, setRandomLower] = useState(false);
  const [randomUnique, setRandomUnique] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchRecords = async () => {
    recordsRef.current?.refresh();
  };

  const handleExpiredToken = () => {
    alert("Your session has expired. You will be redirected to the login page.");
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setOperandsInput("");
  }, [selectedType]);

  useEffect(() => {
    if (user?.id) {
      const fetchBalance = async () => {
        try {
          const res = await axiosAuth.get(`/balance/${user.id}`);
          setBalance(res.data.balance);
        } catch (err) {
          if (err.response?.status === 401) {
            handleExpiredToken();
          }
        } finally {
          setLoading(false);
        }
      };
      fetchBalance();
    }
  }, [user]);

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const res = await axiosAuth.get(`/operations/list`);
        setOperations(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          handleExpiredToken();
        }
      }
    };
    fetchOperations();
  }, []);

  const handleExecute = async (e) => {
    if (e) e.preventDefault();
    setExecError("");
    setExecResult(null);

    if (selectedType === "random_string") setOperandsInput("");

    try {
      const body =
        selectedType === "random_string"
          ? {
              type: "random_string",
              params: {
                num: Math.min(randomNum, 3),
                len: Math.min(randomLen, 20),
                digits: randomDigits ? "on" : "off",
                upperalpha: randomUpper ? "on" : "off",
                loweralpha: randomLower ? "on" : "off",
                unique: randomUnique ? "on" : "off",
                format: "plain",
                rnd: "new",
              },
            }
          : {
              type: selectedType,
              operands: operandsInput
                  .split(",")
                  .map((n) => n.trim())
                  .filter((n) => n !== "")
                  .map((n) => parseFloat(n)),
            };

      const res = await axiosAuth.post("/operations/execute", body);
      setExecResult(res.data);

      const updatedBalance = await axiosAuth.get(`/balance/${user.id}`);
      setBalance(updatedBalance.data.balance);

      await fetchRecords();
    } catch (err) {
      if (err.response?.status === 401) {
        handleExpiredToken();
      } else {
        setExecError(err.response?.data || "Unexpected error");
      }
    }
  };

  useKeyboardShortcuts({
    setSelectedType,
    handleSquareRoot: () => setSelectedType("square_root"),
    handleRandomString: () => setSelectedType("random_string"),
    handleExecute,
    selectRef,
  });

  return {
    user,
    balance,
    operations,
    loading,
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
    selectRef,
    handleLogout,
    handleExecute,
  };
}
