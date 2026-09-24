"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import ClientForm from "@/components/clients/ClientForm";
import { clientService } from "@/services/clientService";
import { ClientItem } from "@/types/client";
import Button from "@/components/ui/Button";

export default function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const clientId = resolvedParams.id;
  const [client, setClient] = useState<ClientItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      try {
        setLoading(true);
        const data = await clientService.getClientById(clientId);
        if (data) {
          setClient(data);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching client:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-theme-sm border border-gray-100 dark:border-gray-800 dark:bg-gray-900">
          <img
            src="/images/logo/nleta-logo.png"
            alt="Loading"
            className="h-10 w-10 animate-pulse object-contain"
          />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Loading client record...
        </p>
      </div>
    );
  }

  if (notFound || !client) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          pageTitle="Client Not Found"
          items={[
            { label: "Admin Portal", href: "/dashboard" },
            { label: "Clients", href: "/clients" },
            { label: "Not Found" },
          ]}
        />
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Client &ldquo;{clientId}&rdquo; Not Found
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            This client record may have been deleted or the link is invalid.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/clients">
              <Button variant="primary">Return to Clients</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        pageTitle={`Edit Client: ${client.companyName} (${client.id})`}
        items={[
          { label: "Admin Portal", href: "/dashboard" },
          { label: "Clients Portfolio", href: "/clients" },
          { label: `Edit ${client.id}` },
        ]}
        actions={
          <Link href="/clients">
            <Button variant="outline" size="sm">
              Back to Clients
            </Button>
          </Link>
        }
      />

      <ClientForm initialClient={client} isEdit={true} />
    </div>
  );
}
