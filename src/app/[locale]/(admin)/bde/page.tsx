import BdeDirectoryManager from "@/components/bde/BdeDirectoryManager";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Business Development Executives (BDE)",
  description:
    "Manage, track, and monitor BDE sales representatives, quota attainment, territories, and lead conversions in Nleta CRM.",
};

export default function BdePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="BDE Management" />
      <BdeDirectoryManager />
    </div>
  );
}
