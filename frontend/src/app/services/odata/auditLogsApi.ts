import type { AuditLog } from '@/app/types/entities';
import { listEntities } from './core';

export const AuditLogsAPI = {
  async getAll(options?: { $skip?: number; $top?: number }): Promise<AuditLog[]> {
    return await listEntities<AuditLog>('core', 'AuditLogs', {
      ...(options?.$skip !== undefined && { $skip: options.$skip }),
      ...(options?.$top !== undefined && { $top: options.$top }),
    });
  },

  async getRecent(limit: number = 50): Promise<AuditLog[]> {
    return await this.getAll({ $top: limit });
  },
};
