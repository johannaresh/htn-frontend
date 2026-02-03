import type { Event } from '../../api/events';
import { Badge, formatEventType } from '../ui/Badge';
import { formatTimeRange } from '../../utils/datetime';
import { useAuth } from '../../auth/AuthContext';

interface EventDetailProps {
  event: Event;
}

export const EventDetail = ({ event }: EventDetailProps) => {
  const { isAuthed } = useAuth();
  const isPrivate = event.permission === 'private';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white flex-1 min-w-0">{event.name}</h1>
          <div className="flex flex-wrap gap-1.5 flex-shrink-0">
            <Badge variant={event.event_type}>{formatEventType(event.event_type)}</Badge>
            {isPrivate && isAuthed && <Badge variant="private">Private</Badge>}
          </div>
        </div>
        <p className="text-gray-400">{formatTimeRange(event.start_time, event.end_time)}</p>
      </div>

      {event.speakers.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-2">Speakers</h2>
          <div className="flex flex-wrap gap-2">
            {event.speakers.map((speaker, idx) => (
              <Badge key={idx}>{speaker.name}</Badge>
            ))}
          </div>
        </div>
      )}

      {event.description && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
        </div>
      )}

      {((event.public_url && event.public_url.trim() !== '') || isAuthed) && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-2">Links</h2>
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
    </div>
  );
};
