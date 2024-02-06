'use client';

import { Label } from '@/components/ui/shadcn/label';
import Checkbox from '@/components/ui/Checkbox';
import { FormEvent, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userProfileState } from '@/store';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Union from '@/components/ui/icon/Union';
import { Button } from '@/components/ui/shadcn/button';
import { privacyContent, serviceContent } from '@/utils/agreementContents';
import { tracking } from '@/utils/mixPannel';

type FormType = {
  all: boolean;
  age: boolean;
  service: boolean;
  privacy: boolean;
};
const ServiceTermView = () => {
  const router = useRouter();
  const profile = useRecoilValue(userProfileState);
  const formRef = useRef<HTMLFormElement>(null);
  const requiredListRef = useRef<(keyof FormType)[]>(['service', 'privacy']);
  const [checkboxState, setCheckboxState] = useState<FormType>({
    all: false,
    age: false,
    service: false,
    privacy: false,
  });
  const setUserProfile = useSetRecoilState(userProfileState);

  const getCheckedRequiredCount = () => {
    for (let key of requiredListRef.current) {
      if (!checkboxState[key]) {
        return false;
      }
    }
    return true;
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!getCheckedRequiredCount()) {
      return;
    }
    let newUserProfile: Omit<FormType, 'all'> & { all?: boolean } = { ...checkboxState };
    delete newUserProfile.all;

    setUserProfile(prev => ({
      ...prev,
      agreeTerms: { ...newUserProfile },
    }));

    router.push('/signup/profile');
  };

  const handleClickTerm = (e: React.MouseEvent, type: keyof FormType) => {
    const hasToBeChecked =
      (e.currentTarget as HTMLButtonElement).dataset.state !== 'checked';
    let copiedState = { ...checkboxState };

    if (type === 'all') {
      for (let key in copiedState) {
        copiedState[key as keyof FormType] = hasToBeChecked;
      }
      setCheckboxState({ ...copiedState });
    } else {
      copiedState[type] = hasToBeChecked;
      let isAllChecked = true;
      for (let key in copiedState) {
        if (key !== 'all' && !copiedState[key as keyof FormType]) {
          isAllChecked = false;
          break;
        }
      }
      setCheckboxState(prev => ({
        ...prev,
        [type]: hasToBeChecked,
        all: isAllChecked,
      }));
    }
  };

  return (
    <section className="layout-full">
      <h1 className="font-p-M24 text-primary-900 mb-[29px]">서비스 이용 동의</h1>
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="h-full flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center h-12 space-x-2">
            <Checkbox
              onClick={e => handleClickTerm(e, 'all')}
              checked={checkboxState.all}
              value="all"
              id="all"
            />
            <Label htmlFor="all" className="font-p-R18 text-primary-800">
              약관 전체 동의
            </Label>
          </div>
          <hr className="border border-primary-300 my-[13px]" />
          <div className="flex items-center h-12 space-x-2">
            <Checkbox
              value="age"
              onClick={e => handleClickTerm(e, 'age')}
              checked={checkboxState.age}
              name="age"
              id="age"
            />
            <Label htmlFor="age" className="font-p-R18 text-primary-800">
              만 14세 이상 입니다
            </Label>
          </div>
          <div className="flex items-center h-12 space-x-2">
            <Checkbox
              onClick={e => handleClickTerm(e, 'service')}
              checked={checkboxState.service}
              value="service"
              name="service"
              id="service"
              required
            />
            <div className="grow flex items-center">
              <Label htmlFor="service" className="font-p-R18 text-primary-800">
                (필수) 서비스 이용약관
              </Label>
              <ConfirmModal title="서비스 이용약관" height="70vh" button={<Union />}>
                {serviceContent}
              </ConfirmModal>
            </div>
          </div>
          <div className="flex items-center h-12 space-x-2">
            <Checkbox
              onClick={e => handleClickTerm(e, 'privacy')}
              checked={checkboxState.privacy}
              value="privacy"
              name="privacy"
              id="privacy"
              required
            />
            <div className="grow flex items-center">
              <Label htmlFor="privacy" className="font-p-R18 text-primary-800">
                (필수) 개인정보 처리방침
              </Label>
              <ConfirmModal title="개인정보 처리방침" height="70vh" button={<Union />}>
                {privacyContent}
              </ConfirmModal>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          variant="secondary"
          disabled={!getCheckedRequiredCount()}
          onClick={() => tracking('이용 약관 동의 확인')}
        >
          시작하기
        </Button>
      </form>
    </section>
  );
};

export default ServiceTermView;
