import { EventPage } from '@/components/pages/EventPage';

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return <EventPage eventId={params.id} />;
}
