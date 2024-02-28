import authGuard from '@/utils/authGuard';
import dateConverter from '@/utils/dateConverter';
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

  if (!req.postId) {
    return NextResponse.json(
      { result: false, message: 'postId가 없습니다.' },
      { status: 403 },
    );
  }

  if (!req.update) {
    return NextResponse.json(
      { result: false, message: 'update할 값이 없습니다.' },
      { status: 403 },
    );
  }

  fbinit();

  try {
    const userPostRef = firestore().collection('posts').doc(req.userId);
    const userPostDoc = await userPostRef.get();

    if (userPostDoc.exists) {
      const userPostsData = userPostDoc.data();

      if (userPostsData && userPostsData[req.postId]) {
        userPostsData[req.postId].answer = req.update.answer;
        userPostsData[req.postId].answerUpdate = true;

        await userPostRef.set(userPostsData, { merge: true });

        return NextResponse.json(
          {
            result: true,
            message: '업데이트 되었습니다.',
            data: userPostsData[req.postId],
          },
          { status: 200 },
        );
      }
    }
  } catch (error) {
    console.error('Error fetching profiles-update:', error);
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}
