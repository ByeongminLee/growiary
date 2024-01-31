import React from 'react';
import Link from 'next/link';

const Tab = () => {
  return (
    <nav className="tab">
      <ul className="flex h-full">
        <li className="grow bg-[#abcdef]">
          <Link href="/">Main</Link>
        </li>
        <li className="grow bg-[#aa33cc]">
          <Link href="/calendar">Calendar</Link>
        </li>
        <li className="grow bg-[#fedcba]">
          <Link href="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Tab;
