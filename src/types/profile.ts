export interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  baseBalance: number;
  currency: string;
  netBalance: number;
  totalIncome: number;
  totalExpenses: number;
  createdAt: string;
  updatedAt: string;
}

export interface BasicFormData {
  name: string;
  baseBalance: number;
  currency: string;
}

export interface EmailFormData {
  email: string;
  currentPassword: string;
}

export interface PasswordFormData {
  password: string;
  confirmPassword: string;
  currentPassword: string;
}

export interface SavingState {
  basic: boolean;
  email: boolean;
  password: boolean;
}

export const CURRENCIES = [
  { code: "INR", name: "Indian Rupee" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "KRW", name: "South Korean Won" },
  { code: "RUB", name: "Russian Ruble" },
];
