'use client';

import Button from '@/components/ui/Button';
import React, { FormEvent, useState } from 'react';
import { Input } from '@/components/ui/shadcn/input';

const NickNameSettingView = () => {
  const [input, setInput] = useState('');
  const [caution, setCaution] = useState('');
  const handleChange = (e: React.ChangeEvent) => {
    const value = (e.currentTarget as HTMLInputElement).value;
    setInput(value);
    const isValidLength = value.length >= 2 && value.length <= 8;
    let isValidChar = /[A-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣|1-9]/g.test(value);

    if (!isValidLength) {
      setCaution('닉네임은 2자~8자로 입력해 주세요');
    } else if (!isValidChar) {
      setCaution('닉네임은 한글, 영문, 숫자로만 입력해 주세요');
    } else {
      setCaution('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (caution) return;
  };

  return (
    <section className="layout-full">
      <h1 className="font-p-M24 text-primary-900">어떻게 불러드릴까요?</h1>
      <p className="font-p-R16 text-primary-500 mt-[6px]">
        이름을 한글/영문/숫자 2자~8자내로 지어주세요
      </p>
      <form
        className="h-full flex flex-col justify-between mt-[26px]"
        onSubmit={handleSubmit}
      >
        <div>
          <Input
            type="text"
            placeholder="반가운 오월"
            value={input}
            onChange={handleChange}
            maxLength={8}
          />
          {caution && (
            <p className="flex text-danger-600 text-sm leading-[17px] mt-[10px]">
              <img
                className="w-4 h-4 mr-[6px]"
                src="/assets/icon.png"
                alt="invalid nickname value"
              />
              닉네임은 2자~8자로 입력해 주세요
            </p>
          )}
        </div>
        <Button type="submit">시작하기</Button>
      </form>
    </section>
  );
};

export default NickNameSettingView;
