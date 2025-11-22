// Utility functions for chat management

export function formatChatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  
  if (diff < minute) {
    return 'Just now';
  } else if (diff < hour) {
    const mins = Math.floor(diff / minute);
    return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diff < 2 * day) {
    return 'Yesterday';
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days} days ago`;
  } else if (diff < 4 * week) {
    const weeks = Math.floor(diff / week);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export function generateChatTitle(message: string, maxLength: number = 50): string {
  const cleaned = message.trim();
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  return cleaned.substring(0, maxLength).trim() + '...';
}
