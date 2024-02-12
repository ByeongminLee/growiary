import authGuard from '@/utils/authGuard';
import fbinit from '@/utils/firebase';
import { firestore } from 'firebase-admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  authGuard(authHeader);

  const req = await request.json();

  if (!req.userId) {
    return NextResponse.json(
      { result: false, message: 'userId가 없습니다.' },
      { status: 403 },
    );
  }

  fbinit();

  try {
    const userSnapshot = await firestore().collection('profile').doc(req.userId).get();
    const userData = userSnapshot.data();

    if (!userData) {
      return NextResponse.json(
        { result: false, message: '조회된 userId의 값이 없습니다.' },
        { status: 400 },
      );
    }

    if (userData.role !== 'ADMIN') {
      return NextResponse.json(
        { result: false, message: '관리자 권한을 가지지 않았습니다.' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { result: true, message: '관리자 확인이 되었습니다.' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}
