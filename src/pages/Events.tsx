import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAllEvents } from '../api/events';
import type { Event } from '../api/events';
import { EventCard } from '../components/events/EventCard';
import { EventModal } from '../components/events/EventModal';
import { useAuth } from '../auth/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const EVENT_ORDER_KEY = 'eventOrderV1';

type EventType = 'all' | 'workshop' | 'tech_talk' | 'activity';
type SortMode = 'start_time' | 'duration';

function applyCustomOrder(events: Event[], storedOrder: number[]): Event[] {
  if (storedOrder.length === 0) return events;

  const eventMap = new Map(events.map((e) => [e.id, e]));
  const ordered: Event[] = [];
  const seen = new Set<number>();

  for (const id of storedOrder) {
    const event = eventMap.get(id);
    if (event) {
      ordered.push(event);
      seen.add(id);
    }
  }

  for (const event of events) {
    if (!seen.has(event.id)) {
      ordered.push(event);
    }
  }

  return ordered;
}

function filterEvents(events: Event[], searchText: string, selectedType: EventType): Event[] {
  let filtered = events;

  if (selectedType !== 'all') {
    filtered = filtered.filter((e) => e.event_type === selectedType);
  }

  if (searchText.trim()) {
    const query = searchText.toLowerCase();
    filtered = filtered.filter((e) => {
      const nameMatch = e.name.toLowerCase().includes(query);
      const descMatch = e.description?.toLowerCase().includes(query);
      const speakerMatch = e.speakers.some((s) => s.name.toLowerCase().includes(query));
      return nameMatch || descMatch || speakerMatch;
    });
  }

  return filtered;
}

