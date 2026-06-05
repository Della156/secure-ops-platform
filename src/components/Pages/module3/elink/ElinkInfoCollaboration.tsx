'use client';

import { useState } from 'react';
import { MessageSquare, Send, RefreshCw, Clock, User } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const messages = [
  { id: '1', type: 'received', from: '省级平台', content: '收到您的协查请求，正在处理中...', time: '10:30' },
  { id: '2', type: 'sent', from: '本系统', content: '请求协查IP: 45.33.32.156 的攻击来源信息', time: '10:28' },
  { id: '3', type: 'received', from: '市级平台A', content: '已同步最新威胁情报数据', time: '10:25' },
  { id: '4', type: 'received', from: '省级平台', content: '关于APT-C-39的分析报告已发送', time: '09:45' },
  { id: '5', type: 'sent', from: '本系统', content: '感谢您的支持，已收到报告', time: '09:48' },
];

const collaborationItems = [
  { id: 'c1', type: 'threat', title: '威胁情报更新', source: '省级平台', time: '10:30', status: 'new' },
  { id: 'c2', type: 'incident', title: '事件协查请求', source: '市级平台B', time: '10:15', status: 'pending' },
  { id: 'c3', type: 'alert', title: '安全告警共享', source: '市级平台A', time: '09:30', status: 'read' },
];

export function ElinkInfoCollaboration() {
  const [messageList, setMessageList] = useState(messages);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: String(Date.now()),
      type: 'sent' as const,
      from: '本系统',
      content: newMessage,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessageList(prev => [msg, ...prev]);
    setNewMessage('');
  };

  return (
    <div className="p-6 space-y-4">
      <div className="bg-[#20293F] border border-[#2A354D] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">ELINK信息协同</h2>
            <p className="text-xs text-slate-500 mt-1">查看和管理ELINK协同联动的信息交互</p>
          </div>
          <Button variant="secondary" size="sm"><RefreshCw className="w-3.5 h-3.5 mr-1" />刷新</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="sm">
          <h3 className="text-sm font-semibold text-white mb-3">协同消息</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {messageList.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.type === 'sent' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.type === 'sent' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <div className={`max-w-[70%] ${msg.type === 'sent' ? 'text-right' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-400">{msg.from}</span>
                    <span className="text-xs text-slate-500">{msg.time}</span>
                  </div>
                  <div className={`px-3 py-2 rounded-lg text-sm ${
                    msg.type === 'sent' 
                      ? 'bg-blue-500/20 text-blue-200 rounded-tr-sm' 
                      : 'bg-slate-700 text-slate-200 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="输入消息..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <Button size="sm" onClick={sendMessage}><Send className="w-3.5 h-3.5" /></Button>
          </div>
        </Card>

        <Card padding="sm">
          <h3 className="text-sm font-semibold text-white mb-3">协同事项</h3>
          <div className="space-y-3">
            {collaborationItems.map(item => (
              <div key={item.id} className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      item.type === 'threat' ? 'bg-purple-500/20 text-purple-400' :
                      item.type === 'incident' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {item.type === 'threat' ? '威胁情报' : item.type === 'incident' ? '事件协查' : '安全告警'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      item.status === 'new' ? 'bg-green-500/20 text-green-400' :
                      item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {item.status === 'new' ? '新消息' : item.status === 'pending' ? '待处理' : '已读'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
                <p className="text-sm text-white">{item.title}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                  <MessageSquare className="w-3 h-3" />
                  <span>来源: {item.source}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ElinkInfoCollaboration;