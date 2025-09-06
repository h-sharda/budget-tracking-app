import { Save, Eye, EyeOff } from "lucide-react";
import { EmailFormData } from "@/types/profile";

interface EmailUpdateFormProps {
  formData: EmailFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  showCurrentPassword: boolean;
  onTogglePasswordVisibility: () => void;
}

export function EmailUpdateForm({
  formData,
  onInputChange,
  onSubmit,
  isSaving,
  showCurrentPassword,
  onTogglePasswordVisibility,
}: EmailUpdateFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-900">Email Address</h3>
        <p className="text-gray-600 mt-1">
          Update your email address (requires current password)
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              New Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
              placeholder="Enter your new email address"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="emailCurrentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="emailCurrentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={onInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={onTogglePasswordVisibility}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Required to verify your identity for email changes
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Updating..." : "Update Email"}
          </button>
        </div>
      </form>
    </div>
  );
}
