import dbConnect from "../../../../../lib/dbConnect"
import StagingModel from "../../../../../schemas/StagingModel"


export default async function handler (req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const users = await StagingModel.find({})
        res.status(200).json({ success: true, data: users })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        const user = await StagingModel.create(req.body)
        res.status(201).json({ success: true, data: user })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}

/****** POST ******

curl --request POST \
  --url http://localhost:3000/api/v1/resources/stagingModels \
  --header 'Content-Type: application/json' \
  --data '{
        "name": "another really nice chair",
        "baseType": "chair",
        "lightImgURL": "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
        "heavyImgURL": "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
        "thumbImgURL": "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
        "previewRenderImgURL": "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg"
}'

*************/

/***** GET *******

curl --request GET \
  --url http://localhost:3000/api/v1/resources/stagingModels \
  --header 'Content-Type: application/json'
  
*************/