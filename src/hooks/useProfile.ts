import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

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

export function useProfile() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/profile");

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setError(null);
      } else {
        setError("Failed to load profile data");
        setProfileData(null);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const refreshProfile = useCallback(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [fetchProfile, session?.user?.id]);

  useEffect(() => {
    // Only fetch profile when session is loaded and user is authenticated
    if (status === "loading") {
      setLoading(true);
      setError(null);
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError(null);
      setProfileData(null);
    } else if (status === "authenticated" && session?.user?.id) {
      fetchProfile();
    }
  }, [status, session?.user?.id, fetchProfile]);

  return {
    profileData,
    loading,
    error,
    refreshProfile,
  };
}
