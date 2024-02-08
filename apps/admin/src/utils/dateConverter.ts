const dateConverter = (timestamp: { _seconds: number; _nanoseconds: number }) => {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
};
export default dateConverter;
