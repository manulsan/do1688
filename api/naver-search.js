export default async function handler(req, res) {
  const query = req.query.query;
  const start = req.query.start || 1;
  const display = req.query.display || 100;
  const sort = req.query.sort || 'sim';
  const r = await fetch(
    `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&start=${start}&display=${display}&sort=${sort}`,
    {
      headers: {
        'X-Naver-Client-Id': req.query.Client_Id,
        'X-Naver-Client-Secret': req.query.Client_Secret,
      },
    },
  );

  const data = await r.json();
  res.status(200).json(data);
}
