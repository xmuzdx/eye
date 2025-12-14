import React from 'react';
import { AnalysisSummary } from '../types';
import { Eye, EyeOff, Activity, Percent } from 'lucide-react';

interface StatsCardProps {
  summary: AnalysisSummary;
}

const StatItem = ({ label, value, icon: Icon, colorClass }: { label: string; value: string | number; icon: any; colorClass: string }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center space-x-4 transition hover:shadow-md">
    <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export const StatsCard: React.FC<StatsCardProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatItem 
        label="Total Blinks" 
        value={summary.totalBlinks} 
        icon={Activity} 
        colorClass="bg-blue-500 text-blue-500" 
      />
      <StatItem 
        label="Complete Blinks" 
        value={summary.completeCount} 
        icon={EyeOff} 
        colorClass="bg-green-500 text-green-500" 
      />
      <StatItem 
        label="Incomplete Blinks" 
        value={summary.incompleteCount} 
        icon={Eye} 
        colorClass="bg-amber-500 text-amber-500" 
      />
      <StatItem 
        label="Incomplete Ratio" 
        value={`${summary.incompleteRatio.toFixed(1)}%`} 
        icon={Percent} 
        colorClass="bg-red-500 text-red-500" 
      />
    </div>
  );
};