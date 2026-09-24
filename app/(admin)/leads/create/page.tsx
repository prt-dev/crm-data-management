"use client";

import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import LeadForm from "@/components/leads/LeadForm";

export default function CreateLeadPage() {
  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <Breadcrumb
        pageTitle="Register New Inspection Lead"
        items={[
          { label: "Admin Portal", href: "/dashboard" },
          { label: "Leads Pipeline", href: "/leads" },
          { label: "New Lead Registration" },
        ]}
      />

      {/* Lead Form */}
      <LeadForm isEdit={false} />
    </div>
  );
}
