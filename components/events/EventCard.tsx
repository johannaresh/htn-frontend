'use client';

import type { Event } from '@/lib/types/event';
import { Badge, formatEventType } from '@/components/ui/Badge';
import { formatTimeRange } from '@/lib/utils/datetime';
import { useAuth } from '@/lib/auth/AuthContext';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  showReorderButtons?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export const EventCard = ({
  event,
  onClick,
  showReorderButtons,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: EventCardProps) => {
  const { isAuthed } = useAuth();
  const isPrivate = event.permission === 'private';

  // Use div when no onClick (e.g., in reorder mode), button otherwise
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-label={onClick ? `View details for ${event.name}` : undefined}
      className={`
        h-full w-full flex flex-col p-4 bg-gray-900 border border-gray-800 rounded-lg
        hover:border-gray-700 transition-colors text-left
        focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-950
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-lg font-semibold text-white flex-1 min-w-0">{event.name}</h3>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={event.event_type}>{formatEventType(event.event_type)}</Badge>
            {isPrivate && isAuthed && <Badge variant="private">Private</Badge>}
          </div>
          {/* Reorder buttons - positioned under the badge */}
          {showReorderButtons && (
            <div
              className="flex gap-1"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }}
                disabled={!canMoveUp}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded border border-gray-600 text-white"
                aria-label="Move up"
                title="Move up"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }}
                disabled={!canMoveDown}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded border border-gray-600 text-white"
                aria-label="Move down"
                title="Move down"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-400">{formatTimeRange(event.start_time, event.end_time)}</p>
      {event.speakers.length > 0 && (
        <p className="text-sm text-gray-500 mt-2">
          Speakers: {event.speakers.map((s) => s.name).join(', ')}
        </p>
      )}
      {event.description && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-grow">{event.description}</p>
      )}
    </Component>
  );
};
