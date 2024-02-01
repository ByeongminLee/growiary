import React from 'react';
import Image from 'next/image';

type DiaryReplyProps = {
  template: any;
  response: any;
};

const DiaryReply = ({ template, response }: DiaryReplyProps) => {
  return (
    <>
      <div className="flex justify-between items-end mb-5">
        <h2 className="text-sub-indigo font-p-M20">To. 그루어리에게</h2>
        <Image
          className="mr-4"
          src="/assets/growmi/green.svg"
          width={57}
          height={58}
          alt="growmi"
        />
      </div>
      <div className="text-grayscale-800 font-p-R17 bg-opacity-70 p-6 mb-10 rounded-2xl relative after:content-[''] after:absolute after:top-[-16px] after:right-14 after:w-[18px] after:h-[12px] after:bg-transparent after:border-8 after:border-transparent after:border-r-opacity-70 after:border-r-[11px] after:rounded-tr-[25px] after:border-b-opacity-70">
        {response.reply}
      </div>
    </>
  );
};

export default DiaryReply;
