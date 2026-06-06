import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/transactions`, { params });
      setTransactions(res.data);
    } catch { toast.error('Failed to fetch transactions'); }
    finally { setLoading(false); }
  }, []);

  const addTransaction = async (data) => {
    const res = await axios.post(`${API}/transactions`, data);
    setTransactions(prev => [res.data, ...prev]);
    toast.success('Transaction added!');
    return res.data;
  };

  const deleteTransaction = async (id) => {
    await axios.delete(`${API}/transactions/${id}`);
    setTransactions(prev => prev.filter(t => t._id !== id));
    toast.success('Transaction deleted');
  };

  const fetchBudgets = useCallback(async (month, year) => {
    const res = await axios.get(`${API}/budgets`, { params: { month, year } });
    setBudgets(res.data);
  }, []);

  const saveBudget = async (data) => {
    const res = await axios.post(`${API}/budgets`, data);
    toast.success('Budget saved!');
    return res.data;
  };

  const fetchSummary = useCallback(async (year) => {
    const res = await axios.get(`${API}/transactions/summary`, { params: { year } });
    setSummary(res.data);
  }, []);

  const fetchCategoryData = useCallback(async (month, year) => {
    const res = await axios.get(`${API}/transactions/by-category`, { params: { month, year } });
    setCategoryData(res.data);
  }, []);

  const getInsights = async () => {
    const res = await axios.post(`${API}/insights/analyze`);
    return res.data;
  };

  return (
    <FinanceContext.Provider value={{
      transactions, budgets, summary, categoryData, loading,
      fetchTransactions, addTransaction, deleteTransaction,
      fetchBudgets, saveBudget, fetchSummary, fetchCategoryData, getInsights,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
