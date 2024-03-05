'use client';

import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';
import { firebaseConfig } from '@/utils/firebase';

const PushMessage = () => {
  const onMessageFCM = async () => {
    const permission = await Notification.requestPermission();
    // 브라우저에 알림 권한을 요청합니다.
    if (permission !== 'granted') return;

    // 이곳에도 아까 위에서 앱 등록할때 받은 'firebaseConfig' 값을 넣어주세요.
    const firebaseApp = initializeApp(firebaseConfig);
    const messaging = getMessaging(firebaseApp);
    // 이곳 vapidKey 값으로 아까 토큰에서 사용한다고 했던 인증서 키 값을 넣어주세요.
    // getToken(messaging, { vapidKey: vapidKey })
    //   .then(currentToken => {
    //     if (currentToken) {
    //       // 정상적으로 토큰이 발급되면 콘솔에 출력합니다.
    //       console.log(currentToken);
    //     } else {
    //       console.log(
    //         'No registration token available. Request permission to generate one.',
    //       );
    //     }
    //   })
    //   .catch(err => {
    //     console.log('An error occurred while retrieving token. ', err);
    //   });

    // 포그라운드: 메세지가 수신되면 역시 콘솔에 출력합니다.
    onMessage(messaging, payload => {
      const { title, body, image, icon } = payload.notification!;
      new Notification(title!, {
        body,
        image: image,
        icon: image,
      });
    });
  };

  useEffect(() => {
    if (window.isSecureContext) {
      navigator?.serviceWorker?.register('/firebase-messaging-sw.js').then(() => {
        onMessageFCM();
      });
    }
  }, []);

  return <></>;
};

export default PushMessage;
