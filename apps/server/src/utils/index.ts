/**
 * firestore의 timestamp를 Date 객체로 변환합니다
 * @param timestamp firestore의 timestamp
 * @returns Date 객체
 */
export const dateConverter = (timestamp: { _seconds: number; _nanoseconds: number }) => {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
};

/**
 * openAI의 결과값 중 사용할 값을 반환합니다
 * @param data openAI 결과값
 * @returns 사용할 openAI 결과값
 */
export const dataFromOpenAIResult = data => {
  const id = data.id;
  const created = data.created;
  const usage = data.usage;
  const content = data.choices[0].message.content;

  return { id, created, usage, content };
};
