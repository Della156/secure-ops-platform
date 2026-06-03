'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, User, Shield, Award, Clock, Ban } from 'lucide-react';

interface Qualification {
  id: string;
  name: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'revoked';
}

interface Applicant {
  id: string;
  name: string;
  department: string;
  qualifications: Qualification[];
  pendingJobs: { id: string; name: string }[];
}

const mockApplicants: Applicant[] = [
  {
    id: 'USER-001',
    name: '张三',
    department: '运维部',
    qualifications: [
      { id: 'QUAL-001', name: 'Linux系统管理员', type: '系统认证', issueDate: '2025-01-15', expiryDate: '2028-01-14', status: 'valid' },
      { id: 'QUAL-002', name: '网络安全工程师', type: '安全认证', issueDate: '2024-06-20', expiryDate: '2027-06-19', status: 'valid' },
    ],
    pendingJobs: [
      { id: 'AUD-001', name: '服务器维护作业' },
      { id: 'AUD-002', name: '网络配置调整' },
    ],
  },
  {
    id: 'USER-002',
    name: '李四',
    department: '开发部',
    qualifications: [
      { id: 'QUAL-003', name: 'Java开发工程师', type: '开发认证', issueDate: '2023-03-10', expiryDate: '2026-03-09', status: 'valid' },
      { id: 'QUAL-004', name: '数据库管理员', type: '数据库认证', issueDate: '2022-08-05', expiryDate: '2025-08-04', status: 'expired' },
    ],
    pendingJobs: [
      { id: 'AUD-003', name: '数据库备份作业' },
    ],
  },
  {
    id: 'USER-003',
    name: '王五',
    department: '测试部',
    qualifications: [
      { id: 'QUAL-005', name: '软件测试工程师', type: '测试认证', issueDate: '2024-01-01', expiryDate: '2027-01-01', status: 'revoked' },
    ],
    pendingJobs: [],
  },
];

export function QualComplianceCheck() {
  const [applicants] = useState(mockApplicants);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(mockApplicants[0]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'expired': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'revoked': return <Ban className="w-4 h-4 text-red-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid': return '有效';
      case 'expired': return '已过期';
      case 'revoked': return '已撤销';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-400 bg-green-500/20';
      case 'expired': return 'text-yellow-400 bg-yellow-500/20';
      case 'revoked': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const checkCompliance = (applicant: Applicant) => {
    const hasExpired = applicant.qualifications.some(q => q.status === 'expired');
    const hasRevoked = applicant.qualifications.some(q => q.status === 'revoked');
    const hasValid = applicant.qualifications.some(q => q.status === 'valid');

    if (hasRevoked) return { passed: false, reason: '存在已撤销的资质' };
    if (hasExpired) return { passed: false, reason: '存在已过期的资质' };
    if (!hasValid) return { passed: false, reason: '无有效资质' };
    return { passed: true, reason: '资质合规' };
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">作业资质合规审核</h2>
        <p className="text-sm text-gray-400 mt-1">资质校验、有效性校验、自动驳回</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">申请人列表</h3>
            <div className="space-y-2">
              {applicants.map((applicant) => {
                const compliance = checkCompliance(applicant);
                return (
                  <div
                    key={applicant.id}
                    onClick={() => setSelectedApplicant(applicant)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedApplicant?.id === applicant.id
                        ? 'bg-blue-500/20 border border-blue-500/50'
                        : 'bg-[#111827] border border-[#2A354D] hover:bg-[#253042]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white font-medium">{applicant.name}</span>
                      {compliance.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{applicant.department}</p>
                    <p className="text-xs text-gray-500">{applicant.qualifications.length} 个资质</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selectedApplicant && (
            <>
              <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{selectedApplicant.name}</h3>
                      <p className="text-sm text-gray-400">{selectedApplicant.department}</p>
                    </div>
                  </div>
                  {(() => {
                    const compliance = checkCompliance(selectedApplicant);
                    return (
                      <div className={`px-4 py-2 rounded-lg ${compliance.passed ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                        <span className={`text-sm font-medium ${compliance.passed ? 'text-green-400' : 'text-red-400'}`}>
                          {compliance.reason}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  资质证书
                </h3>
                <div className="space-y-3">
                  {selectedApplicant.qualifications.map((qual) => (
                    <div key={qual.id} className="bg-[#111827] border border-[#2A354D] rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-medium text-white">{qual.name}</h4>
                          <p className="text-xs text-gray-500">{qual.type}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${getStatusColor(qual.status)}`}>
                          {getStatusIcon(qual.status)}
                          {getStatusText(qual.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">发证日期: </span>
                          <span className="text-gray-300">{qual.issueDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">有效期至: </span>
                          <span className={`${qual.status === 'expired' ? 'text-red-400' : 'text-gray-300'}`}>{qual.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedApplicant.pendingJobs.length > 0 && (
                <div className="bg-[#1E2736] border border-[#2A354D] rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    待审核作业
                  </h3>
                  <div className="space-y-2">
                    {selectedApplicant.pendingJobs.map((job) => (
                      <div key={job.id} className="bg-[#111827] border border-[#2A354D] rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-300">{job.name}</span>
                          <span className="text-xs text-gray-500 ml-2">{job.id}</span>
                        </div>
                        {(() => {
                          const compliance = checkCompliance(selectedApplicant);
                          return (
                            <button
                              disabled={!compliance.passed}
                              className={`px-3 py-1 rounded text-xs ${
                                compliance.passed
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {compliance.passed ? '通过审核' : '自动驳回'}
                            </button>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