export const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthed } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const selectedType = (searchParams.get('type') as EventType) || 'all';
  const [sortMode, setSortMode] = useState<SortMode>('start_time');

  // Modal state from URL query param
  // Respects auth gating: private events can only be viewed when logged in
  const selectedEventId = searchParams.get('event');
  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    const id = parseInt(selectedEventId, 10);
    const event = events.find((e) => e.id === id);
    if (!event) return null;
    // Auth gate: if event is private and user is not authed, don't show
    if (event.permission === 'private' && !isAuthed) return null;
    return event;
  }, [selectedEventId, events, isAuthed]);

  const [reorderMode, setReorderMode] = useState(false);
  const [customOrder, setCustomOrder] = useState<number[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllEvents();
        setEvents(data);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(EVENT_ORDER_KEY);
      if (stored) {
        const order = JSON.parse(stored) as number[];
        setCustomOrder(order);
      }
    } catch (err) {
      console.error('Failed to load custom order:', err);
    }
  }, []);

  // Base ordered list (sorted + optional custom order). No auth gating here.
  // Sorting happens first, then custom order is applied on top.
  const orderedEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      if (sortMode === 'duration') {
        const durationA = a.end_time - a.start_time;
        const durationB = b.end_time - b.start_time;
        return durationA - durationB;
      }
      // Default: sort by start_time
      return a.start_time - b.start_time;
    });
    return applyCustomOrder(sorted, customOrder);
  }, [events, customOrder, sortMode]);

  // Auth-gated list: the true set of events the current viewer is allowed to see.
  const gatedEvents = useMemo(() => {
    if (isAuthed) return orderedEvents;
    return orderedEvents.filter((e) => !e.permission || e.permission === 'public');
  }, [orderedEvents, isAuthed]);

  // Filter chip options should be derived ONLY from gatedEvents.
  const availableTypes = useMemo(() => {
    const present = new Set<Exclude<EventType, 'all'>>();
    for (const e of gatedEvents) {
      present.add(e.event_type);
    }

    // stable order
    const ORDER: Exclude<EventType, 'all'>[] = ['workshop', 'tech_talk', 'activity'];
    return ORDER.filter((t) => present.has(t));
  }, [gatedEvents]);

  // If the selectedType becomes invalid (ex: user logs out), clear it.
  useEffect(() => {
    if (selectedType === 'all') return;

    const isKnown =
      selectedType === 'workshop' || selectedType === 'tech_talk' || selectedType === 'activity';

    if (!isKnown || !availableTypes.includes(selectedType)) {
      const next = new URLSearchParams(searchParams);
      next.delete('type');
      setSearchParams(next, { replace: true });
    }
  }, [selectedType, availableTypes, searchParams, setSearchParams]);

  // Final visible list after type + search (still based only on gatedEvents).
  const visibleEvents = useMemo(() => {
    return filterEvents(gatedEvents, searchText, selectedType);
  }, [gatedEvents, searchText, selectedType]);

  const handleTypeChange = useCallback(
    (type: EventType) => {
      const next = new URLSearchParams(searchParams);

      if (type === 'all') next.delete('type');
      else next.set('type', type);

      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const handleClearOrder = useCallback(() => {
    setCustomOrder([]);
    localStorage.removeItem(EVENT_ORDER_KEY);
  }, []);

  const handleMove = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const newOrder = [...customOrder];
      const currentIds = visibleEvents.map((e) => e.id);

      const workingOrder = newOrder.length > 0 ? newOrder : currentIds;

      const eventId = currentIds[index];
      const currentPos = workingOrder.indexOf(eventId);

      if (currentPos === -1) return;

      const newPos = direction === 'up' ? currentPos - 1 : currentPos + 1;
      if (newPos < 0 || newPos >= workingOrder.length) return;

      [workingOrder[currentPos], workingOrder[newPos]] = [
        workingOrder[newPos],
        workingOrder[currentPos],
      ];

      setCustomOrder(workingOrder);
      localStorage.setItem(EVENT_ORDER_KEY, JSON.stringify(workingOrder));
    },
    [customOrder, visibleEvents]
  );

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    setIsDragging(true);
    // Set drag image opacity (browser default makes it semi-transparent)
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDragOverIndex(null);
        setIsDragging(false);
        return;
      }

      const currentIds = visibleEvents.map((ev) => ev.id);
      const workingOrder = customOrder.length > 0 ? [...customOrder] : currentIds;

      const draggedId = currentIds[draggedIndex];
      const dragPos = workingOrder.indexOf(draggedId);

      if (dragPos === -1) {
        setDragOverIndex(null);
        setIsDragging(false);
        return;
      }

      workingOrder.splice(dragPos, 1);

      const dropId = currentIds[dropIndex];
      const newDropPos = workingOrder.indexOf(dropId);

      if (draggedIndex < dropIndex) {
        workingOrder.splice(newDropPos + 1, 0, draggedId);
      } else {
        workingOrder.splice(newDropPos, 0, draggedId);
      }

      setCustomOrder(workingOrder);
      localStorage.setItem(EVENT_ORDER_KEY, JSON.stringify(workingOrder));
      setDraggedIndex(null);
      setDragOverIndex(null);
      setIsDragging(false);
    },
    [draggedIndex, visibleEvents, customOrder]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDragging(false);
  }, []);

  // Modal handlers
  const handleOpenModal = useCallback(
    (eventId: number) => {
      const next = new URLSearchParams(searchParams);
      next.set('event', String(eventId));
      setSearchParams(next, { replace: false });
    },
    [searchParams, setSearchParams]
  );

  const handleCloseModal = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete('event');
    setSearchParams(next, { replace: false });
  }, [searchParams, setSearchParams]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-white">Events</h1>

      <div className="mb-8 space-y-4">
        <div>
          <label htmlFor="event-search" className="sr-only">
            Search events
          </label>
          <Input
            id="event-search"
            type="text"
            placeholder="Search events by name, description, or speaker..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filter chips (derived from gatedEvents only) */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-400">Filter:</span>

          <button
            onClick={() => handleTypeChange('all')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            aria-pressed={selectedType === 'all'}
          >
            All
          </button>

          {availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              aria-pressed={selectedType === type}
            >
              {type === 'tech_talk'
                ? 'Tech Talk'
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort control */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-400">Sort by:</span>
          <button
            onClick={() => setSortMode('start_time')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              sortMode === 'start_time'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            aria-pressed={sortMode === 'start_time'}
          >
            Start Time
          </button>
          <button
            onClick={() => setSortMode('duration')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              sortMode === 'duration'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            aria-pressed={sortMode === 'duration'}
          >
            Duration
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-800">
          <Button
            variant={reorderMode ? 'primary' : 'secondary'}
            onClick={() => setReorderMode(!reorderMode)}
            className="text-sm"
          >
            {reorderMode ? 'Exit Reorder Mode' : 'Reorder Events'}
          </Button>
          {customOrder.length > 0 && (
            <Button variant="secondary" onClick={handleClearOrder} className="text-sm">
              Clear Custom Order
            </Button>
          )}
          {reorderMode && (
            <span className="text-sm text-gray-400">Drag cards or use Up/Down buttons to reorder</span>
          )}
        </div>
      </div>

      {visibleEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {searchText || selectedType !== 'all'
              ? 'No events match your search or filter.'
              : 'No events found.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {visibleEvents.map((event, index) => {
            const isBeingDragged = draggedIndex === index;
            const isDropTarget = dragOverIndex === index && draggedIndex !== null && draggedIndex !== index;

            // Determine cursor style for reorder mode (normal mode uses EventCard's cursor)
            let cursorClass = '';
            if (reorderMode) {
              cursorClass = isDragging && isBeingDragged ? 'cursor-grabbing' : 'cursor-grab';
            }

            return (
              <div
                key={event.id}
                draggable={reorderMode}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  relative transition-all duration-200 ease-out rounded-lg
                  ${cursorClass}
                  ${isBeingDragged ? 'scale-105 shadow-2xl shadow-cyan-500/30 z-50 ring-2 ring-cyan-500' : ''}
                  ${isDropTarget ? 'ring-2 ring-cyan-400 ring-dashed bg-cyan-500/10' : ''}
                `}
              >
                {/* Drop indicator line */}
                {isDropTarget && (
                  <div className="absolute -top-2 left-0 right-0 h-1 bg-cyan-400 rounded-full" />
                )}

                {reorderMode && (
                  <div className="absolute top-2 left-2 z-10 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, 'up');
                      }}
                      disabled={index === 0}
                      className="p-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed rounded border border-gray-700 text-white"
                      aria-label="Move up"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, 'down');
                      }}
                      disabled={index === visibleEvents.length - 1}
                      className="p-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed rounded border border-gray-700 text-white"
                      aria-label="Move down"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <EventCard event={event} onClick={reorderMode ? undefined : () => handleOpenModal(event.id)} />
              </div>
            );
          })}
        </div>
      )}

      {/* Event detail modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          allEvents={events}
          onClose={handleCloseModal}
          onSelectEvent={handleOpenModal}
        />
      )}
    </div>
  );
};
