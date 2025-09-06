import { Trash2 } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface DangerZoneProps {
  onDeleteClick: () => void;
  showDeleteModal: boolean;
  onCloseModal: () => void;
  onConfirmDelete: () => void;
  deletePassword: string;
  onPasswordChange: (password: string) => void;
  isDeleting: boolean;
}

export function DangerZone({
  onDeleteClick,
  showDeleteModal,
  onCloseModal,
  onConfirmDelete,
  deletePassword,
  onPasswordChange,
  isDeleting,
}: DangerZoneProps) {
  return (
    <>
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
        <div className="flex items-start space-x-4">
          <div className="bg-red-100 rounded-xl p-3">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Danger Zone
            </h3>
            <p className="text-red-700 mb-6">
              Once you delete your account, there is no going back. Please be
              certain. This will permanently delete all your transactions and
              data.
            </p>
            <button
              onClick={onDeleteClick}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={onCloseModal}
        onConfirm={onConfirmDelete}
        title="Delete Account"
        message="This action cannot be undone. This will permanently delete your account and all associated data. Please enter your current password to confirm."
        confirmText="Delete Account"
        variant="danger"
        isLoading={isDeleting}
      >
        <div className="mt-6">
          <label
            htmlFor="deletePassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Current Password
          </label>
          <input
            type="password"
            id="deletePassword"
            value={deletePassword}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-400"
            placeholder="Enter your current password"
          />
        </div>
      </ConfirmationModal>
    </>
  );
}
