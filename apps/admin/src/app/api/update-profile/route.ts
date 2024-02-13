import authGuard from '@/utils/authGuard';
import dateConverter from '@/utils/dateConverter';
import fbinit from '@/utils/firebase';
import { firestore } from 'firebase-admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  authGuard(authHeader);

  const req = await request.json();

  if (!req.origin.userId) {
    return NextResponse.json(
      { result: false, message: 'userId가 없습니다.' },
      { status: 403 },
    );
  }

  fbinit();

  try {
    const userPostRef = firestore().collection('profile').doc(req.origin.userId);
    const data = await userPostRef.update(req.update);

    return NextResponse.json(
      { result: true, message: '업데이트 되었습니다.', data },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching profiles-update:', error);
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}
