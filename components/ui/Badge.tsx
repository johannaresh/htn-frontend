'use client';

import { classNames } from '@/lib/utils/classNames';

type BadgeVariant = 'default' | 'private' | 'workshop' | 'activity' | 'tech_talk';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

// Human-readable labels for event types
const variantLabels: Record<BadgeVariant, string> = {
  default: '',
  private: 'Private',
  workshop: 'Workshop',
  activity: 'Activity',
  tech_talk: 'Tech Talk',
};

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  // Consistent base styles: same padding, height, border-radius, typography
  const baseStyles = 'inline-flex items-center justify-center h-6 px-2.5 rounded text-xs font-medium uppercase tracking-wide whitespace-nowrap';

  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-gray-800 text-gray-300 border border-gray-700',
    private: 'bg-amber-900/50 text-amber-300 border border-amber-500/50',
    workshop: 'bg-cyan-900/50 text-cyan-300 border border-cyan-500/50',
    activity: 'bg-teal-900/50 text-teal-300 border border-teal-500/50',
    tech_talk: 'bg-gray-700/50 text-gray-200 border border-gray-500/50',
  };

  return (
    <span className={classNames(baseStyles, variantStyles[variant], className)}>
      {children}
    </span>
  );
};

// Helper function to get formatted label for a variant
export const getBadgeLabel = (variant: BadgeVariant): string => {
  return variantLabels[variant] || '';
};

// Helper to format event type for display
export const formatEventType = (eventType: string): string => {
  const labels: Record<string, string> = {
    workshop: 'Workshop',
    activity: 'Activity',
    tech_talk: 'Tech Talk',
  };
  return labels[eventType] || eventType;
};
