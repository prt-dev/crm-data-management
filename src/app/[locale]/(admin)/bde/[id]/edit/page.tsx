import EditBdeClient from "@/components/bde/EditBdeClient";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Edit BDE Profile",
  description: "Update details and pipeline quota for the selected BDE.",
};

interface EditBdePageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EditBdePage({ params }: EditBdePageProps) {
  const { id } = await params;

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit BDE Profile" />
      <div className="space-y-6">
        <EditBdeClient id={id} />
      </div>
    </div>
  );
}
