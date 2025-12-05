/**
 * Composants de graphiques pour les statistiques de pige
 */

"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { Statistics } from "@/services/pigeService";

interface StatisticsChartsProps {
  statistics: Statistics;
}

export const StatusPieChart = ({ statistics }: StatisticsChartsProps) => {
  if (!statistics.by_status || Object.keys(statistics.by_status).length === 0) {
    return null;
  }

  const chartOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: 300,
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
          style: {
            color: "#e2e8f0",
            fontSize: "12px",
          },
        },
        showInLegend: true,
      } as any,
    },
    legend: {
      itemStyle: {
        color: "#cbd5e1",
      },
    },
    series: [
      {
        type: "pie",
        name: "Enregistrements",
        data: [
          {
            name: "Complétés",
            y: statistics.by_status.completed || 0,
            color: "#10b981",
          },
          {
            name: "En traitement",
            y: statistics.by_status.processing || 0,
            color: "#3b82f6",
          },
          {
            name: "En cours",
            y: statistics.by_status.recording || 0,
            color: "#a855f7",
          },
          {
            name: "Erreurs",
            y: statistics.by_status.error || 0,
            color: "#ef4444",
          },
        ].filter((item) => item.y > 0),
      } as any,
    ],
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
      <h3 className="text-lg font-semibold text-slate-300 mb-3">
        Répartition par statut
      </h3>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export const MetricsColumnChart = ({ statistics }: StatisticsChartsProps) => {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      height: 300,
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: ["Enregistrements", "Alertes blancs"],
      labels: {
        style: {
          color: "#cbd5e1",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Nombre",
        style: {
          color: "#cbd5e1",
        },
      },
      labels: {
        style: {
          color: "#cbd5e1",
        },
      },
      gridLineColor: "#334155",
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        colorByPoint: true,
        dataLabels: {
          enabled: true,
          style: {
            color: "#e2e8f0",
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
      },
    },
    colors: ["#10b981", "#eab308"],
    series: [
      {
        type: "column",
        name: "Valeur",
        data: [statistics.total_recordings, statistics.flagged_blanks],
      },
    ],
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
      <h3 className="text-lg font-semibold text-slate-300 mb-3">Métriques clés</h3>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export const DurationSizeBarChart = ({ statistics }: StatisticsChartsProps) => {
  const chartOptions: Highcharts.Options = {
    chart: {
      type: "bar",
      backgroundColor: "transparent",
      height: 200,
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: ["Durée totale (heures)", "Taille totale (MB)"],
      labels: {
        style: {
          color: "#cbd5e1",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "",
      },
      labels: {
        style: {
          color: "#cbd5e1",
        },
      },
      gridLineColor: "#334155",
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: "{point.y:.2f}",
          style: {
            color: "#e2e8f0",
            fontSize: "13px",
            fontWeight: "bold",
          },
        },
      },
    },
    series: [
      {
        type: "bar",
        name: "Valeur",
        data: [
          {
            y: statistics.total_duration / 3600,
            color: "#3b82f6",
          },
          {
            y: statistics.total_size / (1024 * 1024),
            color: "#a855f7",
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 mb-6">
      <h3 className="text-lg font-semibold text-slate-300 mb-3">
        Durée et taille totales
      </h3>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

