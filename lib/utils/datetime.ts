/**
 * Format a Unix timestamp (in milliseconds) to a readable date/time string
 */
export const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format a time range from start to end timestamps
 */
export const formatTimeRange = (startTime: number, endTime: number): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const startFormatted = start.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const endFormatted = end.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${startFormatted} - ${endFormatted}`;
};
