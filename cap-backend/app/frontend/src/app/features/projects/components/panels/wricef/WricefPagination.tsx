import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface WricefPaginationProps {
  filteredObjectsCount: number;
  objectsPage: number;
  objectsPageSize: number;
  objectsTotalPages: number;
  onObjectsPageChange: (value: number) => void;
  onObjectsPageSizeChange: (value: number) => void;
}

export const WricefPagination: React.FC<WricefPaginationProps> = ({
  filteredObjectsCount,
  objectsPage,
  objectsPageSize,
  objectsTotalPages,
  onObjectsPageChange,
  onObjectsPageSizeChange,
}) => {
  const { t } = useTranslation();
  if (filteredObjectsCount <= 0) return null;

  const start = (objectsPage - 1) * objectsPageSize + 1;
  const end = Math.min(objectsPage * objectsPageSize, filteredObjectsCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border rounded-lg bg-card px-4 py-3">
      <div className="text-sm text-muted-foreground">
        {t('projects.details.wricef.pagination.summary', {
          start,
          end,
          total: filteredObjectsCount,
          count: filteredObjectsCount,
        })}
      </div>
      <div className="flex items-center gap-2">
        <Select value={String(objectsPageSize)} onValueChange={(value) => onObjectsPageSizeChange(Number(value))}>
          <SelectTrigger className="h-8 w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / {t('projects.details.wricef.pagination.pageSize')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={objectsPage <= 1} onClick={() => onObjectsPageChange(objectsPage - 1)}>
            {t('common.previous')}
          </Button>
          <span className="px-2 text-sm text-muted-foreground">
            {objectsPage} / {objectsTotalPages}
          </span>
          <Button variant="outline" size="sm" disabled={objectsPage >= objectsTotalPages} onClick={() => onObjectsPageChange(objectsPage + 1)}>
            {t('common.next')}
          </Button>
        </div>
      </div>
    </div>
  );
};
