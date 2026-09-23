import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account to manage your CRM data with Nleta CRM.",
};

export default function SignUp() {
  return <SignUpForm />;
}
