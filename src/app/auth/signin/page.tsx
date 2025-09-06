import { AuthLayout, SignInForm } from "@/components/auth";

export default function SignIn() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue managing your budget"
      footerText="Don't have an account?"
      footerLink="/auth/signup"
      footerLinkText="Sign up for free"
    >
      <SignInForm />
    </AuthLayout>
  );
}
