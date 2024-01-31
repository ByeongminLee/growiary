import config from '../../tailwind.config';

const colors = config?.theme?.extend?.colors as {
  [key: string]: {
    [key: string]: string;
  };
};
export const diaryTemplates = [
  {
    id: 1,
    bgColor: colors?.sub?.lightYellow,
    question: `오늘 새롭게 알게된 일은 \n무엇인가요`,
    questionColor: colors?.sub?.indigo,
    placeholder: 'A. 그루미와 함께 대화하다보면  어느샌가 성장해 있을 거에요',
    answerColor: colors?.primary?.['500'],
    charSrc: '/assets/growmi/green_letter.svg',
  },
  {
    id: 2,
    bgColor: colors?.sub?.pink,
    question: '오늘 나를 위해 \n내가 해준 일이 있나요',
    questionColor: colors?.sub?.indigo,
    placeholder: 'A. 나를 위해 해준 일은...',
    answerColor: colors?.sub?.indigo,
    charSrc: '/assets/growmi/green_letter.svg',
  },
  {
    id: 3,
    bgColor: colors?.grayscale?.['100'],
    question: '오늘 세상에는 \n어떤 이슈가 있었나요.',
    questionColor: colors?.sub?.blue,
    placeholder: 'A. 오늘 이슈는...',
    answerColor: colors?.sub?.blue,
    charSrc: '/assets/growmi/green_letter.svg',
  },
  {
    id: 4,
    bgColor: colors?.sub?.lightPink,
    question: '오늘 하루 가장 잘 한 일을 \n떠올려봐요',
    questionColor: colors?.sub?.deepRed,
    placeholder: 'A. 오늘 가장 잘한 일은...',
    answerColor: colors?.sub?.deepRed,
    charSrc: '/assets/growmi/green_letter.svg',
  },
  {
    id: 5,
    bgColor: colors?.sub?.green,
    question: '오늘 나에게 가장 큰 영향을 \n준 사람은 누구인가요',
    questionColor: colors?.priary?.['900'],
    placeholder: 'A. 오늘 가장 영향을 준 사람은...',
    answerColor: colors?.grayscale?.['900'],
    charSrc: '/assets/growmi/green_letter.svg',
  },
  {
    id: 6,
    bgColor: colors?.sub?.yellow,
    question: '오늘 감사한 일 \n세 가지를 적어봅니다',
    questionColor: colors?.branding?.['800'],
    placeholder: 'text',
    answerColor: colors?.branding?.['800'],
    charSrc: '/assets/growmi/green_letter.svg',
  },
  {
    id: 7,
    bgColor: colors?.sub?.lightBlue,
    question: '오늘 나를 힘들게 했던 \n대상이 있나요',
    questionColor: colors?.sub?.blue,
    placeholder: 'text',
    answerColor: colors?.sub?.blue,
    charSrc: '/assets/growmi/blue.svg',
  },
  {
    id: 8,
    bgColor: colors?.sub?.indigo,
    question: '오늘 나는 \n성장했다고 느껴지나요',
    questionColor: colors?.sub?.lightGreen,
    placeholder: 'text',
    answerColor: colors?.sub?.lightGreen,
    charSrc: '/assets/growmi/green_letter.svg',
  },
  {
    id: 9,
    bgColor: colors?.sub?.brown,
    question: '요즘 가장 큰 고민거리는 \n무엇인가요',
    questionColor: colors?.sub?.indigo,
    placeholder: 'text',
    answerColor: colors?.sub?.indigo,
    charSrc: '/assets/growmi/green_letter.svg',
  },
  {
    id: 10,
    bgColor: colors?.sub?.babyPink,
    question: '오늘, 지금 나의 감정은 \n어떤가요',
    questionColor: colors?.sub?.turquoise,
    placeholder: 'text',
    answerColor: colors?.sub?.turquoise,
    charSrc: '/assets/growmi/green_letter.svg',
  },
];
