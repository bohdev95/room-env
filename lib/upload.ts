// import formidable from "./formidable-serverless";
import { createReadStream } from "fs";
import { IncomingMessage } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import parseForm from "./parseForm";
import * as gcs from "./storage";
import { Response } from "express";
import formidable from "formidable-serverless";

export const upload = async (
    req: NextApiRequest | IncomingMessage,
    res: NextApiResponse | Response
) => {
    const form = formidable();
    const { fields, files } = await parseForm(form, req);

    const file = files.file as any;
    const bucket_path = fields.filepath as string;
    createReadStream(file.path)
        .pipe(gcs.createWriteStream(bucket_path + '/' + file.name.toString(), file.type))
        .on("finish", () => {
            res.status(200).json({success: true, data: bucket_path + '/' + file.name.toString()});
        })
        .on("error", (err) => {
            console.error(err.message);
            res.status(500).json("File upload error: " + err.message);
        });
};
