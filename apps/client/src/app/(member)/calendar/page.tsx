import { authOptions } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import CalendarView from '@/components/calendar/CalendarView';
export default async function CalendarPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <CalendarView />;
  }

  redirect('/');
}
