import CreateBdeClient from "@/components/bde/CreateBdeClient";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Add New BDE",
  description:
    "Register and onboard a new Business Development Executive into the CRM pipeline.",
};

export default function CreateBdePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add New BDE" />
      <div className="space-y-6">
        <CreateBdeClient />
      </div>
    </div>
  );
}
