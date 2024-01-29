'use client';

import { Label } from '@/components/ui/shadcn/label';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { FormEvent, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogTrigger,
} from '@/components/ui/shadcn/alert-dialog';
import Union from '@/components/ui/icon/Union';

type FormType = {
  all: boolean;
  age: boolean;
  termOfService: boolean;
  privacyPolicy: boolean;
};
const ServiceTermView = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const requiredListRef = useRef<(keyof FormType)[]>(['termOfService', 'privacyPolicy']);
  const [checkboxState, setCheckboxState] = useState<FormType>({
    all: false,
    age: false,
    termOfService: false,
    privacyPolicy: false,
  });
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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

  const getCheckedRequiredCount = () => {
    for (let key of requiredListRef.current) {
      if (!checkboxState[key]) {
        return false;
      }
    }
    return true;
  };

  return (
    <section className="w-full h-[calc(80vh-72px)] mt-[72px] flex flex-col justify-between">
      <h1 className="text-title mb-[29px]">서비스 이용 동의</h1>
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
              checkState="minus"
            />
            <Label htmlFor="all" className="text-content">
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
            <Label htmlFor="age" className="text-content">
              만 14세 이상 입니다
            </Label>
          </div>
          <div className="flex items-center h-12 space-x-2">
            <Checkbox
              onClick={e => handleClickTerm(e, 'termOfService')}
              checked={checkboxState.termOfService}
              value="termOfService"
              name="termOfService"
              id="termOfService"
              required
            />
            <div className="grow flex items-center">
              <Label htmlFor="termOfService" className="text-content">
                (필수) 서비스 이용약관
              </Label>
              <AlertDialog>
                <AlertDialogTrigger className="ml-auto md:mr-12">
                  <Union />
                </AlertDialogTrigger>
                <AlertDialogOverlay>
                  <AlertDialogContent className="h-[70%]">
                    <div className="flex flex-col gap-3">
                      <h2 className="text-title text-center">서비스 이용약관</h2>
                      <AlertDialogDescription className="flex-[1_0_100px] overflow-y-auto">
                        ContentHere is ContentHere is Content Here is ContentHere is
                        ContentHere is ContentHere is ContentHere is ContentHere is
                        Content
                      </AlertDialogDescription>
                      <AlertDialogAction className="btn-secondary btn-full">
                        확인했어요
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </div>
          </div>
          <div className="flex items-center h-12 space-x-2">
            <Checkbox
              onClick={e => handleClickTerm(e, 'privacyPolicy')}
              checked={checkboxState.privacyPolicy}
              value="privacyPolicy"
              name="privacyPolicy"
              id="privacyPolicy"
              required
            />
            <div className="grow flex items-center">
              <Label htmlFor="privacyPolicy" className="text-content">
                (필수) 개인정보 처리방침
              </Label>
              <AlertDialog>
                <AlertDialogTrigger className="ml-auto md:mr-12">
                  <Union />
                </AlertDialogTrigger>
                <AlertDialogOverlay>
                  <AlertDialogContent className="h-[70%]">
                    <div className="flex flex-col gap-3">
                      <h2 className="text-title text-center">서비스 이용약관</h2>
                      <AlertDialogDescription className="flex-[1_0_100px] overflow-y-auto">
                        ContentHere is ContentHere is Content Here is ContentHere is
                        ContentHere is ContentHere is ContentHere is ContentHere is
                        Content
                      </AlertDialogDescription>
                      <AlertDialogAction className="btn-secondary btn-full">
                        확인했어요
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </div>
          </div>
        </div>
        <Button
          type="button"
          className={`btn-secondary ${!getCheckedRequiredCount() ? 'disabled' : ''}`}
        >
          시작하기
        </Button>
      </form>
    </section>
  );
};

export default ServiceTermView;
