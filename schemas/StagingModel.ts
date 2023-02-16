import mongoose from 'mongoose'
export interface IStagingModel {
  name: string;
  //TODO: this should be a base type of one of our categories, should inherit from a list of 
  // categories
  baseType: string;
  lightImgURL: string,
  heavyImgURL: string,
  thumbImgURL: string,
  previewRenderImgURL: string,
  // TODO: this should be an array of string, but inherit from a list of static tags
  // that we will create i.e. chairs can have a multiple tags like dining or oudoor tags
  groups?: Array<string> 
}

const StagingModelSchema = new mongoose.Schema<IStagingModel>({
  name: String,
  lightImgURL: String,
  heavyImgURL: String,
  thumbImgURL: String,
  previewRenderImgURL: String,
  groups: Array<string>
})

export default mongoose.models.StagingModels as mongoose.Model<IStagingModel> || mongoose.model('StagingModels', StagingModelSchema)



