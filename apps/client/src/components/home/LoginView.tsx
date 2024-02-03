import SocialLoginBtn from '@/components/ui/SocialLoginBtn';
import Image from 'next/image';

export const LoginView = () => {
  return (
    <main className="layout-full">
      <section className="self-start mt-18">
        <Image src="/assets/app/logo.png" alt="growiary" width={312} height={113} />
        <h1 className="font-p-M24 text-primary-900 mt-2">AI와 함께하는 회고 다이어리</h1>
        <Image
          src="/assets/app/line.svg"
          alt="line"
          width={587}
          height={5}
          className="absolute top-[416px] inset-x-0 w-screen"
        />
        <Image
          src="/assets/app/growmi_with_person.png"
          alt="grwomi_with_person"
          width={128}
          height={128}
          className="absolute top-[336px] right-[20px]"
        />
      </section>
      <section className="flex flex-col items-center">
        <p className="font-p-M14 text-grayscale-600 mb-[19px]">
          SNS 계정으로 간편하게 가입하세요
        </p>
        <div className="flex gap-x-[20px]">
          <SocialLoginBtn type="naver">
            <Image
              width={54}
              height={54}
              src="/assets/social/naver.png"
              alt="naver-login"
            />
          </SocialLoginBtn>
          <SocialLoginBtn type="google">
            <Image
              width={54}
              height={54}
              src="/assets/social/google.png"
              alt="google-login"
            />
          </SocialLoginBtn>
          <SocialLoginBtn type="kakao">
            <Image
              width={54}
              height={54}
              src="/assets/social/kakao.png"
              alt="kakao-login"
            />
          </SocialLoginBtn>
        </div>
      </section>
    </main>
  );
};
