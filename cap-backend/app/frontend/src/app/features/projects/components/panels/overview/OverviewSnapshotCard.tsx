import React from 'react';
import { useTranslation } from 'react-i18next';
import { PROJECT_DELIVERY_TYPE_LABELS } from '@/app/types/entities';
import type { OverviewPanelViewModel } from '../OverviewPanel';

interface OverviewSnapshotCardProps {
  vm: OverviewPanelViewModel;
}

export const OverviewSnapshotCard: React.FC<OverviewSnapshotCardProps> = ({ vm }) => {
  const { t } = useTranslation();
  return (
    <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{t('projects.details.overview.snapshot')}</h3>
      <p className="text-sm text-muted-foreground">{vm.project.description}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="p-3 rounded border border-border">
          <div className="text-xs text-muted-foreground">{t('projects.details.overview.manager')}</div>
          <div className="font-medium text-foreground">{vm.managerName}</div>
        </div>
        <div className="p-3 rounded border border-border">
          <div className="text-xs text-muted-foreground">{t('projects.details.overview.startDate')}</div>
          <div className="font-medium text-foreground">
            {new Date(vm.project.startDate).toLocaleDateString()}
          </div>
        </div>
        <div className="p-3 rounded border border-border">
          <div className="text-xs text-muted-foreground">{t('projects.details.overview.endDate')}</div>
          <div className="font-medium text-foreground">
            {new Date(vm.project.endDate).toLocaleDateString()}
          </div>
        </div>
        <div className="p-3 rounded border border-border">
          <div className="text-xs text-muted-foreground">{t('projects.details.overview.projectType')}</div>
          <div className="font-medium text-foreground">
            {PROJECT_DELIVERY_TYPE_LABELS[vm.project.projectType ?? 'BUILD']}
          </div>
        </div>
        <div className="p-3 rounded border border-border">
          <div className="text-xs text-muted-foreground">WRICEF</div>
          <div className="font-medium text-foreground">
            {vm.wricefObjectCount !== undefined
              ? t('projects.details.overview.objects', { count: vm.wricefObjectCount })
              : t('projects.details.overview.notImported')}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">{t('projects.details.overview.globalProgress')}</span>
          <span className="font-medium text-foreground">{vm.project.progress ?? 0}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="h-2 bg-primary rounded-full" style={{ width: `${vm.project.progress ?? 0}%` }} />
        </div>
      </div>
    </div>
  );
};
