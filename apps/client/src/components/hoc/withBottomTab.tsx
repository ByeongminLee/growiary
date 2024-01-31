import React, { ComponentType, useLayoutEffect, useState } from 'react';
import Tab from '@/components/ui/Tab';

const getVh = () => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
  return document.documentElement.style.getPropertyValue('--vh');
};

const withBottomTab = <T extends {}>(Component: ComponentType<T>) => {
  return function HocComponent(props: T) {
    const [viewHeight, setViewHeight] = useState('100%');
    const setVh = () => {
      setViewHeight(
        `calc(${getVh()} - 80px - env(safe-area-inset-top) - env(safe-area-inset-bottom))`,
      );
    };

    useLayoutEffect(() => {
      window.addEventListener('resize', setVh);
      setVh();

      return () => {
        window.removeEventListener('resize', setVh);
      };
    }, []);

    return (
      <>
        <main
          style={{
            position: 'relative',
            height: `${viewHeight}`,
          }}
        >
          <Component maxHeight={`${viewHeight}`} {...props} />
        </main>
        <Tab />
      </>
    );
  };
};

export default withBottomTab;
