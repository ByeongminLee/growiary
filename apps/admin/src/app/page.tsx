import { AdminGuardView, DashboardView } from '@/components';
import { authOptions } from '@/utils/authOptions';
import fetcher from '@/utils/fetcher';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

// async function getProfiles() {
//   const profiles = await fetcher({ url: 'profile' });

//   return profiles.data;
// }

// async function getPosts() {
//   const posts = await fetcher({ url: 'post' });

//   return posts.data;
// }

async function adminGuard(userId: string) {
  const result = await fetcher({
    url: 'admin-guard',
    body: { userId: userId },
  });

  return result.result;
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  let checkAdmin = false;

  if (!session || !session.id) redirect('/login');

  checkAdmin = await adminGuard(session.id);

  if (!checkAdmin) {
    return <AdminGuardView />;
  }

  // const profiles = await getProfiles();
  // const posts = await getPosts();

  // return posts && profiles ? (
  //   <DashboardView profiles={profiles} posts={posts} />
  // ) : (
  //   <>Hello</>
  // );

  return <DashboardView />;
}
