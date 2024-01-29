import SocialLoginBtn from '@/components/common/SocialLoginBtn';
import Image from 'next/image';

export const LoginView = () => {
  return (
    <main className="w-full h-[calc(80vh-72px)] mt-[72px] flex flex-col items-center justify-between ">
      <section className="self-start">
        <div className="bg-temp-img w-[312px] h-[113px] mb-[23px]">Logo</div>
        <p className="font-primary text-primary-600 text-[24px]">
          AI와 함께하는 회고 다이어리
        </p>
      </section>
      <section className="flex flex-col items-center">
        <p className="font-primary text-grayscale-600 text-[14px] mb-[19px]">
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
