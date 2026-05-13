import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Ticket, Imputation } from '@/app/types/entities';
import { CalendarDay } from '../model';
import { useAuth } from '@/app/context/AuthContext';
import { getBaseRouteForRole } from '@/app/context/roleRouting';
import { formatDate, formatMonthYear } from '@/app/utils/date';

interface CalendarGridProps {
  calendarMonth: string;
  calendarDays: CalendarDay[];
  imputationsByDate: Record<string, Imputation[]>;
  hoursByDate: Record<string, number>;
  tickets: Ticket[];
  canEdit: boolean;
  prevMonth: () => void;
  nextMonth: () => void;
  openAddDialog: (date: string) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarMonth,
  calendarDays,
  imputationsByDate,
  hoursByDate,
  tickets,
  canEdit,
  prevMonth,
  nextMonth,
  openAddDialog,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const roleBasePath = currentUser ? getBaseRouteForRole(currentUser.role) : '';
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const currentMonthDays = calendarDays.filter((cell) => cell.isCurrentMonth);

  const handleDayKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, date: string) => {
    if (!canEdit || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    openAddDialog(date);
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <Button size="sm" variant="outline" onClick={prevMonth}>{t('calendar.prev')}</Button>
        <h3 className="text-lg font-semibold">
          {formatMonthYear(calendarMonth, i18n.language)}
        </h3>
        <Button size="sm" variant="outline" onClick={nextMonth}>{t('calendar.next')}</Button>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {currentMonthDays.map((cell) => {
          const dayImps = imputationsByDate[cell.date] || [];
          const dayHours = hoursByDate[cell.date] || 0;
          const isToday = cell.date === today;

          return (
            <section
              key={cell.date}
              className={`rounded-lg border border-border/70 bg-card p-3 ${isToday ? 'ring-2 ring-primary/40 ring-inset' : ''}`}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDate(cell.date, i18n.language, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">{dayHours}h</p>
                </div>
                {canEdit && (
                  <Button size="sm" variant="outline" onClick={() => openAddDialog(cell.date)}>
                    +
                  </Button>
                )}
              </div>

              {dayImps.length === 0 ? null : (
                <div className="space-y-2">
                  {dayImps.map((imp) => {
                    const ticket = tickets.find((item) => item.id === imp.ticketId);

                    return (
                      <button
                        key={imp.id}
                        type="button"
                        className="block w-full rounded-md border border-border/70 bg-surface-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        onClick={() => navigate(`${roleBasePath}/tickets/${imp.ticketId}`)}
                      >
                        <span className="font-semibold">{imp.hours}h</span>{' '}
                        <span className="text-muted-foreground">{ticket?.ticketCode || imp.ticketId.slice(0, 6)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="hidden p-2 md:block">
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded bg-border">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="bg-muted p-2 text-center text-xs font-semibold text-muted-foreground">{t(`calendar.dayNames.${d}`)}</div>
          ))}
          {calendarDays.map((cell) => {
            const dayImps = imputationsByDate[cell.date] || [];
            const dayHours = hoursByDate[cell.date] || 0;
            const isToday = cell.date === today;

            return (
              <div
                key={cell.date}
                role={canEdit && cell.isCurrentMonth ? 'button' : undefined}
                tabIndex={canEdit && cell.isCurrentMonth ? 0 : undefined}
                aria-label={canEdit && cell.isCurrentMonth ? cell.date : undefined}
                className={`min-h-[112px] border-b border-r bg-card p-2 transition-colors ${
                  !cell.isCurrentMonth ? 'opacity-30' : ''
                } ${cell.isWeekend ? 'bg-muted/20' : ''} ${
                  isToday ? 'ring-2 ring-primary/40 ring-inset' : ''
                } ${canEdit && cell.isCurrentMonth ? 'cursor-pointer hover:bg-accent/30' : ''}`}
                onClick={() => {
                  if (canEdit && cell.isCurrentMonth) {
                    openAddDialog(cell.date);
                  }
                }}
                onKeyDown={(event) => handleDayKeyDown(event, cell.date)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className={`text-xs font-medium ${isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                    {cell.day}
                  </span>
                  {dayHours > 0 && (
                    <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                      dayHours >= 8 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      dayHours >= 4 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {dayHours}h
                    </span>
                  )}
                </div>
                {dayImps.slice(0, 2).map((imp) => {
                  const ticket = tickets.find((t) => t.id === imp.ticketId);
                  return (
                    <button
                      key={imp.id}
                      type="button"
                      className="mb-1 block w-full truncate rounded bg-primary/10 px-2 py-1 text-left text-xs font-medium text-primary hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                      title={`${ticket?.ticketCode || ''} - ${imp.hours}h - ${imp.description || ''}`}
                      onClick={(e) => { e.stopPropagation(); navigate(`${roleBasePath}/tickets/${imp.ticketId}`); }}
                    >
                      {imp.hours}h {ticket?.ticketCode || imp.ticketId.slice(0, 6)}
                    </button>
                  );
                })}
                {dayImps.length > 2 && (
                  <div className="text-xs text-muted-foreground">+{dayImps.length - 2}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
