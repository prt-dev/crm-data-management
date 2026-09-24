"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Link, useRouter } from "@/i18n/navigation";
import { bdeService } from "@/services/bdeService";
import { BDE, CreateBdeDTO } from "@/types/bde";
import React, { useEffect, useState } from "react";
import BdeForm from "./BdeForm";

interface EditBdeClientProps {
  id: string;
}

export default function EditBdeClient({ id }: EditBdeClientProps) {
  const router = useRouter();
  const [bde, setBde] = useState<BDE | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadBde() {
      try {
        setLoading(true);
        const data = await bdeService.getBdeById(id);
        setBde(data);
      } catch (err) {
        console.error("Failed to load BDE record:", err);
        setErrorMessage("Failed to load BDE details.");
      } finally {
        setLoading(false);
      }
    }
    loadBde();
  }, [id]);

  const handleUpdate = async (data: CreateBdeDTO) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await bdeService.updateBde(id, data);
      router.push("/bde");
    } catch (err: unknown) {
      console.error("Failed to update BDE:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while updating the BDE record."
      );
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ComponentCard title="Loading Executive Details...">
        <div className="py-12 text-center text-theme-sm text-gray-500 dark:text-gray-400">
          Loading executive profile for ID: {id}...
        </div>
      </ComponentCard>
    );
  }

  if (!bde) {
    return (
      <ComponentCard title="Executive Not Found">
        <div className="py-8 text-center">
          <p className="text-theme-sm text-error-500 mb-4">
            Could not find an executive record matching ID &quot;{id}&quot;.
          </p>
          <Link href="/bde">
            <Button variant="outline" size="sm">
              Return to BDE Directory
            </Button>
          </Link>
        </div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard
      title={`Edit Executive Profile — ${bde.name} (${bde.bdeId})`}
      desc="Update territorial assignments, contact credentials, or performance quota metrics."
    >
      {errorMessage && (
        <div className="mb-6 rounded-lg bg-error-50 p-4 text-theme-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
          {errorMessage}
        </div>
      )}

      <BdeForm
        initialData={bde}
        onSubmit={handleUpdate}
        isEdit={true}
        isSubmitting={isSubmitting}
      />
    </ComponentCard>
  );
}
