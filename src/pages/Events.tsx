import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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

// Drag state tracks the dragged card and where it will be dropped
interface DragState {
  draggedId: number;
  draggedIndex: number;
  targetIndex: number;
  mouseX: number;
  mouseY: number;
  cardWidth: number;
  cardHeight: number;
  offsetX: number;
  offsetY: number;
}

// Apply custom order to events
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

// Filter events by search and type
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

  const selectedEventId = searchParams.get('event');
  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    const id = parseInt(selectedEventId, 10);
    const event = events.find((e) => e.id === id);
    if (!event) return null;
    if (event.permission === 'private' && !isAuthed) return null;
    return event;
  }, [selectedEventId, events, isAuthed]);

  const [reorderMode, setReorderMode] = useState(false);
  const [customOrder, setCustomOrder] = useState<number[]>([]);
  const [dragState, setDragState] = useState<DragState | null>(null);

  // Refs for card elements
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Load events
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

  // Load custom order from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(EVENT_ORDER_KEY);
      if (stored) {
        setCustomOrder(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load custom order:', err);
    }
  }, []);

  // Ordered events (sorted + custom order applied)
  const orderedEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      if (sortMode === 'duration') {
        return (a.end_time - a.start_time) - (b.end_time - b.start_time);
      }
      return a.start_time - b.start_time;
    });
    return applyCustomOrder(sorted, customOrder);
  }, [events, customOrder, sortMode]);

  // Auth-gated events
  const gatedEvents = useMemo(() => {
    if (isAuthed) return orderedEvents;
    return orderedEvents.filter((e) => !e.permission || e.permission === 'public');
  }, [orderedEvents, isAuthed]);

  // Available filter types
  const availableTypes = useMemo(() => {
    const present = new Set<Exclude<EventType, 'all'>>();
    gatedEvents.forEach((e) => present.add(e.event_type));
    const ORDER: Exclude<EventType, 'all'>[] = ['workshop', 'tech_talk', 'activity'];
    return ORDER.filter((t) => present.has(t));
  }, [gatedEvents]);

  // Clear invalid type filter
  useEffect(() => {
    if (selectedType === 'all') return;
    const isKnown = ['workshop', 'tech_talk', 'activity'].includes(selectedType);
    if (!isKnown || !availableTypes.includes(selectedType as Exclude<EventType, 'all'>)) {
      const next = new URLSearchParams(searchParams);
      next.delete('type');
      setSearchParams(next, { replace: true });
    }
  }, [selectedType, availableTypes, searchParams, setSearchParams]);

  // Final visible events after filtering
  const visibleEvents = useMemo(() => {
    return filterEvents(gatedEvents, searchText, selectedType);
  }, [gatedEvents, searchText, selectedType]);

  // Save custom order to localStorage
  const saveOrder = useCallback((newOrder: number[]) => {
    setCustomOrder(newOrder);
    localStorage.setItem(EVENT_ORDER_KEY, JSON.stringify(newOrder));
  }, []);

  // Simple swap: swap two events at indices i and j in the visible list
  // Updates the customOrder to reflect this swap
  const swapEvents = useCallback((indexA: number, indexB: number) => {
    if (indexA === indexB) return;
    if (indexA < 0 || indexB < 0) return;
    if (indexA >= visibleEvents.length || indexB >= visibleEvents.length) return;

    const eventA = visibleEvents[indexA];
    const eventB = visibleEvents[indexB];

    // Get current order (use gated events as base if no custom order)
    const gatedIds = gatedEvents.map((e) => e.id);
    const currentOrder = customOrder.length > 0 ? [...customOrder] : [...gatedIds];

    // Find positions in currentOrder
    const posA = currentOrder.indexOf(eventA.id);
    const posB = currentOrder.indexOf(eventB.id);

    if (posA === -1 || posB === -1) return;

    // Swap them
    currentOrder[posA] = eventB.id;
    currentOrder[posB] = eventA.id;

    saveOrder(currentOrder);
  }, [visibleEvents, gatedEvents, customOrder, saveOrder]);

  // Arrow button handlers - swap with adjacent visible item
  const handleMoveUp = useCallback((index: number) => {
    if (index > 0) {
      swapEvents(index, index - 1);
    }
  }, [swapEvents]);

  const handleMoveDown = useCallback((index: number) => {
    if (index < visibleEvents.length - 1) {
      swapEvents(index, index + 1);
    }
  }, [visibleEvents.length, swapEvents]);

  // Start dragging a card
  const handleDragStart = useCallback((e: React.PointerEvent, index: number, eventId: number) => {
    if (!reorderMode) return;

    const card = cardRefs.current.get(eventId);
    if (!card) return;

    e.preventDefault();
    const rect = card.getBoundingClientRect();

    setDragState({
      draggedId: eventId,
      draggedIndex: index,
      targetIndex: index,
      mouseX: e.clientX,
      mouseY: e.clientY,
      cardWidth: rect.width,
      cardHeight: rect.height,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
  }, [reorderMode]);

  // Find which card index the pointer is over
  const findTargetIndex = useCallback((clientX: number, clientY: number, draggedIndex: number): number => {
    let closest = draggedIndex;
    let closestDist = Infinity;

    for (const [id, element] of cardRefs.current.entries()) {
      const idx = visibleEvents.findIndex((e) => e.id === id);
      if (idx === -1) continue;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from pointer to card center
      const dist = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));

      if (dist < closestDist) {
        closestDist = dist;
        closest = idx;
      }
    }

    return closest;
  }, [visibleEvents]);

  // Handle pointer movement during drag
  useEffect(() => {
    if (!dragState) return;

    const handleMove = (e: PointerEvent) => {
      const newTarget = findTargetIndex(e.clientX, e.clientY, dragState.draggedIndex);

      setDragState((prev) => prev ? {
        ...prev,
        mouseX: e.clientX,
        mouseY: e.clientY,
        targetIndex: newTarget,
      } : null);
    };

    const handleUp = () => {
      // Perform the swap if target changed
      if (dragState.targetIndex !== dragState.draggedIndex) {
        swapEvents(dragState.draggedIndex, dragState.targetIndex);
      }
      setDragState(null);
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
    document.addEventListener('pointercancel', handleUp);

    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
      document.removeEventListener('pointercancel', handleUp);
    };
  }, [dragState, findTargetIndex, swapEvents]);

  // UI handlers
  const handleTypeChange = useCallback((type: EventType) => {
    const next = new URLSearchParams(searchParams);
    if (type === 'all') next.delete('type');
    else next.set('type', type);
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const handleClearOrder = useCallback(() => {
    setCustomOrder([]);
    localStorage.removeItem(EVENT_ORDER_KEY);
  }, []);

  const handleOpenModal = useCallback((eventId: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('event', String(eventId));
    setSearchParams(next, { replace: false });
  }, [searchParams, setSearchParams]);

  const handleCloseModal = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete('event');
    setSearchParams(next, { replace: false });
  }, [searchParams, setSearchParams]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
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

      {/* Controls */}
      <div className="mb-8 space-y-4">
        <div>
          <label htmlFor="event-search" className="sr-only">Search events</label>
          <Input
            id="event-search"
            type="text"
            placeholder="Search events by name, description, or speaker..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filter chips */}
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
              {type === 'tech_talk' ? 'Tech Talk' : type.charAt(0).toUpperCase() + type.slice(1)}
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
          >
            Duration
          </button>
        </div>

        {/* Reorder controls */}
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
            <span className="text-sm text-gray-400">Drag cards or use arrows to reorder</span>
          )}
        </div>
      </div>

      {/* Events grid */}
      {visibleEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {searchText || selectedType !== 'all'
              ? 'No events match your search or filter.'
              : 'No events found.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {visibleEvents.map((event, index) => {
              const isDragged = dragState?.draggedId === event.id;
              const isTarget = dragState && !isDragged && dragState.targetIndex === index;

              return (
                <div
                  key={event.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(event.id, el);
                    else cardRefs.current.delete(event.id);
                  }}
                  onPointerDown={(e) => handleDragStart(e, index, event.id)}
                  className={`
                    relative rounded-lg touch-none transition-all duration-150
                    ${reorderMode ? (dragState ? 'cursor-grabbing' : 'cursor-grab') : ''}
                    ${isDragged ? 'opacity-40 scale-95' : ''}
                    ${isTarget ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-950' : ''}
                  `}
                >
                  {/* Arrow buttons - only show in reorder mode when not dragging this card */}
                  {reorderMode && !isDragged && (
                    <div
                      className="absolute top-2 left-2 z-10 flex gap-1"
                      // CRITICAL: Stop pointer events from reaching parent to prevent drag start
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed rounded border border-gray-700 text-white"
                        aria-label="Move up"
                        title="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === visibleEvents.length - 1}
                        className="p-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed rounded border border-gray-700 text-white"
                        aria-label="Move down"
                        title="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <EventCard
                    event={event}
                    onClick={reorderMode ? undefined : () => handleOpenModal(event.id)}
                  />
                </div>
              );
            })}
          </div>

          {/* Floating dragged card */}
          {dragState && (() => {
            const draggedEvent = visibleEvents.find((e) => e.id === dragState.draggedId);
            if (!draggedEvent) return null;

            return (
              <div
                className="fixed pointer-events-none z-[100]"
                style={{
                  left: dragState.mouseX - dragState.offsetX,
                  top: dragState.mouseY - dragState.offsetY,
                  width: dragState.cardWidth,
                }}
              >
                <div className="scale-105 shadow-2xl shadow-cyan-500/40 ring-2 ring-cyan-500 rounded-lg bg-gray-900">
                  <EventCard event={draggedEvent} />
                </div>
              </div>
            );
          })()}
        </>
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
