'use client';

import { useParams } from 'next/navigation';
import { GameDetailPage } from '@/components/GameBox';

export default function GameRoute() {
  const { id } = useParams<{ id: string }>();
  return <GameDetailPage id={id} />;
}
