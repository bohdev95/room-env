import dbConnect from "../../../../lib/dbConnect";
import Locations from "../../../../schemas/Location";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const locations = await Locations.find({});
        res.status(200).json({ success: true, data: locations });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const location = await Locations.create(req.body);
        res.status(201).json({ success: true, data: location });
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
