import { DesktopLandingView } from '@/components/home/welcome/DesktopLandingView';
import { MobileLandingView } from '@/components/home/welcome/MobileLandingView';

type WelcomePageProps = {
  params: { screen: string };
};
export default async function WelcomePage({ params: { screen } }: WelcomePageProps) {
  switch (screen) {
    case 'web':
      return <DesktopLandingView />;
    case 'app':
      return <MobileLandingView />;
  }
}
