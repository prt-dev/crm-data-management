"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { useRouter } from "@/i18n/navigation";
import { bdeService } from "@/services/bdeService";
import { CreateBdeDTO } from "@/types/bde";
import React, { useState } from "react";
import BdeForm from "./BdeForm";

export default function CreateBdeClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreate = async (data: CreateBdeDTO) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await bdeService.createBde(data);
      router.push("/bde");
    } catch (err: unknown) {
      console.error("Failed to create BDE record:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while saving the BDE record."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <ComponentCard
      title="Executive Information Form"
      desc="Fill in the required information to onboard a new Business Development Executive into the CRM pipeline."
    >
      {errorMessage && (
        <div className="mb-6 rounded-lg bg-error-50 p-4 text-theme-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
          {errorMessage}
        </div>
      )}

      <BdeForm
        onSubmit={handleCreate}
        isEdit={false}
        isSubmitting={isSubmitting}
      />
    </ComponentCard>
  );
}
