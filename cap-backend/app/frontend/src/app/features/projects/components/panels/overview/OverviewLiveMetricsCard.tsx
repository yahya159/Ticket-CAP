import React from 'react';
import { useTranslation } from 'react-i18next';
import type { OverviewPanelViewModel } from '../OverviewPanel';

interface OverviewLiveMetricsCardProps {
  vm: OverviewPanelViewModel;
}

export const OverviewLiveMetricsCard: React.FC<OverviewLiveMetricsCardProps> = ({ vm }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-3">
      <h3 className="text-lg font-semibold text-foreground">{t('projects.details.overview.liveMetrics')}</h3>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{t('common.tickets')}</span>
        <span className="font-medium text-foreground">{vm.ticketsCount}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{t('sidebar.items.Deliverables')}</span>
        <span className="font-medium text-foreground">{vm.deliverablesCount}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{t('projects.details.overview.openTickets')}</span>
        <span className="font-medium text-foreground">{vm.openTicketsCount}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{t('projects.details.overview.criticalTickets')}</span>
        <span className="font-medium text-destructive">{vm.criticalTicketsCount}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{t('dashboard.manager.risks.stats.blocked')}</span>
        <span className="font-medium text-accent-foreground">{vm.blockedTicketsCount}</span>
      </div>
    </div>
  );
};
