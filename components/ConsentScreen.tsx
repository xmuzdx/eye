import React, { useState } from 'react';
import { FileText, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

interface ConsentScreenProps {
  onAgree: () => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({ onAgree }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">数据使用知情同意书</h2>
            <p className="text-sm text-slate-500">在使用 Ocula 系统前请仔细阅读</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow text-slate-600 leading-relaxed text-sm space-y-4">
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3 mb-4">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-xs">
              <strong>隐私声明：</strong> 本系统处理的数据包含敏感的生物特征信息（面部视频）。我们将严格遵守相关法律法规保护您的数据安全。
            </p>
          </div>

          <h3 className="font-bold text-slate-800 text-base">1. 项目背景与目的</h3>
          <p>
            Ocula 眨眼分析系统旨在利用计算机视觉技术，对上传的视频进行眼部运动分析。主要目的是辅助研究人员统计完全眨眼与不完全眨眼的频率及眼睑闭合程度，以评估眼表健康状况。
          </p>

          <h3 className="font-bold text-slate-800 text-base">2. 数据收集与处理</h3>
          <p>
            您上传的视频文件将在本地或指定的安全服务器上进行处理。处理过程包括：
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>提取视频中的面部及眼部区域图像。</li>
              <li>使用 AI 模型生成眼睑区域的分割掩码。</li>
              <li>计算随时间变化的眼睑面积数据。</li>
            </ul>
          </p>

          <h3 className="font-bold text-slate-800 text-base">3. 数据存储与保密</h3>
          <p>
            除非另有说明，演示版本的系统不会永久存储您的原始视频数据。分析生成的统计报告（CSV文件）和图表仅用于当次会话展示。我们承诺不将您的数据用于除本分析以外的任何商业用途。
          </p>

          <h3 className="font-bold text-slate-800 text-base">4. 风险与免责</h3>
          <p>
            虽然我们的算法经过优化，但在光照不足、遮挡或极端角度下可能存在识别误差。本系统生成的分析结果仅供参考，不作为临床诊断的唯一依据。请结合医生建议使用。
          </p>
          
          <p className="text-xs text-slate-400 mt-8 pt-4 border-t border-slate-100">
            更新日期: 2025年12月 | Ocula Team
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <div className="flex items-center mb-6 cursor-pointer" onClick={() => setAgreed(!agreed)}>
            <div className={`w-6 h-6 rounded border flex items-center justify-center mr-3 transition-colors ${agreed ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
              {agreed && <CheckCircle className="w-4 h-4 text-white" />}
            </div>
            <span className="text-slate-700 font-medium select-none">
              我已阅读并同意上述条款，了解数据使用的目的与方式。
            </span>
          </div>

          <button
            onClick={onAgree}
            disabled={!agreed}
            className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2
              ${agreed 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transform hover:-translate-y-0.5' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            进入系统
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};