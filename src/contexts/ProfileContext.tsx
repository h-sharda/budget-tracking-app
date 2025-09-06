"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useProfile } from "@/hooks/useProfile";

interface ProfileData {
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

interface ProfileContextType {
  profileData: ProfileData | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const profile = useProfile();

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
}
