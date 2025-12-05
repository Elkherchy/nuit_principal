/**
 * Panneau des statistiques
 */

"use client";

import { TrendingUp } from "lucide-react";
import type { Statistics } from "@/services/pigeService";
import { formatBytes, formatDuration } from "@/lib/pigeFormatters";
import {
  StatusPieChart,
  MetricsColumnChart,
  DurationSizeBarChart,
} from "./StatisticsCharts";

interface StatisticsPanelProps {
  statistics: Statistics;
}

export const StatisticsPanel = ({ statistics }: StatisticsPanelProps) => {
  // Afficher un message si aucune statistique
  if (!statistics || statistics.total_recordings === 0) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-emerald-300 mb-6 flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Statistiques globales
        </h2>
        <div className="text-center py-8">
          <TrendingUp className="h-16 w-16 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-lg">Aucune statistique disponible</p>
          <p className="text-slate-500 text-sm mt-2">
            Les statistiques apparaîtront une fois que vous aurez des enregistrements
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-emerald-300 mb-6 flex items-center gap-2">
        <TrendingUp className="h-6 w-6" />
        Statistiques globales
      </h2>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
          <p className="text-sm text-slate-400 mb-1">Total enregistrements</p>
          <p className="text-3xl font-bold text-emerald-400">
            {statistics.total_recordings}
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
          <p className="text-sm text-slate-400 mb-1">Alertes de blancs</p>
          <p className="text-3xl font-bold text-yellow-400">
            {statistics.flagged_blanks}
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
          <p className="text-sm text-slate-400 mb-1">Durée totale</p>
          <p className="text-3xl font-bold text-blue-400">
            {formatDuration(statistics.total_duration)}
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
          <p className="text-sm text-slate-400 mb-1">Taille totale</p>
          <p className="text-3xl font-bold text-purple-400">
            {formatBytes(statistics.total_size)}
          </p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StatusPieChart statistics={statistics} />
        <MetricsColumnChart statistics={statistics} />
      </div>

      <DurationSizeBarChart statistics={statistics} />

      {/* Durée moyenne */}
      {statistics.avg_duration !== undefined && statistics.avg_duration > 0 && (
        <div className="bg-slate-800 p-4 rounded border border-slate-600">
          <p className="text-sm text-slate-400">
            Durée moyenne par enregistrement
          </p>
          <p className="text-xl font-semibold text-slate-200 mt-1">
            {formatDuration(statistics.avg_duration)}
          </p>
        </div>
      )}
    </div>
  );
};

