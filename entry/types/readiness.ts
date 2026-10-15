/**
 * Protocol and schema for cross-window readiness communication
 * between Next.js parent (entry) and Vite child portfolio (iframe).
 */

export type ReadinessStage =
  | 'init'
  | 'fonts'
  | 'hero_frame'
  | 'critical_components'
  | 'ready'
  | 'error';

export interface PortfolioReadinessMessage {
  source: 'durgesh-portfolio-vite';
  version: 1;
  type: 'PORTFOLIO_PROGRESS' | 'PORTFOLIO_READY' | 'PORTFOLIO_ERROR';
  payload: {
    stage: ReadinessStage;
    progress: number; // 0 to 100
    statusText: string;
    error?: string;
    timestamp: number;
  };
}

export const ALLOWED_ORIGINS: readonly string[] = [
  'https://durgesh729.vercel.app',
  'https://portfolio729.vercel.app',
  'https://durgeshpadwal.dev',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5173',
];

/**
 * Validates whether an incoming postMessage origin is trusted.
 * Only allows exact architecture origins and local development hosts.
 */
export function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Support any local development port on localhost or 127.0.0.1
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
}
