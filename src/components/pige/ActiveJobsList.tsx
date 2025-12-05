/**
 * Liste des jobs actifs
 */

"use client";

import { TrendingUp } from "lucide-react";
import type { ActiveJob } from "@/services/pigeService";

interface ActiveJobsListProps {
  jobs: ActiveJob[];
}

export const ActiveJobsList = ({ jobs }: ActiveJobsListProps) => {
  if (jobs.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-emerald-300 mb-4 flex items-center gap-2">
        <TrendingUp className="h-6 w-6" />
        Jobs actifs ({jobs.length})
      </h2>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-slate-800 p-4 rounded border border-slate-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Job #{job.id}</p>
                <p className="text-sm text-slate-400">{job.output}</p>
                <p className="text-xs text-slate-500">
                  Format: {job.format} • PID: {job.process_id}
                </p>
              </div>
              <div className="animate-pulse flex items-center gap-2 text-emerald-400">
                <div className="h-3 w-3 bg-emerald-400 rounded-full"></div>
                En cours...
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

