import { AuthLayout, SignUpForm } from "@/components/auth";

export default function SignUp() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of users managing their finances with BudgetTracker"
      footerText="Already have an account?"
      footerLink="/auth/signin"
      footerLinkText="Sign in here"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
