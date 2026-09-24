"use client";

import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import TechnicianForm from "@/components/technicians/TechnicianForm";

export default function CreateTechnicianPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        pageTitle="Register Field Inspection Engineer"
        items={[
          { label: "Admin Portal", href: "/dashboard" },
          { label: "Field Technicians", href: "/technicians" },
          { label: "New Inspector Onboarding" },
        ]}
      />

      <TechnicianForm isEdit={false} />
    </div>
  );
}
