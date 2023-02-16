import type { NextApiRequest, NextApiResponse } from "next";
import { download } from "../../../../lib/download";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(400).send(`Invalid method: ${req.method}`);
    return;
  }

  download(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
