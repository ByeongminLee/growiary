import { HomeView } from '@/components';
import fetcher from '@/utils/fetcher';

async function getProfiles() {
  const profiles = await fetcher({ url: 'profile' });

  return profiles.data;
}

async function getPosts() {
  const posts = await fetcher({ url: 'post' });

  return posts.data;
}

export default async function Home() {
  const profiles = await getProfiles();
  const posts = await getPosts();

  return <HomeView profiles={profiles} posts={posts} />;
}
