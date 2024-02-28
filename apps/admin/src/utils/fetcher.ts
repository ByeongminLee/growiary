const URL = process.env.URL ?? 'http://localhost:4000';
const authorization = process.env.API_AUTHORIZATION_KEY ?? '';

const fetcher = async ({
  url,
  method,
  body,
}: {
  url: 'profile' | 'post' | 'admin-guard' | 'update-profile' | 'update-post';
  method?: 'GET' | 'POST';
  body?: any;
}) => {
  try {
    const res = await fetch(`${URL}/api/${url}`, {
      method: method ?? 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorization}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    return error;
  }
};

export default fetcher;
