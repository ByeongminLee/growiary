const URL = process.env.URL ?? 'http://localhost:4000';
const authorization = process.env.API_AUTHORIZATION_KEY ?? '';

const fetcher = async ({
  url,
  method,
}: {
  url: 'profile' | 'post';
  method?: 'GET' | 'POST';
}) => {
  try {
    const res = await fetch(`${URL}/api/${url}`, {
      method: method ?? 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorization}`,
      },
    });

    return res.json();
  } catch (error) {
    return error;
  }
};

export default fetcher;
