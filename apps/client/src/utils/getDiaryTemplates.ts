import config from '../../tailwind.config';
import { DiaryTemplate } from '@/types';

const colors = config?.theme?.extend?.colors as {
  [key: string]: {
    [key: string]: string;
  };
};
export const diaryTemplates: { [key: string]: DiaryTemplate } = {
  '1': {
    id: 1,
    bgColor: colors?.sub?.lightYellow,
    question: `오늘 새롭게 알게된 일은 \n무엇인가요`,
    questionColor: colors?.sub?.indigo,
    placeholder: '오늘 새롭게 알게된 일은..',
    answerColor: colors?.primary?.['500'],
    charSrc: '/assets/growmi/pink.svg',
  },
  '2': {
    id: 2,
    bgColor: colors?.sub?.pink,
    question: '오늘 나를 위해 \n내가 해준 일이 있나요',
    questionColor: colors?.sub?.indigo,
    placeholder: '나를 위해 해준 일은...',
    answerColor: colors?.sub?.indigo,
    charSrc: '/assets/growmi/pink_ribbon.svg',
  },
  '3': {
    id: 3,
    bgColor: colors?.grayscale?.['100'],
    question: '오늘 세상에는 \n어떤 이슈가 있었나요.',
    questionColor: colors?.sub?.blue,
    placeholder: '오늘 세상에는...',
    answerColor: colors?.sub?.blue,
    charSrc: '/assets/growmi/green_issue.svg',
  },
  '4': {
    id: 4,
    bgColor: colors?.sub?.lightPink,
    question: '오늘 하루 가장 잘 한 일을 \n떠올려봐요',
    questionColor: colors?.sub?.deepRed,
    placeholder: '오늘 내가 가장 잘 한 일은....',
    answerColor: colors?.sub?.deepRed,
    charSrc: '/assets/growmi/clap.svg',
  },
  '5': {
    id: 5,
    bgColor: colors?.sub?.green,
    question: '오늘 나에게 가장 큰 영향을 \n준 사람은 누구인가요',
    questionColor: colors?.priary?.['900'],
    placeholder: '오늘 가장 영향을 준 사람은...',
    answerColor: colors?.grayscale?.['900'],
    charSrc: '/assets/growmi/sun.svg',
  },
  '6': {
    id: 6,
    bgColor: colors?.sub?.yellow,
    question: '오늘 감사한 일 \n세 가지를 적어봅니다',
    questionColor: colors?.branding?.['800'],
    placeholder: '오늘 감사했던 일 중 하나는...',
    answerColor: colors?.branding?.['800'],
    charSrc: '/assets/growmi/wings.svg',
  },
  '7': {
    id: 7,
    bgColor: colors?.sub?.lightBlue,
    question: '오늘 나를 힘들게 했던 \n대상이 있나요',
    questionColor: colors?.sub?.blue,
    placeholder: '오늘 나를 힘들게 했던 건...',
    answerColor: colors?.sub?.blue,
    charSrc: '/assets/growmi/blue.svg',
  },
  '8': {
    id: 8,
    bgColor: colors?.sub?.indigo,
    question: '오늘 나는 \n성장했다고 느껴지나요',
    questionColor: colors?.sub?.lightGreen,
    placeholder: '나는 오늘 얼마나 성장했을까... ',
    answerColor: colors?.sub?.lightGreen,
    charSrc: '/assets/growmi/sprout.svg',
  },
  '9': {
    id: 9,
    bgColor: colors?.sub?.brown,
    question: '요즘 가장 큰 고민거리는 \n무엇인가요',
    questionColor: colors?.sub?.indigo,
    placeholder: '요즘 가장 고민하고 있는 건...',
    answerColor: colors?.sub?.indigo,
    charSrc: '/assets/growmi/worry.svg',
  },
  '10': {
    id: 10,
    bgColor: colors?.sub?.babyPink,
    question: '오늘, 지금 나의 감정은 \n어떤가요',
    questionColor: colors?.sub?.turquoise,
    placeholder: '오늘 나의 감정은...',
    answerColor: colors?.sub?.turquoise,
    charSrc: '/assets/growmi/curious.svg',
  },
};
