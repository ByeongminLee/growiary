import authGuard from '@/utils/authGuard';
import dateConverter from '@/utils/dateConverter';
import fbinit from '@/utils/firebase';
import { firestore } from 'firebase-admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  authGuard(authHeader);

  fbinit();

  const data: any[] = [];
  try {
    const usersSnapshot = await firestore().collection('profile').get();

    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      userData.createdAt = dateConverter(userData.createdAt);
      userData.updatedAt = dateConverter(userData.updatedAt);
      data.push(userData);

      data.push(doc.data());
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ error: 'Error fetching profiles' }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
