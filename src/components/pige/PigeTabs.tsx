/**
 * Composant à onglets pour la page Pige
 */

"use client";

import { useState } from "react";
import { FileAudio, Sparkles, TrendingUp, Brain } from "lucide-react";
import type { Recording, RecordingDetails as RecordingDetailsType, Statistics } from "@/services/pigeService";
import { RecordingsList } from "./RecordingsList";
import { RecordingDetails } from "./RecordingDetails";
import { StatisticsPanel } from "./StatisticsPanel";

interface PigeTabsProps {
  recordings: Recording[];
  selectedRecording: RecordingDetailsType | null;
  statistics: Statistics | null;
  onSelectRecording: (id: number) => void;
  onGenerateSummary: (id: number) => Promise<{ success: boolean; summary?: string; message?: string }>;
  onDeleteRecording?: (id: number) => Promise<{ success: boolean; message?: string }>;
}

type TabType = "recordings" | "ai-analysis" | "statistics";

export const PigeTabs = ({
  recordings,
  selectedRecording,
  statistics,
  onSelectRecording,
  onGenerateSummary,
  onDeleteRecording,
}: PigeTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("recordings");

  const tabs = [
    {
      id: "recordings" as TabType,
      label: "Enregistrements",
      icon: FileAudio,
      count: recordings.length,
    },
    {
      id: "ai-analysis" as TabType,
      label: "Analyse IA",
      icon: Brain,
      count: selectedRecording ? 1 : 0,
    },
    {
      id: "statistics" as TabType,
      label: "Statistiques",
      icon: TrendingUp,
      count: statistics?.total_recordings || 0,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      {/* En-tête avec onglets */}
      <div className="border-b border-slate-700 bg-slate-800/50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "border-emerald-500 bg-slate-900/70 text-emerald-300"
                    : "border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-emerald-400" : ""}`} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive 
                      ? "bg-emerald-600 text-white" 
                      : "bg-slate-700 text-slate-300"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="p-6">
        {activeTab === "recordings" && (
          <RecordingsList
            recordings={recordings}
            onSelectRecording={(id) => {
              onSelectRecording(id);
              setActiveTab("ai-analysis");
            }}
            onDeleteRecording={onDeleteRecording}
            showHeader={false}
          />
        )}

        {activeTab === "ai-analysis" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-blue-300">
                Analyse IA
              </h2>
            </div>

            {selectedRecording ? (
              <div className="space-y-6">
                {/* Carte d'informations */}
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {selectedRecording.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/70 p-4 rounded-lg backdrop-blur-sm">
                      <p className="text-sm text-slate-400 mb-1">Durée</p>
                      <p className="text-lg font-semibold text-white">
                        {selectedRecording.duration_formatted}
                      </p>
                    </div>
                    <div className="bg-slate-800/70 p-4 rounded-lg backdrop-blur-sm">
                      <p className="text-sm text-slate-400 mb-1">Format</p>
                      <p className="text-lg font-semibold text-white">
                        {selectedRecording.format?.toUpperCase() || "N/A"}
                      </p>
                    </div>
                    <div className="bg-slate-800/70 p-4 rounded-lg backdrop-blur-sm">
                      <p className="text-sm text-slate-400 mb-1">Statut</p>
                      <p className="text-lg font-semibold text-emerald-400">
                        {selectedRecording.status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Détails avec transcription et résumé */}
                <RecordingDetails
                  recording={selectedRecording}
                  onGenerateSummary={onGenerateSummary}
                />
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-800/30 rounded-lg border border-slate-700 border-dashed">
                <Brain className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-2">
                  Aucun enregistrement sélectionné
                </p>
                <p className="text-slate-500 text-sm">
                  Sélectionnez un enregistrement pour voir son analyse IA
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("recordings")}
                  className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Voir les enregistrements
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "statistics" && (
          <StatisticsPanel statistics={statistics} showHeader={false} />
        )}
      </div>
    </div>
  );
};

