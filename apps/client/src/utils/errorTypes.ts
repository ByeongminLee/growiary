export const NO_USER_ERROR = 'User Not Founded';
export const SERVER_ERROR = 'Server Error';
export const serverError = () => {
  const error = new Error('Network response was not ok');
  error.name = SERVER_ERROR;
  return error;
};
