import User from "../../../schemas/User";
import dbConnect from "../../../lib/dbConnect";
import handler from "../v1/resources/signupHandler";
import { NextApiRequest, NextApiResponse } from "next";

handler.post(createUser);

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;

  dbConnect();

  const user = await User.create(data);

  res.status(201).json({ message: "Created user!" });
}

export default handler;
