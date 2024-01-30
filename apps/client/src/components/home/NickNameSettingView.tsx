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
import { Input } from '@/components/ui/shadcn/input';

type FormType = {
  all: boolean;
  age: boolean;
  termOfService: boolean;
  privacyPolicy: boolean;
};
const NickNameSettingView = () => {
  return (
    <section className="w-full h-[calc(80vh-72px)] mt-[72px] flex flex-col justify-between">
      <h1 className="font-p-M24 text-primary-900">어떻게 불러드릴까요?</h1>
      <p className="font-p-M16 text-primary-500">
        이름을 한글/영문/숫자 2자~8자내로 지어주세요
      </p>
      <form className="h-full flex flex-col justify-between">
        <Input type="text" placeholder="반가운 오월" />
        <Button type="button">시작하기</Button>
      </form>
    </section>
  );
};

export default NickNameSettingView;
