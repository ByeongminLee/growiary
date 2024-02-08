import { useProfileStore } from '@/state';

export const useActiveUser = () => {
  const { profiles } = useProfileStore();

  // DAU : 두번 이상 작성 기록이 있으며 오늘 작성한 사람
  // WAU : 두번 이상 작성 기록이 있으며 일주일 내에 작성한 사람
  // MAU : 두번 이상 작성 기록이 있으며 한달 내에 작성한 사람
  // activeUser : 최근 3개월 동안, 두번 이상 작성 기록이 있는 사람
  const today = new Date();
  const oneDayAgo = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const threeMonthsAgo = new Date(today.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);

  const prevDay = new Date(oneDayAgo);
  prevDay.setDate(prevDay.getDate() - 1); // Get the day before yesterday
  const prevWeek = new Date(oneWeekAgo);
  prevWeek.setDate(prevWeek.getDate() - 7); // Get the date one week before
  const prevMonth = new Date(oneMonthAgo);
  prevMonth.setMonth(prevMonth.getMonth() - 1); // Get the date one month before

  const DAU = profiles.filter(profile => {
    const createdAtDate = new Date(profile.createdAt);
    return (
      profile.updatedAt >= oneDayAgo.toISOString() &&
      profile.updatedAt <= today.toISOString() &&
      createdAtDate < today &&
      createdAtDate.toDateString() === today.toDateString()
    );
  }).length;

  const WAU = profiles.filter(profile => {
    const createdAtDate = new Date(profile.createdAt);
    return (
      profile.updatedAt >= oneWeekAgo.toISOString() &&
      profile.updatedAt <= today.toISOString() &&
      createdAtDate < today &&
      createdAtDate >= oneWeekAgo
    );
  }).length;

  const MAU = profiles.filter(profile => {
    const createdAtDate = new Date(profile.createdAt);
    return (
      profile.updatedAt >= oneMonthAgo.toISOString() &&
      profile.updatedAt <= today.toISOString() &&
      createdAtDate < today &&
      createdAtDate >= oneMonthAgo
    );
  }).length;

  const activeUser = profiles.filter(profile => {
    const createdAtDate = new Date(profile.createdAt);
    return profile.updatedAt >= threeMonthsAgo.toISOString() && createdAtDate < today;
  }).length;

  // Calculate perDAU, perWAU, perMAU
  const perDAU =
    DAU -
    profiles.filter(profile => {
      const createdAtDate = new Date(profile.createdAt);
      return (
        profile.updatedAt >= prevDay.toISOString() &&
        profile.updatedAt <= oneDayAgo.toISOString() &&
        createdAtDate < oneDayAgo &&
        createdAtDate.toDateString() === oneDayAgo.toDateString()
      );
    }).length;

  const perWAU =
    WAU -
    profiles.filter(profile => {
      const createdAtDate = new Date(profile.createdAt);
      return (
        profile.updatedAt >= prevWeek.toISOString() &&
        profile.updatedAt <= oneWeekAgo.toISOString() &&
        createdAtDate < oneWeekAgo &&
        createdAtDate >= prevWeek
      );
    }).length;

  const perMAU =
    MAU -
    profiles.filter(profile => {
      const createdAtDate = new Date(profile.createdAt);
      return (
        profile.updatedAt >= prevMonth.toISOString() &&
        profile.updatedAt <= oneMonthAgo.toISOString() &&
        createdAtDate < oneMonthAgo &&
        createdAtDate >= prevMonth
      );
    }).length;

  return { DAU, WAU, MAU, activeUser, perDAU, perWAU, perMAU };
};
