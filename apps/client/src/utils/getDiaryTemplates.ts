import config from '../../tailwind.config';
import { DiaryTemplate } from '@/types';
import { PROMPT_TEMPLATE } from '@growiary/prompt';

const colors = config?.theme?.extend?.colors as {
  [key: string]: {
    [key: string]: string;
  };
};
export const diaryTemplates: { [key: string]: DiaryTemplate } = {
  '0': {
    id: '0',
    dateColor: colors?.primary?.[400],
    bgColor: colors?.grayscale?.[100],
    question: PROMPT_TEMPLATE[0].question,
    questionColor: colors?.primary?.[900],
    placeholder: PROMPT_TEMPLATE[0].placeholder,
    caretColor: colors?.branding?.[900],
    answerColor: colors?.grayscale?.[800],
    charSrc: '/assets/growmi/green_letter.svg',
  },
  '1': {
    id: '1',
    dateColor: colors?.primary?.[400],
    bgColor: colors?.sub?.lightYellow,
    question: PROMPT_TEMPLATE[1].question,
    questionColor: colors?.sub?.indigo,
    placeholder: PROMPT_TEMPLATE[1].placeholder,
    caretColor: colors?.branding?.[900],
    answerColor: colors?.primary?.[500],
    charSrc: '/assets/growmi/pink.svg',
  },
  '2': {
    id: '2',
    dateColor: colors?.primary?.[700],
    bgColor: colors?.sub?.pink,
    question: PROMPT_TEMPLATE[2].question,
    questionColor: colors?.sub?.indigo,
    placeholder: PROMPT_TEMPLATE[2].placeholder,
    caretColor: colors?.branding?.[900],
    answerColor: colors?.sub?.indigo,
    charSrc: '/assets/growmi/pink_ribbon.svg',
  },
  '3': {
    id: '3',
    dateColor: colors?.primary?.[400],
    bgColor: colors?.grayscale?.[100],
    question: PROMPT_TEMPLATE[3].question,
    questionColor: colors?.sub?.blue,
    placeholder: PROMPT_TEMPLATE[3].placeholder,
    caretColor: colors?.branding?.[900],
    answerColor: colors?.sub?.blue,
    charSrc: '/assets/growmi/green_issue.svg',
  },
  '4': {
    id: '4',
    dateColor: colors?.primary?.[600],
    bgColor: colors?.sub?.lightPink,
    question: PROMPT_TEMPLATE[4].question,
    questionColor: colors?.sub?.deepRed,
    placeholder: PROMPT_TEMPLATE[4].placeholder,
    caretColor: colors?.branding?.[900],
    answerColor: colors?.sub?.deepRed,
    charSrc: '/assets/growmi/clap.svg',
  },
  '5': {
    id: '5',
    dateColor: colors?.primary?.[600],
    bgColor: colors?.sub?.green,
    question: PROMPT_TEMPLATE[5].question,
    questionColor: colors?.priary?.[900],
    placeholder: PROMPT_TEMPLATE[5].placeholder,
    caretColor: colors?.branding?.[900],
    answerColor: colors?.grayscale?.[900],
    charSrc: '/assets/growmi/sun.svg',
  },
  '6': {
    id: '6',
    dateColor: colors?.primary?.[600],
    bgColor: colors?.sub?.yellow,
    question: PROMPT_TEMPLATE[6].question,
    questionColor: colors?.branding?.[800],
    placeholder: PROMPT_TEMPLATE[6].placeholder,
    caretColor: colors?.branding?.[900],
    answerColor: colors?.branding?.[800],
    charSrc: '/assets/growmi/wings.svg',
  },
  '7': {
    id: '7',
    dateColor: colors?.primary?.[600],
    bgColor: colors?.sub?.lightBlue,
    question: PROMPT_TEMPLATE[7].question,
    questionColor: colors?.sub?.blue,
    placeholder: PROMPT_TEMPLATE[7].placeholder,
    caretColor: colors?.branding?.[900],
    answerColor: colors?.sub?.blue,
    charSrc: '/assets/growmi/blue.svg',
  },
  '8': {
    id: '8',
    dateColor: colors?.primary?.[500],
    bgColor: colors?.sub?.indigo,
    question: PROMPT_TEMPLATE[8].question,
    questionColor: colors?.sub?.lightGreen,
    placeholder: PROMPT_TEMPLATE[8].placeholder,
    caretColor: colors?.brading?.[500],
    answerColor: colors?.sub?.lightGreen,
    charSrc: '/assets/growmi/sprout.svg',
  },
  '9': {
    id: '9',
    dateColor: colors?.primary?.[600],
    bgColor: colors?.sub?.brown,
    question: PROMPT_TEMPLATE[9].question,
    questionColor: colors?.sub?.indigo,
    placeholder: PROMPT_TEMPLATE[9].placeholder,
    caretColor: colors?.branding?.[900],
    answerColor: colors?.sub?.indigo,
    charSrc: '/assets/growmi/worry.svg',
  },
  '10': {
    id: '10',
    dateColor: colors?.primary?.[500],
    bgColor: colors?.sub?.babyPink,
    question: PROMPT_TEMPLATE[10].question,
    questionColor: colors?.sub?.turquoise,
    placeholder: PROMPT_TEMPLATE[10].placeholder,
    caretColor: colors?.branding?.[900],
    answerColor: colors?.sub?.turquoise,
    charSrc: '/assets/growmi/curious.svg',
  },
};
