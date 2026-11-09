'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { notificationsService, NotificationLogItem } from '@/lib/api/notifications.service';

export default function NotificationsManagementPage() {
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'SMS' | 'PUSH' | 'IN_APP'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DELIVERED' | 'FAILED' | 'SUBMITTED'>('ALL');
  const [logs, setLogs] = useState<NotificationLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await notificationsService.getLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch notification logs', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const matchesChannel = channelFilter === 'ALL' || log.channel === channelFilter;
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchesChannel && matchesStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B24]">
            Notification Logs & Carrier Delivery Receipts
          </h1>
          <p className="text-xs text-[#64746C] mt-0.5">
            Audit trail of messages dispatched to telcos (MTN, Airtel) and Firebase FCM push gateways
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CBDCD3] bg-white text-xs font-semibold text-[#172B24] hover:bg-[#F0FBF5] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#16A34A]' : ''}`} />
          <span>Refresh DLR Status</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <Card>
        <div className="p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64746C]">Channel:</span>
            {(['ALL', 'SMS', 'PUSH', 'IN_APP'] as const).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  channelFilter === ch
                    ? 'bg-[#16A34A] text-white shadow-sm'
                    : 'bg-[#F0FBF5] text-[#64746C] hover:text-[#172B24]'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64746C]">Status:</span>
            {(['ALL', 'DELIVERED', 'SUBMITTED', 'FAILED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-[#172B24] text-white shadow-sm'
                    : 'bg-[#F0FBF5] text-[#64746C] hover:text-[#172B24]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="p-16 text-center text-[#64746C] flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#16A34A]" />
            <span className="text-xs font-semibold">Loading carrier delivery logs...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-[#64746C]">
            <Bell className="w-8 h-8 text-[#94A39B] mx-auto mb-2" />
            <div className="font-semibold text-sm text-[#172B24]">No notification logs found</div>
            <p className="text-xs text-[#64746C] mt-1">
              Dispatched announcement logs from MTN, Airtel, and Push gateways will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0FBF5] border-y border-[#E3EEE7] text-[#64746C] font-semibold">
                <tr>
                  <th className="px-5 py-3">Announcement</th>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Channel & Carrier</th>
                  <th className="px-4 py-3">Delivery Status</th>
                  <th className="px-4 py-3">Carrier Fee</th>
                  <th className="px-5 py-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EEE7] text-[#172B24]">
                {filtered.map((log) => {
                  const isDelivered = log.status === 'DELIVERED';
                  const isFailed = log.status === 'FAILED';
                  const isSubmitted = log.status === 'SUBMITTED';

                  return (
                    <tr key={log.id} className="hover:bg-[#F0FBF5]/60 transition-colors">
                      <td className="px-5 py-3.5 font-medium max-w-xs truncate">
                        <div className="font-bold text-[#172B24] truncate">{log.announcementTitle}</div>
                        {log.failureReason && (
                          <div className="text-[11px] text-[#E45C5C] truncate mt-0.5">
                            {log.failureReason}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-[#64746C]">
                        {log.recipientMasked}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-[#172B24]">{log.channel}</span>
                        <span className="text-[10px] text-[#64746C] block">{log.provider}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {isDelivered && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF7E8] text-[#087A3E]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>DELIVERED</span>
                          </span>
                        )}
                        {isSubmitted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>SUBMITTED (DLR PENDING)</span>
                          </span>
                        )}
                        {isFailed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#E45C5C] border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            <span>FAILED</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-[#64746C]">
                        {log.cost || '0 RWF'}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap text-[#64746C]">
                        {formatDate(log.timestamp)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
