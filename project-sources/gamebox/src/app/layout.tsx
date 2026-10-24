import type { Metadata, Viewport } from 'next';
import './globals.css';
import MusicPlayer from '@/components/MusicPlayer';

export const metadata: Metadata = { title: 'GameBox — Play anywhere', description: 'Quick browser games. Solo, with friends, or online.', manifest: '/manifest.webmanifest' };
export const viewport: Viewport = { themeColor: '#10110f' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<MusicPlayer /></body></html>;
}
