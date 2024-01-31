import SocialLoginBtn from '@/components/ui/SocialLoginBtn';
import Image from 'next/image';

export const LoginView = () => {
  return (
    <main className="layout-full">
      <section className="self-start">
        <div className="bg-temp-img w-[312px] h-[113px] mb-[23px]">Logo</div>
        <h1 className="font-p-M24 text-primary-600">AI와 함께하는 회고 다이어리</h1>
      </section>
      <section className="flex flex-col items-center">
        <p className="font-p-M14 text-grayscale-600 mb-[19px]">
          SNS 계정으로 간편하게 가입하세요
        </p>
        <div className="flex gap-x-[20px]">
          <SocialLoginBtn type="google">
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
          <SocialLoginBtn type="google">
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
