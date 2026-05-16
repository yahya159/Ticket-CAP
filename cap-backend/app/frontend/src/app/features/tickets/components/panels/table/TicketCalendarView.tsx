import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/app/components/ui/button';
import { Ticket } from '@/app/types/entities';
import { formatDate, formatMonthYear } from '@/app/utils/date';

interface CalendarDayCell {
  date: string;
  day: number;
  isCurrentMonth: boolean;
}

interface TicketCalendarViewProps {
  isViewOnly: boolean;
  ticketsByDate: Record<string, Ticket[]>;
  calendarDays: CalendarDayCell[];
  calendarMonth: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onOpenTicketDetails: (ticketId: string) => void;
  onUpdateTicketDueDate: (ticketId: string, dueDate: string) => void;
}

export const TicketCalendarView: React.FC<TicketCalendarViewProps> = ({
  isViewOnly,
  ticketsByDate,
  calendarDays,
  calendarMonth,
  onPrevMonth,
  onNextMonth,
  onOpenTicketDetails,
  onUpdateTicketDueDate,
}) => {
  const { t, i18n } = useTranslation();

  const onDragStart = (event: React.DragEvent, ticketId: string) => {
    event.dataTransfer.setData('text/plain', ticketId);
  };

  const onDragOver = (event: React.DragEvent) => event.preventDefault();
  const currentMonthDays = calendarDays.filter((cell) => cell.isCurrentMonth);

  const openTicketFromKeyboard = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    ticketId: string
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    onOpenTicketDetails(ticketId);
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button size="sm" variant="outline" onClick={onPrevMonth}>
          {t('calendar.prev')}
        </Button>
        <h3 className="text-center text-lg font-semibold">
          {formatMonthYear(calendarMonth, i18n.language)}
        </h3>
        <Button size="sm" variant="outline" onClick={onNextMonth}>
          {t('calendar.next')}
        </Button>
      </div>

      <div className="space-y-3 md:hidden">
        {currentMonthDays.map((cell) => {
          const dayTickets = ticketsByDate[cell.date] || [];

          return (
            <section key={cell.date} className="rounded-lg border border-border/70 bg-card p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDate(cell.date, i18n.language, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">{dayTickets.length} tickets</p>
                </div>
              </div>

              {dayTickets.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('tickets.list.empty.description')}</p>
              ) : (
                <div className="space-y-2">
                  {dayTickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      type="button"
                      draggable={!isViewOnly}
                      onDragStart={(event) => !isViewOnly && onDragStart(event, ticket.id)}
                      onClick={() => onOpenTicketDetails(ticket.id)}
                      onKeyDown={(event) => openTicketFromKeyboard(event, ticket.id)}
                      className="w-full rounded-md border border-border/70 bg-surface-2 px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {ticket.title}
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="hidden grid-cols-7 gap-px overflow-hidden rounded bg-border md:grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="bg-muted p-2 text-center text-xs font-semibold text-muted-foreground">
            {t(`calendar.dayNames.${day}`)}
          </div>
        ))}
        {calendarDays.map((cell) => {
          const dayTickets = ticketsByDate[cell.date] || [];
          return (
            <div
              key={cell.date}
              onDragOver={onDragOver}
              onDrop={(event) => {
                event.preventDefault();
                const ticketId = event.dataTransfer.getData('text/plain');
                onUpdateTicketDueDate(ticketId, cell.date);
              }}
              className={`min-h-[112px] bg-card p-2 ${!cell.isCurrentMonth ? 'opacity-40' : ''}`}
            >
              <div className="mb-2 text-xs font-medium text-muted-foreground">{cell.day}</div>
              {dayTickets.slice(0, 3).map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  draggable={!isViewOnly}
                  onDragStart={(event) => !isViewOnly && onDragStart(event, ticket.id)}
                  onClick={() => onOpenTicketDetails(ticket.id)}
                  onKeyDown={(event) => openTicketFromKeyboard(event, ticket.id)}
                  className={`mb-1 block w-full truncate rounded px-2 py-1 text-left text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${isViewOnly ? 'cursor-pointer' : 'cursor-grab'}`}
                >
                  {ticket.title}
                </button>
              ))}
              {dayTickets.length > 3 && (
                <div className="text-xs text-muted-foreground">+{dayTickets.length - 3}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
