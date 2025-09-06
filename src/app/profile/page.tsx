"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useProfileContext } from "@/contexts/ProfileContext";
import {
  ProfileOverview,
  BasicInfoForm,
  EmailUpdateForm,
  PasswordUpdateForm,
  DangerZone,
} from "@/components/profile";
import {
  ProfileData,
  BasicFormData,
  EmailFormData,
  PasswordFormData,
  SavingState,
} from "@/types/profile";
import toast from "react-hot-toast";

export default function Profile() {
  const { profileData, loading, refreshProfile } = useProfileContext();
  const [localProfileData, setLocalProfileData] = useState<ProfileData | null>(
    null
  );
  const [saving, setSaving] = useState<SavingState>({
    basic: false,
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form states for different sections
  const [basicFormData, setBasicFormData] = useState<BasicFormData>({
    name: "",
    baseBalance: 0,
    currency: "INR",
  });

  const [emailFormData, setEmailFormData] = useState<EmailFormData>({
    email: "",
    currentPassword: "",
  });

  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    password: "",
    confirmPassword: "",
    currentPassword: "",
  });

  // Delete confirmation state
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    if (profileData) {
      setLocalProfileData(profileData);
      setBasicFormData({
        name: profileData.name || "",
        baseBalance: profileData.baseBalance,
        currency: profileData.currency,
      });
      setEmailFormData({
        email: profileData.email,
        currentPassword: "",
      });
      setPasswordFormData({
        password: "",
        confirmPassword: "",
        currentPassword: "",
      });
    }
  }, [profileData]);

  const handleBasicInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBasicFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving((prev) => ({ ...prev, basic: true }));

    try {
      const response = await fetch("/api/profile/basic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(basicFormData),
      });

      if (response.ok) {
        toast.success("Basic information updated successfully");
        refreshProfile(); // Refresh profile data
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update basic information");
      }
    } catch (error) {
      console.error("Error updating basic information:", error);
      toast.error("Failed to update basic information");
    } finally {
      setSaving((prev) => ({ ...prev, basic: false }));
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving((prev) => ({ ...prev, email: true }));

    try {
      const response = await fetch("/api/profile/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailFormData),
      });

      if (response.ok) {
        toast.success("Email updated successfully");
        refreshProfile(); // Refresh profile data

        // Clear password field
        setEmailFormData((prev) => ({
          ...prev,
          currentPassword: "",
        }));
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update email");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email");
    } finally {
      setSaving((prev) => ({ ...prev, email: false }));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving((prev) => ({ ...prev, password: true }));

    // Validate password confirmation
    if (passwordFormData.password !== passwordFormData.confirmPassword) {
      toast.error("Passwords do not match");
      setSaving((prev) => ({ ...prev, password: false }));
      return;
    }

    try {
      const response = await fetch("/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordFormData),
      });

      if (response.ok) {
        toast.success("Password updated successfully");

        // Clear password fields
        setPasswordFormData({
          password: "",
          confirmPassword: "",
          currentPassword: "",
        });
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setSaving((prev) => ({ ...prev, password: false }));
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your current password");
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword: deletePassword }),
      });

      if (response.ok) {
        toast.success("Account deleted successfully");
        // Redirect to sign in page
        window.location.href = "/auth/signin";
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDeletePassword("");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg text-gray-900">Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!localProfileData && !loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg text-gray-600">
            Failed to load profile data
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // This should not happen due to the check above, but TypeScript needs this
  if (!localProfileData) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="space-y-8">
            {/* Profile Overview */}
            <ProfileOverview profileData={localProfileData} />

            {/* Basic Information Form */}
            <BasicInfoForm
              formData={basicFormData}
              onInputChange={handleBasicInputChange}
              onSubmit={handleBasicSubmit}
              isSaving={saving.basic}
            />

            {/* Email Update Form */}
            <EmailUpdateForm
              formData={emailFormData}
              onInputChange={handleEmailInputChange}
              onSubmit={handleEmailSubmit}
              isSaving={saving.email}
              showCurrentPassword={showCurrentPassword}
              onTogglePasswordVisibility={() =>
                setShowCurrentPassword(!showCurrentPassword)
              }
            />

            {/* Password Update Form */}
            <PasswordUpdateForm
              formData={passwordFormData}
              onInputChange={handlePasswordInputChange}
              onSubmit={handlePasswordSubmit}
              isSaving={saving.password}
              showPassword={showPassword}
              onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
            />

            {/* Danger Zone */}
            <DangerZone
              onDeleteClick={() => setShowDeleteModal(true)}
              showDeleteModal={showDeleteModal}
              onCloseModal={() => setShowDeleteModal(false)}
              onConfirmDelete={handleDeleteAccount}
              deletePassword={deletePassword}
              onPasswordChange={setDeletePassword}
              isDeleting={deleting}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
