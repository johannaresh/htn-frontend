'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import type { Event } from '@/lib/types/event';
import { Badge, formatEventType } from '@/components/ui/Badge';
import { formatTimeRange } from '@/lib/utils/datetime';
import { useAuth } from '@/lib/auth/AuthContext';

interface EventModalProps {
  event: Event;
  allEvents: Event[];
  onClose: () => void;
  onSelectEvent: (eventId: number) => void;
}

export const EventModal = ({ event, allEvents, onClose, onSelectEvent }: EventModalProps) => {
  const { isAuthed } = useAuth();
  const isPrivate = event.permission === 'private';
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the close button when modal opens
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [event.id]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle click outside to close
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Filter related events based on auth state
  const relatedEvents = useMemo(() => {
    const events = event.related_events
      .map((id) => allEvents.find((e) => e.id === id))
      .filter((e): e is Event => e !== undefined);

    if (!isAuthed) {
      return events.filter((e) => !e.permission || e.permission === 'public');
    }
    return events;
  }, [event.related_events, allEvents, isAuthed]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-lg shadow-xl"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-4 pr-8">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 id="modal-title" className="text-2xl font-bold text-white flex-1 min-w-0">
                {event.name}
              </h2>
              <div className="flex flex-wrap gap-1.5 flex-shrink-0">
                <Badge variant={event.event_type}>{formatEventType(event.event_type)}</Badge>
                {isPrivate && isAuthed && <Badge variant="private">Private</Badge>}
              </div>
            </div>
            <p className="text-gray-400">{formatTimeRange(event.start_time, event.end_time)}</p>
          </div>

          {/* Speakers */}
          {event.speakers.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Speakers</h3>
              <div className="flex flex-wrap gap-2">
                {event.speakers.map((speaker, idx) => (
                  <Badge key={idx}>{speaker.name}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* Links */}
          {((event.public_url && event.public_url.trim() !== '') || isAuthed) && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Links</h3>
              <div className="flex flex-col gap-2">
                {event.public_url && event.public_url.trim() !== '' && (
                  <a
                    href={event.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Public Link
                  </a>
                )}
                {isAuthed && (
                  <a
                    href={event.private_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 underline"
                  >
                    Private Link
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">Related Events</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {relatedEvents.map((relatedEvent) => (
                  <button
                    key={relatedEvent.id}
                    onClick={() => onSelectEvent(relatedEvent.id)}
                    className="block p-3 bg-gray-800 border border-gray-700 rounded hover:border-gray-600 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-white flex-1 min-w-0">
                        {relatedEvent.name}
                      </span>
                      <Badge variant={relatedEvent.event_type}>
                        {formatEventType(relatedEvent.event_type)}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
