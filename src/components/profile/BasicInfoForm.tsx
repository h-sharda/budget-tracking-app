import { Save } from "lucide-react";
import { getCurrencySymbol } from "@/lib/currency";
import { BasicFormData, CURRENCIES } from "@/types/profile";

interface BasicInfoFormProps {
  formData: BasicFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

export function BasicInfoForm({
  formData,
  onInputChange,
  onSubmit,
  isSaving,
}: BasicInfoFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-900">
          Basic Information
        </h3>
        <p className="text-gray-600 mt-1">
          Update your name, currency, and base balance
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700"
            >
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
              required
            >
              {CURRENCIES.map((currency) => (
                <option
                  key={currency.code}
                  value={currency.code}
                  className="text-gray-900"
                >
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <div className="space-y-2">
            <label
              htmlFor="baseBalance"
              className="block text-sm font-medium text-gray-700"
            >
              Base Balance
            </label>
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium">
                  {getCurrencySymbol(formData.currency)}
                </span>
              </div>
              <input
                type="number"
                id="baseBalance"
                name="baseBalance"
                step="0.01"
                value={formData.baseBalance}
                onChange={onInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                placeholder="0.00"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Basic Info"}
          </button>
        </div>
      </form>
    </div>
  );
}
