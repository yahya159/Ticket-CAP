import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import type { CommentType, User } from '@/app/types/entities';
import { useTicketComments, useCreateComment, useResolveComment } from '@/app/features/comments/hooks';
import { buildCommentThreads, countUnresolvedByType } from '@/app/features/comments/model';
import { CommentBubble } from './CommentBubble';
import { CommentComposeBox } from './CommentComposeBox';
import { useTranslation } from 'react-i18next';

interface TicketCommentThreadProps {
  ticketId: string;
  currentUserId: string;
  currentRole: string;
  users: User[];
}

export const TicketCommentThread: React.FC<TicketCommentThreadProps> = ({
  ticketId,
  currentUserId,
  currentRole,
  users,
}) => {
  const { t } = useTranslation();
  const { data: comments = [], isLoading } = useTicketComments(ticketId);
  const createComment = useCreateComment(ticketId);
  const resolveComment = useResolveComment(ticketId);
  const [replyToId, setReplyToId] = useState<string | null>(null);

  const userMap = useMemo(() => {
    const map = new Map<string, User>();
    for (const u of users) map.set(u.id, u);
    return map;
  }, [users]);

  const threads = useMemo(() => buildCommentThreads(comments), [comments]);
  const unresolvedBlockers = useMemo(
    () => countUnresolvedByType(comments, ['BLOCKER']),
    [comments]
  );
  const unresolvedQuestions = useMemo(
    () => countUnresolvedByType(comments, ['QUESTION']),
    [comments]
  );

  const handleSubmit = useCallback(
    (params: {
      message: string;
      isInternal: boolean;
      commentType: CommentType;
      parentCommentId?: string;
    }) => {
      createComment.mutate(
        { ...params, authorId: currentUserId },
        {
          onSuccess: () => {
            toast.success(t('comments.toasts.addSuccess'));
            setReplyToId(null);
          },
          onError: () => toast.error(t('comments.toasts.addFailed')),
        }
      );
    },
    [createComment, currentUserId, t]
  );

  const handleToggleResolve = useCallback(
    (commentId: string, resolved: boolean) => {
      resolveComment.mutate(
        { commentId, resolved },
        {
          onSuccess: () =>
            toast.success(resolved ? t('comments.toasts.resolved') : t('comments.toasts.reopened')),
          onError: () => toast.error(t('comments.toasts.updateFailed')),
        }
      );
    },
    [resolveComment, t]
  );

  if (isLoading) {
    return <div className="text-sm text-muted-foreground py-3">{t('comments.loading')}</div>;
  }

  return (
    <section className="rounded-lg border bg-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">
          {t('comments.title', { count: comments.length })}
        </h3>
        {unresolvedBlockers > 0 && (
          <span className="flex items-center gap-1 text-xs text-red-600">
            <AlertTriangle className="h-3 w-3" />
            {t('comments.blockers', { count: unresolvedBlockers })}
          </span>
        )}
        {unresolvedQuestions > 0 && (
          <span className="text-xs text-blue-600">
            {t('comments.unanswered', { count: unresolvedQuestions })}
          </span>
        )}
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {threads.map((thread) => (
          <div key={thread.comment.id} className="space-y-1">
            <CommentBubble
              comment={thread.comment}
              author={userMap.get(thread.comment.authorId)}
              currentUserId={currentUserId}
              currentRole={currentRole}
              onReply={setReplyToId}
              onToggleResolve={handleToggleResolve}
            />
            {thread.replies.map((reply) => (
              <CommentBubble
                key={reply.id}
                comment={reply}
                author={userMap.get(reply.authorId)}
                currentUserId={currentUserId}
                currentRole={currentRole}
                onToggleResolve={handleToggleResolve}
                isReply
              />
            ))}
          </div>
        ))}
        {threads.length === 0 && (
          <p className="text-xs text-muted-foreground py-2">{t('comments.empty')}</p>
        )}
      </div>

      <CommentComposeBox
        onSubmit={handleSubmit}
        isSubmitting={createComment.isPending}
        currentRole={currentRole}
        replyToId={replyToId}
        onCancelReply={() => setReplyToId(null)}
      />
    </section>
  );
};
