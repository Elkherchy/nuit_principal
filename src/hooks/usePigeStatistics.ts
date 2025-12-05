/**
 * Hook pour gérer les statistiques de pige
 */

import { useState } from "react";
import {
  fetchStatistics as fetchStatisticsService,
  type Statistics,
} from "@/services/pigeService";

export const usePigeStatistics = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Récupère les statistiques
   */
  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const data = await fetchStatisticsService();
      setStatistics(data);
      return data;
    } catch (error) {
      console.error("Erreur fetch statistics:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    statistics,
    loading,
    fetchStatistics,
  };
};

