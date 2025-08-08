// hooks/useTransactions.js
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWithAuth = async (url) => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  const fetchTransactions = useCallback(async () => {
    try {
      if (!userId) return;
      
      const data = await fetchWithAuth(`${API_URL}/transactions/user/${userId}`);
      setTransactions(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions. Please try again later.");
      setTransactions([]);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      if (!userId) return;
      
      const data = await fetchWithAuth(`${API_URL}/transactions/summary/${userId}`);
      setSummary(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setError("Failed to load summary data. Please try again later.");
      setSummary({
        balance: 0,
        income: 0,
        expenses: 0,
      });
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchTransactions, fetchSummary]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to delete transaction"
        );
      }

      await loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to delete transaction. Please try again."
      );
    }
  };

  return {
    transactions,
    summary,
    isLoading,
    error,
    loadData,
    deleteTransaction,
  };
};