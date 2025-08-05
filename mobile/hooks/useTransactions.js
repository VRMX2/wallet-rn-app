import { useCallback, useState } from "react";
import {Alert} from 'react-native';

const API_URL = "http://localhost:9001/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setLoading] = useState(true);

  // Fetch transactions list
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  }, [userId]);

  // Fetch summary
  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary", error);
    }
  }, [userId]);

  // Load both in parallel
  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchTransactions, fetchSummary]);


	const deleteTransactions = async(id) => {
		try{
			const response = await fetch(`${API_URL}/transactions/${id}`, {method: "DELETE"});
			if(!response.ok) throw new Error("Failed to delete transaction");

			loadData();
            Alert.alert("Success","Transaction deleted successfully");
		}
		catch(error){
			console.error("Error deleting transaction", error);
			Alert.alert("Error", error.message);
		}
	}
  // Auto load when userId changes
 

	return {
    transactions,
    summary,
	isLoading,
	loadData,
	deleteTransactions
	};
};
