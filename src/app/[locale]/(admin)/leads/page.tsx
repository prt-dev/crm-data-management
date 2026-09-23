import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Leads | TailAdmin - Next.js CRM Dashboard",
  description:
    "Manage, track, and monitor incoming CRM leads, interest areas, and statuses.",
};

export default function LeadsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Leads" />
      <div className="space-y-6">
        <BasicTableOne />
      </div>
    </div>
  );
}
