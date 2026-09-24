"use client";

import { bdeService } from "@/services/bdeService";
import { BdeStats } from "@/types/bde";
import React, { useCallback, useEffect, useState } from "react";
import BdeMetrics from "./BdeMetrics";
import BdeTable from "./BdeTable";

const initialStats: BdeStats = {
  totalBdes: 0,
  activeBdes: 0,
  totalTargetQuota: 0,
  totalAchievedRevenue: 0,
  averageQuotaAttainment: 0,
  totalDealsClosed: 0,
};

export default function BdeDirectoryManager() {
  const [stats, setStats] = useState<BdeStats>(initialStats);
  const [loadingStats, setLoadingStats] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const data = await bdeService.getBdeStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load BDE statistics:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="space-y-6">
      {/* KPI Metrics */}
      <BdeMetrics stats={stats} loading={loadingStats} />

      {/* Main Table */}
      <BdeTable onDataChange={loadStats} />
    </div>
  );
}
