'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Zap, Play, Pause, Square, Terminal, AlertCircle, Activity, CheckCircle2, XCircle } from 'lucide-react';

type LogLevel = 'info' | 'warning' | 'error' | 'success';

interface SimLog {
  id: string;
  time: string;
  level: LogLevel;
  module: string;
  message: string;
}

const INITIAL_LOGS: SimLog[] = [
  { id: 'L001', time: '10:30:01', level: 'info', module: 'recon', message: '[*] Starting Nmap scan on 10.20.0.0/24' },
  { id: 'L002', time: '10:30:15', level: 'info', module: 'recon', message: '[+] 18 hosts up, scanning ports...' },
  { id: 'L003', time: '10:32:42', level: 'success', module: 'recon', message: '[+] DC01 found: Windows Server 2019, ports: 88,135,389,445,3389' },
  { id: 'L004', time: '10:35:18', level: 'info', module: 'weapon', message: '[*] Generating phishing payload: invoice_0630.docm' },
  { id: 'L005', time: '10:35:25', level: 'success', module: 'weapon', message: '[+] Macro payload obfuscated, AV evasion: 85%' },
  { id: 'L006', time: '10:40:00', level: 'info', module: 'delivery', message: '[*] Sending 200 phishing emails via GoPhish' },
  { id: 'L007', time: '10:45:30', level: 'warning', module: 'delivery', message: '[!] 8 emails opened, 3 clicks on macro' },
  { id: 'L008', time: '10:50:12', level: 'success', module: 'exploit', message: '[+] Cobalt Strike beacon on PC-001, SYSTEM privileges' },
  { id: 'L009', time: '10:55:00', level: 'info', module: 'install', message: '[*] Persistence established: WMI subscription' },
  { id: 'L010', time: '11:05:30', level: 'success', module: 'lateral', message: '[+] Pivoting to DC01 via Pass-the-Hash' },
  { id: 'L011', time: '11:15:00', level: 'warning', module: 'detection', message: '[!] EDR detected: lateral movement (Mimikatz)' },
  { id: 'L012', time: '11:18:30', level: 'error', module: 'exfil', message: '[-] Data exfiltration blocked by DLP' },
];

const MODULES: { id: string; name: string; status: 'running' | 'completed' | 'failed' | 'pending' }[] = [
  { id: 'recon', name: '侦查 (Recon)', status: 'completed' },
  { id: 'weapon', name: '武器化 (Weaponization)', status: 'completed' },
  { id: 'delivery', name: '投递 (Delivery)', status: 'completed' },
  { id: 'exploit', name: '利用 (Exploitation)', status: 'completed' },
  { id: 'install', name: '植入 (Installation)', status: 'completed' },
  { id: 'lateral', name: '横向移动', status: 'running' },
  { id: 'exfil', name: '数据外泄', status: 'failed' },
];

const LEVEL_MAP: Record<LogLevel, { color: string; bg: string; icon: any }> = {
  info: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Activity },
  warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: AlertCircle },
  error: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
  success: { color: 'text-green-400', bg: 'bg-green-500/10', icon: CheckCircle2 },
};

/**
 * 4-10-4 攻击行为模拟（业务深度）
 */
export function AttackBehaviorSim() {
  const [logs, setLogs] = useState<SimLog[]>(INITIAL_LOGS);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    const t = setInterval(() => {
      const newLog: SimLog = {
        id: 'L' + Math.random().toString(36).substring(7).toUpperCase(),
        time: new Date().toLocaleTimeString('en-GB'),
        level: ['info', 'warning', 'success'][Math.floor(Math.random() * 3)] as LogLevel,
        module: MODULES[Math.floor(Math.random() * MODULES.length)].id,
        message: '[' + ['*', '+', '!'][Math.floor(Math.random() * 3)] + '] Simulated event at ' + new Date().toISOString(),
      };
      setLogs((prev) => [...prev.slice(-30), newLog]);
    }, 2000);
    return () => clearInterval(t);
  }, [isRunning]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-400" />
            攻击行为模拟
          </h1>
          <p className="text-slate-400 mt-1 text-sm">7 模块 · 实时日志 · 攻击链时序 · 防御效果验证</p>
        </div>
        <div className="flex gap-2">
          {isRunning ? (
            <Button variant="secondary" onClick={() => setIsRunning(false)}><Pause className="w-4 h-4 mr-1" />暂停</Button>
          ) : (
            <Button variant="primary" onClick={() => setIsRunning(true)}><Play className="w-4 h-4 mr-1" />继续</Button>
          )}
          <Button variant="secondary"><Square className="w-4 h-4 mr-1" />停止</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <Card className="lg:col-span-1">
          <h3 className="text-sm font-medium text-slate-200 mb-3">7 攻击模块状态</h3>
          <div className="space-y-2">
            {MODULES.map((m) => (
              <div key={m.id} className="p-2 bg-[#111625] rounded">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs text-slate-200 flex-1">{m.name}</span>
                  {m.status === 'running' && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
                  {m.status === 'completed' && <span className="w-2 h-2 rounded-full bg-green-400" />}
                  {m.status === 'failed' && <span className="w-2 h-2 rounded-full bg-red-400" />}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />实时攻击日志
            </h3>
            <span className="text-xs text-slate-500">{logs.length} 条</span>
          </div>
          <div className="bg-[#0F1729] rounded-lg p-3 h-[400px] overflow-y-auto font-mono text-xs">
            {logs.map((l) => {
              const Lm = LEVEL_MAP[l.level];
              const Icon = Lm.icon;
              return (
                <div key={l.id} className={`flex items-start gap-2 p-1.5 ${Lm.bg} rounded mb-1`}>
                  <span className="text-slate-500">{l.time}</span>
                  <Icon className={`w-3 h-3 ${Lm.color} flex-shrink-0 mt-0.5`} />
                  <span className={`text-[10px] px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400`}>[{l.module}]</span>
                  <span className="text-slate-200 flex-1">{l.message}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AttackBehaviorSim;
