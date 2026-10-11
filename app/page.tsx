'use client';

import dynamic from 'next/dynamic';
import { DashboardSkeleton } from '../components/DashboardSkeleton';

const SportsApp = dynamic(() => import('../components/SportsApp'), {
  ssr: false,
  loading: () => <DashboardSkeleton />,
});

export default function Home() {
  return <SportsApp />;
}
