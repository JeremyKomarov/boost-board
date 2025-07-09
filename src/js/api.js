export const fetchData = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err.message);
    return [];
  }
};
