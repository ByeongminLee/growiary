export const dateConverter = (timestamp: { _seconds: number; _nanoseconds: number }) => {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
};

export const dataFromOpenAIResult = data => {
  const id = data.id;
  const created = data.created;
  const usage = data.usage;
  const content = data.choices[0].message.content;

  return { id, created, usage, content };
};
