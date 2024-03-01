'use client';
import { usePostStore, useProfileStore } from '@/state';
import { DateRangePickerValue } from '@tremor/react';
import { useState } from 'react';

export const useRetention = () => {
  const { profiles } = useProfileStore();
  const { posts } = usePostStore();
  const [data, setDate] = useState<any[]>([]);
  const [datePick, setDatePick] = useState<DateRangePickerValue | undefined>();

  const setDateRange = (value: DateRangePickerValue) => {
    setDatePick(value);
  };

  const searchHandler = () => {
    if (!datePick) return;

    const hitmapBase = generateHitmap(datePick);
    const dataBase = getFilteredData();

    const metric = generateMetrics(hitmapBase, dataBase);
    const result = addSequenceValue(metric);
    console.log(result);
    setDate(result);
  };

  const filterByDateRange = (date: Date, from: any, to: any) => {
    const utcOffset = 9 * 60 * 60 * 1000;
    const fromUTC = new Date(from.getTime() + utcOffset);
    const toUTC = new Date(to.getTime() + utcOffset);

    return (
      date.getFullYear() >= fromUTC.getFullYear() &&
      date.getMonth() >= fromUTC.getMonth() &&
      date.getDate() >= fromUTC.getDate() &&
      date.getFullYear() <= toUTC.getFullYear() &&
      date.getMonth() <= toUTC.getMonth() &&
      date.getDate() <= toUTC.getDate()
    );
  };

  const getFilteredData = () => {
    const selectedUsers = profiles.filter(
      user =>
        user.role === 'USER' &&
        filterByDateRange(new Date(user.createdAt), datePick?.from, datePick?.to),
    );
    const selectedUserIds = selectedUsers.map(user => user.userId);
    const selectedUserPosts = posts.filter(
      post =>
        selectedUserIds.includes(post.userId) &&
        filterByDateRange(new Date(post.createAt), datePick?.from, datePick?.to),
    );

    return selectedUsers.map(user => ({
      userId: user.userId,
      createAt: user.createdAt,
      userName: user.userName,
      posts: selectedUserPosts.filter(post => post.userId === user.userId),
    }));
  };

  const generateHitmap = (datePicker: DateRangePickerValue) => {
    if (!datePicker?.from || !datePicker?.to) return [];

    const fromDate = new Date(datePicker.from);
    const toDate = new Date(datePicker.to);
    const dateList = [];

    for (let date = fromDate; date <= toDate; date.setDate(date.getDate() + 1)) {
      const formattedDate = formatDate(date);
      dateList.push({ color: 'gray', tooltip: formattedDate });
    }

    return dateList;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const generateMetrics = (hitmapBase: any, dataBase: any) => {
    return dataBase.map(
      (user: { posts: any[]; userId: any; createAt: any; userName: string }) => {
        const hitmap = hitmapBase.map((item: { tooltip: string; color: any }) => {
          const matchingPost = user.posts.find(post => {
            const postDate = new Date(post.createAt);
            const hitmapDate = new Date(item.tooltip.replace(/\./g, '-'));

            return (
              postDate.getFullYear() === hitmapDate.getFullYear() &&
              postDate.getMonth() === hitmapDate.getMonth() &&
              postDate.getDate() === hitmapDate.getDate()
            );
          });

          return {
            color: matchingPost ? 'emerald' : item.color,
            tooltip: item.tooltip,
          };
        });

        return {
          userId: user.userId,
          userName: user.userName,
          createAt: user.createAt,
          posts: user.posts,
          hitmap: hitmap,
        };
      },
    );
  };

  const addSequenceValue = (data: any[]) => {
    return data.map(item => {
      const hitmap = item.hitmap.map((entry: { color: any }) => entry.color);
      const consecutive = hitmap.some(
        (color: string, index: number) =>
          index < hitmap.length - 1 &&
          color === 'emerald' &&
          hitmap[index + 1] === 'emerald',
      );

      return {
        ...item,
        sequence: consecutive,
      };
    });
  };

  return {
    searchHandler,
    datePicker: {
      setDateRange,
      datePick,
    },
    data,
  };
};

// export const useRetention = () => {
//   const { profiles } = useProfileStore();
//   const { posts } = usePostStore();
//   const [data, setDate] = useState<any[]>([]);

//   const [datePick, setDatePick] = useState<DateRangePickerValue | undefined>();

//   const dateRangeHandler = (value: any) => {
//     setDatePick(value);
//   };

//   const searchHandler = () => {
//     if (!datePick) return;
//     const hitmapBase = generateHitmap(datePick);
//     const dataBase = groupedByUserId();

//     const metric = metricsData(hitmapBase, dataBase);
//     const result = addSequenceValue(metric);
//     console.log(result);
//     setDate(result);
//   };

//   const selectedUser = () =>
//     profiles.filter(profile => {
//       if (profile.role !== 'USER') {
//         return;
//       }

//       if (!datePick) return;

//       if (datePick.from && datePick.to) {
//         const { from, to } = datePick;

//         const utcOffset = 9 * 60 * 60 * 1000;

//         const fromUTC = new Date(from.getTime() + utcOffset);
//         const toUTC = new Date(to.getTime() + utcOffset);

//         const date = new Date(profile.createdAt);

//         return (
//           date.getFullYear() >= fromUTC.getFullYear() &&
//           date.getMonth() >= fromUTC.getMonth() &&
//           date.getDate() >= fromUTC.getDate() &&
//           date.getFullYear() <= toUTC.getFullYear() &&
//           date.getMonth() <= toUTC.getMonth() &&
//           date.getDate() <= toUTC.getDate()
//         );
//       }
//     });

//   const selectedPost = () =>
//     posts.filter(post => {
//       if (!datePick) return;

//       if (datePick.from && datePick.to) {
//         const { from, to } = datePick;

//         const utcOffset = 9 * 60 * 60 * 1000;

//         const fromUTC = new Date(from.getTime() + utcOffset);
//         const toUTC = new Date(to.getTime() + utcOffset);

//         const date = new Date(post.createAt);

//         return (
//           date.getFullYear() >= fromUTC.getFullYear() &&
//           date.getMonth() >= fromUTC.getMonth() &&
//           date.getDate() >= fromUTC.getDate() &&
//           date.getFullYear() <= toUTC.getFullYear() &&
//           date.getMonth() <= toUTC.getMonth() &&
//           date.getDate() <= toUTC.getDate()
//         );
//       }
//     });

//   const groupedByUserId = () => {
//     return selectedUser().map(user => {
//       const userPosts = selectedPost().filter(post => post.userId === user.userId);
//       return {
//         userId: user.userId,
//         createAt: user.createdAt,
//         posts: userPosts.map(post => ({
//           postId: post.postId,
//           createAt: new Date(post.createAt),
//         })),
//       };
//     });
//   };

//   return {
//     searchHandler,
//     datePicker: {
//       dateRangeHandler,
//       datePick,
//     },
//     data,
//   };
// };

// function generateHitmap(datePicker: DateRangePickerValue) {
//   if (datePicker.from === undefined || datePicker.to === undefined) return;

//   const fromDate = new Date(datePicker.from);
//   const toDate = new Date(datePicker.to);
//   const dateList = [];

//   for (let date = fromDate; date <= toDate; date.setDate(date.getDate() + 1)) {
//     const formattedDate = formatDate(date);
//     dateList.push({ color: 'gray', tooltip: formattedDate });
//   }

//   return dateList;
// }

// function formatDate(date: Date) {
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');
//   return `${year}.${month}.${day}`;
// }

// function metricsData(hitmapBase: any, dataBase: any) {
//   const updatedData = dataBase.map(
//     (user: { posts: any[]; userId: any; createAt: any }) => {
//       const hitmap = hitmapBase.map((item: { tooltip: string; color: any }) => {
//         const matchingPost = user.posts.find(post => {
//           const postDate = new Date(post.createAt);
//           const hitmapDate = new Date(item.tooltip.replace(/\./g, '-'));

//           return (
//             postDate.getFullYear() === hitmapDate.getFullYear() &&
//             postDate.getMonth() === hitmapDate.getMonth() &&
//             postDate.getDate() === hitmapDate.getDate()
//           );
//         });

//         if (matchingPost) {
//           return {
//             color: 'emerald',
//             tooltip: item.tooltip,
//           };
//         } else {
//           return {
//             color: item.color,
//             tooltip: item.tooltip,
//           };
//         }
//       });

//       return {
//         userId: user.userId,
//         createAt: user.createAt,
//         posts: user.posts,
//         hitmap: hitmap,
//       };
//     },
//   );

//   return updatedData;
// }

// const addSequenceValue = (data: any[]) => {
//   return data.map(item => {
//     const hitmap = item.hitmap.map((entry: { color: any }) => entry.color);
//     let consecutive = false;

//     for (let i = 0; i < hitmap.length - 1; i++) {
//       if (hitmap[i] === 'emerald' && hitmap[i + 1] === 'emerald') {
//         consecutive = true;
//         break;
//       }
//     }

//     return {
//       ...item,
//       sequence: consecutive,
//     };
//   });
// };
