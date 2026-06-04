'use client';
import React, { useState } from 'react';
import { Search, MapPin, Building2, Grid3X3, ZoomIn, ZoomOut, Maximize2, RefreshCw, LayoutGrid } from 'lucide-react';
import { PageHeader } from '@/components/Common/PageStates';

const locations = [
  { id: 'LOC-001', name: '数据中心A区', building: 'A栋', floor: '3层', rackCount: 45, assetCount: 234 },
  { id: 'LOC-002', name: '数据中心B区', building: 'B栋', floor: '2层', rackCount: 32, assetCount: 168 },
  { id: 'LOC-003', name: '办公区', building: 'C栋', floor: '5层', rackCount: 8, assetCount: 124 },
  { id: 'LOC-004', name: '云节点-北京', building: '-', floor: '-', rackCount: 0, assetCount: 567 },
  { id: 'LOC-005', name: '云节点-上海', building: '-', floor: '-', rackCount: 0, assetCount: 432 },
];

const assetsByLocation = {
  'LOC-001': [
    { id: 'ASSET-001', name: 'web-server-01', rack: 'R01', position: 'U01-U02' },
    { id: 'ASSET-002', name: 'db-server-01', rack: 'R02', position: 'U05-U06' },
    { id: 'ASSET-003', name: 'api-gateway-01', rack: 'R03', position: 'U03' },
  ],
};

export function AssetLocation() {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>('LOC-001');
  const [zoom, setZoom] = useState(100);

  const filteredLocations = locations.filter(loc => {
    if (search && !loc.name.includes(search) && !loc.building.includes(search)) return false;
    return true;
  });

  const currentAssets = selectedLocation ? assetsByLocation[selectedLocation as keyof typeof assetsByLocation] || [] : [];

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="资产位置定位" description="定位和管理资产物理位置"
        actions={[
          <button key="refresh" className="flex items-center gap-2 px-4 py-2 bg-[#1E2736] border border-[#2A354D] rounded-lg text-gray-300 text-sm hover:bg-[#253042]">
            <RefreshCw className="w-4 h-4" /> 刷新位置
          </button>,
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#2A354D]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text" placeholder="搜索位置..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#111625] border border-[#2A354D] text-white text-sm rounded-lg focus:border-blue-500 outline-none w-full"
                />
              </div>
            </div>
            <div className="p-2">
              {filteredLocations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
                    selectedLocation === loc.id
                      ? 'bg-blue-600/20 border border-blue-500/50'
                      : 'hover:bg-[#111625]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-white">{loc.name}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {loc.building !== '-' ? `${loc.building} ${loc.floor}` : '云环境'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {loc.assetCount} 个资产
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A354D]">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">位置视图</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-2 bg-[#111625] rounded-lg hover:bg-[#2A354D]">
                  <ZoomOut className="w-4 h-4 text-slate-400" />
                </button>
                <span className="text-sm text-slate-400 w-12 text-center">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="p-2 bg-[#111625] rounded-lg hover:bg-[#2A354D]">
                  <ZoomIn className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2 bg-[#111625] rounded-lg hover:bg-[#2A354D]">
                  <Maximize2 className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="p-6 bg-[#111625]" style={{ minHeight: '300px' }}>
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>位置可视化地图</p>
                  <p className="text-sm mt-1">选择左侧位置查看详情</p>
                </div>
              </div>
            </div>
          </div>

          {selectedLocation && (
            <div className="bg-[#20293F] border border-[#2A354D] rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-[#2A354D] flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">资产列表</span>
                <span className="text-xs text-slate-500">({currentAssets.length} 个)</span>
              </div>
              <div className="p-4 space-y-2">
                {currentAssets.map(asset => (
                  <div key={asset.id} className="flex items-center justify-between p-3 bg-[#111625] rounded-lg">
                    <div>
                      <div className="text-sm text-white">{asset.name}</div>
                      <div className="text-xs text-slate-400">{asset.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-blue-400">机柜: {asset.rack}</div>
                      <div className="text-xs text-slate-400">位置: {asset.position}</div>
                    </div>
                  </div>
                ))}
                {currentAssets.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    该位置暂无资产信息
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssetLocation;