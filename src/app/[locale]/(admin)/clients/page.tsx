import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ClientTable from "@/components/tables/ClientTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Clients | TailAdmin - Next.js CRM Dashboard",
  description:
    "Manage, track, and monitor CRM client accounts, contracts, and lifecycle statuses.",
};

export default function ClientsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Clients" />
      <div className="space-y-6">
        <ClientTable />
      </div>
    </div>
  );
}
