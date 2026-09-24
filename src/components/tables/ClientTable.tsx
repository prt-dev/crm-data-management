"use client";

import React, { useMemo, useState } from "react";
import Badge from "../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Pagination from "./Pagination";

export interface ClientItem {
  id: number;
  clientId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  city: string;
  state: string;
  accountManager: string;
  contractValue: string;
  status: "Active" | "Onboarding" | "Pending Renewal" | "Inactive";
}

const clientData: ClientItem[] = [
  {
    id: 1,
    clientId: "CL-3011",
    companyName: "Apex Global Tech",
    contactPerson: "Marcus Vance",
    email: "marcus@apextech.io",
    phone: "+1 (555) 321-9876",
    industry: "SaaS & Cloud",
    city: "Austin",
    state: "TX",
    accountManager: "Sarah Jenkins",
    contractValue: "$84,000/yr",
    status: "Active",
  },
  {
    id: 2,
    clientId: "CL-3012",
    companyName: "BioHealth Diagnostics",
    contactPerson: "Elena Rostova",
    email: "elena.r@biohealth.org",
    phone: "+1 (555) 432-8765",
    industry: "Healthcare",
    city: "Boston",
    state: "MA",
    accountManager: "Michael Chang",
    contractValue: "$120,000/yr",
    status: "Active",
  },
  {
    id: 3,
    clientId: "CL-3013",
    companyName: "Horizon Financial Partners",
    contactPerson: "David Sterling",
    email: "d.sterling@horizonfin.com",
    phone: "+1 (555) 654-2109",
    industry: "Financial Services",
    city: "New York",
    state: "NY",
    accountManager: "Emily Davis",
    contractValue: "$96,000/yr",
    status: "Pending Renewal",
  },
  {
    id: 4,
    clientId: "CL-3014",
    companyName: "Vanguard Logistics",
    contactPerson: "Rachel Green",
    email: "rachel@vanguardlog.com",
    phone: "+1 (555) 789-0123",
    industry: "Supply Chain",
    city: "Chicago",
    state: "IL",
    accountManager: "Sarah Jenkins",
    contractValue: "$62,000/yr",
    status: "Onboarding",
  },
  {
    id: 5,
    clientId: "CL-3015",
    companyName: "Nova Retail Systems",
    contactPerson: "Carlos Mendez",
    email: "cmendez@novaretail.net",
    phone: "+1 (555) 234-5678",
    industry: "E-Commerce",
    city: "Miami",
    state: "FL",
    accountManager: "Michael Chang",
    contractValue: "$48,000/yr",
    status: "Active",
  },
  {
    id: 6,
    clientId: "CL-3016",
    companyName: "Starlight Media Group",
    contactPerson: "Chloe Bennett",
    email: "chloe@starlightmedia.com",
    phone: "+1 (555) 876-5432",
    industry: "Digital Media",
    city: "Los Angeles",
    state: "CA",
    accountManager: "Emily Davis",
    contractValue: "$75,000/yr",
    status: "Onboarding",
  },
  {
    id: 7,
    clientId: "CL-3017",
    companyName: "Summit Energy Solutions",
    contactPerson: "Arthur Pendelton",
    email: "apendelton@summitenergy.io",
    phone: "+1 (555) 345-6789",
    industry: "Clean Energy",
    city: "Denver",
    state: "CO",
    accountManager: "Sarah Jenkins",
    contractValue: "$110,000/yr",
    status: "Active",
  },
  {
    id: 8,
    clientId: "CL-3018",
    companyName: "Pinnacle Architecture",
    contactPerson: "Liam O'Connor",
    email: "loconnor@pinnaclearch.com",
    phone: "+1 (555) 987-6543",
    industry: "Construction",
    city: "Seattle",
    state: "WA",
    accountManager: "Michael Chang",
    contractValue: "$36,000/yr",
    status: "Inactive",
  },
];

const getStatusBadgeColor = (
  status: ClientItem["status"]
): "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" => {
  switch (status) {
    case "Active":
      return "success";
    case "Onboarding":
      return "primary";
    case "Pending Renewal":
      return "warning";
    case "Inactive":
      return "light";
    default:
      return "primary";
  }
};

export default function ClientTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredClients = useMemo(() => {
    return clientData.filter((client) => {
      const matchesSearch =
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      {/* Table Controls */}
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-white/5">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Clients Directory
          </h3>
          <p className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
            Manage client accounts, contracts, and lifecycle statuses
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-theme-sm text-gray-800 placeholder-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder-gray-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-theme-sm text-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Pending Renewal">Pending Renewal</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Client ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Association / Client
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Contact Info
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Industry
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Location
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Account Manager
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Contract Value
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90 whitespace-nowrap">
                    {client.clientId}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start whitespace-nowrap">
                    <div>
                      <span className="block text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        {client.companyName}
                      </span>
                      <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                        {client.contactPerson}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start whitespace-nowrap">
                    <div>
                      <span className="block text-theme-sm text-gray-600 dark:text-gray-300">
                        {client.email}
                      </span>
                      <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                        {client.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {client.industry}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {client.city}, {client.state}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90 whitespace-nowrap">
                    {client.accountManager}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90 whitespace-nowrap">
                    {client.contractValue}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-theme-sm whitespace-nowrap">
                    <Badge size="sm" color={getStatusBadgeColor(client.status)}>
                      {client.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="px-5 py-8 text-center text-theme-sm text-gray-500 dark:text-gray-400"
                >
                  No clients matching the selected criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full p-4 border-t border-gray-100 dark:border-white/5">
        <div className="text-theme-sm text-gray-500 dark:text-gray-400">
          Showing {filteredClients.length} of {clientData.length} clients
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filteredClients.length / 5))}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
