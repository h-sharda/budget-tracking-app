import { Save, Eye, EyeOff } from "lucide-react";
import { PasswordFormData } from "@/types/profile";

interface PasswordUpdateFormProps {
  formData: PasswordFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  showPassword: boolean;
  onTogglePasswordVisibility: () => void;
}

export function PasswordUpdateForm({
  formData,
  onInputChange,
  onSubmit,
  isSaving,
  showPassword,
  onTogglePasswordVisibility,
}: PasswordUpdateFormProps) {
  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordMismatch =
    formData.password && formData.confirmPassword && !passwordsMatch;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-900">Password</h3>
        <p className="text-gray-600 mt-1">
          Update your password (requires current password)
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={onInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={onTogglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
              placeholder="Confirm your new password"
              required
            />
            {showPasswordMismatch && (
              <p className="text-sm text-red-600 mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="passwordCurrentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                id="passwordCurrentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={onInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                placeholder="Enter your current password"
                required
              />
            </div>
            <p className="text-sm text-gray-500">
              Required to verify your identity for password changes
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
            {isSaving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
