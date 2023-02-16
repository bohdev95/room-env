// models/Location.js

import mongoose, { Schema } from "mongoose";

export interface IScene {
  name: string;
  url: string;
}
export interface IRender {
  name: string;
  url: string;
}

export interface ILocation {
  address?: string;
  scenes?: IScene[];
  renders?: IRender[];
  email: string;
}

const LocationSchema = new mongoose.Schema<ILocation>({
  address: String,
  scenes: [Schema.Types.Mixed],
  renders: [Schema.Types.Mixed],
  email: { type: String, required: true },
});

export default (mongoose.models.Locations as mongoose.Model<ILocation>) ||
  mongoose.model<ILocation>("Locations", LocationSchema);
