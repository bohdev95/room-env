import dbConnect from "../../../../../../lib/dbConnect";
import Locations from "../../../../../../schemas/Location";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const location = await Locations.findById(id);
        res.status(200).json({ success: true, data: location });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        res.status(201).json("You tried to post here, please implement me");
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
/****** POST ******

curl --request POST \
  --url http://localhost:3000/api/v1/locations \
  --header 'Content-Type: application/json' \
  --data '{
 "address": "1234",
}'

*************/

/***** GET *******

curl --request GET \
  --url http://localhost:3000/api/locations \
  --header 'Content-Type: application/json'
  
*************/
