'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface LiveLogStreamProps {
  logs: string[];
  autoScroll?: boolean;
}

/**
 * 实时日志流
 */
export function LiveLogStream({ logs, autoScroll = true }: LiveLogStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  return (
    <div className="rounded-lg bg-[#0A0E1A] border border-[#2A354D] overflow-hidden">
      <div className="px-3 py-1.5 bg-[#111625] border-b border-[#2A354D] flex items-center gap-2">
        <Terminal className="w-3.5 h-3.5 text-green-400" />
        <span className="text-xs text-slate-400">实时日志</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          LIVE
        </span>
      </div>
      <div
        ref={containerRef}
        className="px-3 py-2 h-40 overflow-y-auto font-mono text-[11px] leading-relaxed"
      >
        {logs.map((log, idx) => (
          <div key={idx} className="text-slate-300">
            <span className="text-slate-600">[{idx + 1}]</span> {log}
          </div>
        ))}
      </div>
    </div>
  );
}
