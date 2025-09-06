import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Transaction, TransactionFilters } from "@/types/transaction";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({
    month: "",
    year: "",
    type: "",
    category: "",
    sortBy: "date",
    sortOrder: "desc",
  });
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [yearsLoading, setYearsLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  const fetchTransactions = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      // If month is selected but year is not, default to current year
      if (filters.month && !filters.year) {
        params.append("month", filters.month);
        params.append("year", currentYear.toString());
      } else {
        // Normal behavior: only add filters if they have values
        if (filters.month) params.append("month", filters.month);
        if (filters.year) params.append("year", filters.year);
      }

      if (filters.type) params.append("type", filters.type);
      if (filters.category) params.append("category", filters.category);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

      const response = await fetch(`/api/transactions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        toast.error("Failed to load transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentYear]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Fetch available years
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await fetch("/api/dashboard/years");
        if (response.ok) {
          const data = await response.json();
          setAvailableYears(data.years);
        } else {
          // Fallback to current year if API fails
          setAvailableYears([currentYear]);
        }
      } catch (error) {
        console.error("Error fetching available years:", error);
        // Fallback to current year if API fails
        setAvailableYears([currentYear]);
      } finally {
        setYearsLoading(false);
      }
    };

    fetchAvailableYears();
  }, [currentYear]);

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingTransaction) return;

    try {
      const response = await fetch(
        `/api/transactions/${deletingTransaction.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setTransactions(
          transactions.filter((t) => t.id !== deletingTransaction.id)
        );
        toast.success("Transaction deleted successfully");
      } else {
        toast.error("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    } finally {
      setShowDeleteModal(false);
      setDeletingTransaction(null);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedTransaction: Transaction) => {
    try {
      const response = await fetch(
        `/api/transactions/${updatedTransaction.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTransaction),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setTransactions(
          transactions.map((t) => (t.id === updated.id ? updated : t))
        );
        setShowEditModal(false);
        setEditingTransaction(null);
        toast.success("Transaction updated successfully");
      } else {
        toast.error("Failed to update transaction");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    }
  };

  const clearFilters = () => {
    setFilters({
      month: "",
      year: "",
      type: "",
      category: "",
      sortBy: "date",
      sortOrder: "desc",
    });
  };

  const updateFilters = (newFilters: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    transactions,
    loading,
    filters,
    editingTransaction,
    showEditModal,
    deletingTransaction,
    showDeleteModal,
    availableYears,
    yearsLoading,
    currentYear,
    setShowEditModal,
    setShowDeleteModal,
    handleDelete,
    confirmDelete,
    handleEdit,
    handleUpdate,
    clearFilters,
    updateFilters,
  };
}
