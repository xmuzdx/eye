import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Scatter
} from 'recharts';
import { DataPoint, BlinkEvent } from '../types';
import { CONFIG } from '../constants';

interface BlinkChartProps {
  data: DataPoint[];
  blinkEvents: BlinkEvent[];
}

export const BlinkChart: React.FC<BlinkChartProps> = ({ data, blinkEvents }) => {
  
  // Create scatter points for blinks to overlay on line chart
  const blinkPoints = blinkEvents.map(evt => ({
    frame: evt.index,
    value: evt.value,
    type: evt.type
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pointData = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-sm">
          <p className="font-bold text-slate-700">Frame: {label}</p>
          <p className="text-blue-600">Area: {pointData.value.toFixed(4)}</p>
          {pointData.type && (
             <p className={`font-semibold ${pointData.type === 'complete' ? 'text-green-600' : 'text-amber-600'}`}>
               {pointData.type === 'complete' ? 'Complete Blink' : 'Incomplete Blink'}
             </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Normalized Eyelid Area Over Time</h3>
        <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span>Complete</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500"></span>Incomplete</div>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="frame" 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              label={{ value: 'Frame Number', position: 'insideBottomRight', offset: -10, fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              domain={[-0.05, 1.1]} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{ value: 'Norm. Area', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Threshold Lines */}
            <ReferenceLine y={CONFIG.BLINK_END_THRESHOLD} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'End Threshold', fontSize: 10, fill: '#94a3b8' }} />
            <ReferenceLine y={CONFIG.COMPLETE_BLINK_THRESHOLD} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Complete Threshold', fontSize: 10, fill: '#ef4444' }} />

            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6 }}
            />

            {/* Scatter plot for identifying blink minima */}
            {/* We render separate scatters for colors, or use a custom shape. Simpler to just render one and use CustomTooltip logic or render Dots manually if needed. 
                Recharts scatter requires separate data arrays if we want different colors easily without custom shape.
             */}
             <Scatter data={blinkPoints.filter(p => p.type === 'complete')} fill="#22c55e" shape="circle" />
             <Scatter data={blinkPoints.filter(p => p.type === 'incomplete')} fill="#f59e0b" shape="triangle" />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};