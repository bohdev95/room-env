// export default function handler(req, res) {
//     res.status(200).json({ text: 'Hello' });
//   }

export default function handler(request, response) {
  const { method } = request;


  if (method === "GET") {
    response.status(200).json({ text: 'Hello' });
  }

//   if (method === "POST") {
//     const { body } = request;
//     data.push({ ...body, id: data.length + 1 });
//     return response.status(200).json(data);
//   }
}