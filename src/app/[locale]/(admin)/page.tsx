import DemographicCard from "@/components/ecommerce/DemographicCard";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import LeadTable from "@/components/tables/LeadTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM Dashboard",
  description:
    "Comprehensive CRM overview, analytics, lead tracking, and client management for Nleta CRM.",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <EcommerceMetrics />
      </div>

      <div className="col-span-12 xl:col-span-6 flex flex-col gap-4">
        <div className="col-span-12">
          {/* <MonthlyTarget /> */}
          <MonthlySalesChart />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>
      </div>

      <div className="hidden col-span-12 xl:col-span-6">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-6">
        <LeadTable
          title="Recent Leads"
          description="Overview of latest incoming CRM leads"
          showViewAll={true}
        />
      </div>
    </div>
  );
}
