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
    const postsSnapshot = await firestore().collection('posts').get();

    postsSnapshot.forEach(doc => {
      const postsData = doc.data();

      const postsArray = Object.keys(postsData).map(postId => ({
        userId: doc.id,
        postId,
        feedback: 'NONE',
        ...postsData[postId],
        createAt: dateConverter(postsData[postId].createAt),
        updateAt: dateConverter(postsData[postId].updateAt),
      }));

      data.push(...postsArray);
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
