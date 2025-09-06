"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { formatCurrency } from "@/lib/currency";
import { useTransactions } from "@/hooks/useTransactions";
import {
  TransactionFiltersComponent,
  TransactionsTable,
  EditTransactionModal,
} from "@/components/transactions";

export default function Transactions() {
  const {
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
  } = useTransactions();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-800">
              Manage your income and expense transactions
            </p>
          </div>
          <Link
            href="/transactions/new"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Link>
        </div>

        {/* Filters */}
        <TransactionFiltersComponent
          filters={filters}
          availableYears={availableYears}
          yearsLoading={yearsLoading}
          currentYear={currentYear}
          onFiltersChange={updateFilters}
          onClearFilters={clearFilters}
        />

        {/* Transactions Table */}
        <TransactionsTable
          transactions={transactions}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Edit Modal */}
      {showEditModal && editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete this ${deletingTransaction?.type.toLowerCase()} transaction of ${
          deletingTransaction
            ? formatCurrency(deletingTransaction.amount, "INR")
            : ""
        }?`}
        confirmText="Delete"
        variant="danger"
      />
    </DashboardLayout>
  );
}
