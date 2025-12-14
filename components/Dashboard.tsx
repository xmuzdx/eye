import React, { useState, useRef } from 'react';
import { Upload, FileVideo, Play, Info, Eye, Bot, ScanFace, Cpu, Sparkles, Activity } from 'lucide-react';
import { analyzeBlinks, calculateStats } from '../utils/blinkAnalysis';
import { DataPoint, AnalysisSummary } from '../types';
import { BlinkChart } from './BlinkChart';
import { StatsCard } from './StatsCard';

export const Dashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<DataPoint[]>([]);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [blinkEvents, setBlinkEvents] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Reset state on new file
      setData([]);
      setSummary(null);
    }
  };

  /**
   * SIMULATION FUNCTION (Frontend-Only Demo)
   */
  const simulateAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate synthetic data that looks like eye blinks
    // 30fps for 10 seconds = 300 frames
    const totalFrames = 300;
    const syntheticData: number[] = [];
    
    for (let i = 0; i < totalFrames; i++) {
      // Base noise around 0.9 - 1.0 (eye open)
      let val = 0.95 + (Math.random() * 0.05 - 0.025);
      
      // Inject "Complete Blink" at frame 50
      if (i > 45 && i < 55) {
        val = Math.max(0.0, Math.abs((i - 50) / 5)); 
      }
      
      // Inject "Incomplete Blink" at frame 150 (dips to 0.3)
      if (i > 145 && i < 155) {
        val = 0.3 + Math.abs((i - 150) / 10);
      }

       // Inject "Complete Blink" at frame 250
       if (i > 245 && i < 255) {
        val = Math.max(0.005, Math.abs((i - 250) / 5)); 
      }

      syntheticData.push(Math.min(1.0, Math.max(0.0, val)));
    }

    // --- APPLY USER'S ALGORITHM ---
    const blinkStats = analyzeBlinks(syntheticData);
    const calculatedStats = calculateStats(syntheticData, blinkStats.blink_events);

    // Format for Chart
    const chartData: DataPoint[] = syntheticData.map((val, idx) => ({
      frame: idx,
      value: val
    }));

    // Format Summary
    const totalBlinks = blinkStats.complete_blinks + blinkStats.incomplete_blinks;
    const summaryData: AnalysisSummary = {
      videoName: file.name,
      totalBlinks,
      completeCount: blinkStats.complete_blinks,
      incompleteCount: blinkStats.incomplete_blinks,
      incompleteRatio: totalBlinks > 0 ? (blinkStats.incomplete_blinks / totalBlinks) * 100 : 0,
      normalizedOverallAvg: calculatedStats.normalizedOverallAvg,
      normalizedBlinkMinAvg: calculatedStats.normalizedBlinkMinAvg
    };

    setData(chartData);
    setBlinkEvents(blinkStats.blink_events);
    setSummary(summaryData);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20 animate-fade-in">
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none"></div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ScanFace className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              Ocula <span className="font-light text-slate-400">|</span> Blink Analyst
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                System Active
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Intro / Tech Visuals */}
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            AI-Driven <span className="text-blue-600">Ophthalmic Analysis</span>
          </h2>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
            Deploying neural segmentation models to quantify eyelid kinematics. 
            Detect complete vs. incomplete blinks with medical-grade precision.
          </p>

          {/* Feature Flow Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  <FileVideo className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-800">1. Video Input</h3>
                <p className="text-xs text-slate-400 mt-2 text-center">High-framerate facial recording upload</p>
             </div>
             
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center hover:shadow-md transition-shadow relative overflow-hidden group">
                {/* Decorative circuit lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-800">2. U-Net Segmentation</h3>
                <p className="text-xs text-slate-400 mt-2 text-center">Neural network extracts eyelid topology</p>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-4">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-800">3. Clinical Metrics</h3>
                <p className="text-xs text-slate-400 mt-2 text-center">Quantifiable blink quality indicators</p>
             </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto mb-16">
           <div 
             className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group bg-white/50 backdrop-blur-sm
               ${file ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-100' : 'border-slate-300 hover:border-blue-400 hover:bg-white hover:shadow-xl'}`}
             onClick={() => fileInputRef.current?.click()}
           >
             <input 
               type="file" 
               className="hidden" 
               ref={fileInputRef} 
               accept="video/*" 
               onChange={handleFileChange}
             />
             
             {file ? (
               <div className="flex flex-col items-center animate-fade-in w-full">
                 <div className="w-20 h-20 bg-gradient-to-tr from-blue-100 to-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                   <FileVideo className="w-10 h-10" />
                 </div>
                 <p className="font-bold text-slate-800 text-xl mb-1">{file.name}</p>
                 <p className="text-sm text-slate-500 mb-8 font-mono bg-slate-100 px-3 py-1 rounded-md">
                   {(file.size / 1024 / 1024).toFixed(2)} MB
                 </p>
                 
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     simulateAnalysis();
                   }}
                   disabled={isAnalyzing}
                   className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-0.5 disabled:opacity-80 disabled:cursor-not-allowed group-hover:scale-105"
                 >
                   {isAnalyzing ? (
                     <>
                        <Cpu className="animate-spin w-5 h-5 text-indigo-200" />
                        <span>Processing Model...</span>
                     </>
                   ) : (
                     <>
                       <Sparkles className="w-5 h-5 text-indigo-200" />
                       <span>Run Analysis</span>
                     </>
                   )}
                 </button>
               </div>
             ) : (
               <>
                 <div className="w-20 h-20 bg-slate-50 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 rounded-full flex items-center justify-center mb-6 transition-all duration-300 shadow-sm group-hover:scale-110">
                   <Upload className="w-10 h-10" />
                 </div>
                 <p className="font-bold text-slate-700 text-xl mb-2">Upload Patient Video</p>
                 <p className="text-sm text-slate-400">Supported formats: MP4, MOV, AVI</p>
               </>
             )}
           </div>
        </div>

        {/* Results Section */}
        {summary && (
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <ScanFace className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Diagnostic Results</h3>
              <div className="h-px bg-gradient-to-r from-slate-200 to-transparent flex-grow ml-4"></div>
            </div>

            <StatsCard summary={summary} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <BlinkChart data={data} blinkEvents={blinkEvents} />
              </div>
              
              {/* Detailed Metrics Side Panel */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-fit relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Bot className="w-24 h-24 text-slate-900" />
                </div>
                
                <h4 className="font-bold text-slate-800 mb-6 flex items-center text-lg">
                  <Info className="w-5 h-5 mr-2 text-blue-500" />
                  Detailed Metrics
                </h4>
                <div className="space-y-6 relative z-10">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Norm. Overall Avg Area</p>
                    <p className="text-2xl font-mono font-bold text-slate-700">{summary.normalizedOverallAvg.toFixed(4)}</p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Norm. Avg Blink Minimum</p>
                    <p className="text-2xl font-mono font-bold text-slate-700">{summary.normalizedBlinkMinAvg.toFixed(4)}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Model Parameters (U-Net)</p>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li className="flex justify-between items-center">
                        <span className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full"></div>Drop Window</span> 
                        <span className="font-mono bg-slate-100 px-2 rounded text-xs">3</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full"></div>Drop Thresh</span> 
                        <span className="font-mono bg-slate-100 px-2 rounded text-xs">0.2</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full"></div>End Thresh</span> 
                        <span className="font-mono bg-slate-100 px-2 rounded text-xs">0.7</span>
                      </li>
                      <li className="flex justify-between items-center">
                         <span className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full"></div>Complete Thresh</span> 
                         <span className="font-mono bg-slate-100 px-2 rounded text-xs">0.01</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};