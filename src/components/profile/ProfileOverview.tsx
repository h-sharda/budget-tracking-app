import { User, Shield } from "lucide-react";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";
import { ProfileData } from "@/types/profile";

interface ProfileOverviewProps {
  profileData: ProfileData;
}

export function ProfileOverview({ profileData }: ProfileOverviewProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-9 gap-6">
        {/* Base Balance */}
        <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Base Balance
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(profileData.baseBalance, profileData.currency)}
              </p>
            </div>
            <div className="bg-green-100 rounded-xl p-3">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Net Balance */}
        <div className="md:col-span-4 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Net Balance
              </p>
              <p
                className={`text-2xl font-bold ${
                  profileData.netBalance >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(profileData.netBalance, profileData.currency)}
              </p>

              {/* Income and Expense breakdown */}
              <div className="flex items-start space-x-2 mt-3">
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-green-600">
                    +{" "}
                    {formatCurrency(
                      profileData.totalIncome,
                      profileData.currency
                    )}
                  </span>
                  {/* Base amount */}
                  <div className="flex items-center justify-end w-full">
                    <span className="text-sm font-semibold text-gray-500">
                      +{" "}
                      {formatCurrency(
                        profileData.baseBalance,
                        profileData.currency
                      )}
                    </span>
                  </div>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-start">
                  <span className="font-semibold text-red-600">
                    -{" "}
                    {formatCurrency(
                      profileData.totalExpenses,
                      profileData.currency
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 rounded-xl p-3 ml-4">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Currency */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Currency</p>
              <p className="text-2xl font-bold text-gray-900">
                {profileData.currency}
              </p>
              <p className="text-5xl text-gray-500">
                {getCurrencySymbol(profileData.currency)}
              </p>
            </div>
            <div className="bg-purple-100 rounded-xl p-3">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
