import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import type { OverviewPanelViewModel } from '../OverviewPanel';

interface OverviewEstimatorCardProps {
  vm: OverviewPanelViewModel;
}

export const OverviewEstimatorCard: React.FC<OverviewEstimatorCardProps> = ({ vm }) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">{t('projects.details.overview.smartEstimation')}</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        {t('projects.details.overview.smartEstimationDesc')}
      </p>
      <Button onClick={vm.onOpenCreateTicket} className="w-full">
        <Calculator className="h-4 w-4 mr-1" />
        {t('tickets.list.empty.createTicket')}
      </Button>
    </div>
  );
};
