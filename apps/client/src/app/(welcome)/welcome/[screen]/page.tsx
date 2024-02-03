import OnboardView from '@/components/home/OnboardView';
import { DesktopLandingView } from '@/components/home/DesktopLandingView';
import { MobileLandingView } from '@/components/home/MobileLandingView';

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
