import { format, formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format a date to a readable string
 */
export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
  return format(new Date(date), formatStr, { locale: fr });
}

/**
 * Format a date to relative time (e.g., "il y a 2 jours")
 */
export function formatRelativeDate(date: string | Date): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true, locale: fr });
}

/**
 * Format a number to currency
 */
export function formatCurrency(amount: number, currency: string = 'TND'): string {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format a number with spaces as thousand separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate random color for avatar
 */
export function generateAvatarColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}