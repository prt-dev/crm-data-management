import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to access your Nleta CRM dashboard and customer data.",
};

export default function SignIn() {
  return <SignInForm />;
}
