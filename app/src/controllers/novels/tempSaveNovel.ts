import { Request, Response } from "express";
import client from "../../dbRedisSchema/redisConnect";
import Content from "../../dbRedisSchema/contentSchema";

export async function tempSaveNameAndImage(req:Request, res:Response) {
    let novelName : string;
    novelName = req.novelName;

    const image = req.file;
    if (!image) {
      return res.status(400).json({error:'Novel image are required.'});
    };

    const nameExists = await (await client).exists(novelName);
    if (nameExists) return res.status(400).json({error:'Novel name already exists temp.'});
    
    await (await client).set(novelName, novelName, {
      EX: 60 * 60 * 24
    });
    const imageKey = `${novelName}:image`;
    (await client).hSet(imageKey, {
        "mimeType": image.mimetype,
        "imageBuffer" : image.buffer,
    });
    (await client).expire(imageKey, 24 * 60 * 60 * 1000);

    let imageStr = image.buffer.toString('base64');
    res.status(200).json({
        message: 'Name and Image tempoarily stored.',
        novelName,
        fileInfo: {
          mimeType: image.mimetype,
          imageStr
        },
      });
};

export default async function tempSaveContent(req:Request, res:Response) {
  let novelName : string;
  const body = req.body
  novelName = req.novelName;
  const content = body.content;

  if (!content) {
    return res.status(400).json({error:'Invalid details submitted.'})
  };

  const nameExists = await (await client).exists(novelName);
  if (!nameExists) return res.status(400).json({error:"Novel not found or deleted."});
  const contentListExists = await (await client).exists(`${novelName}:contentIds`);

  const newContent = new Content({
    content
  });

  await newContent.save();
  let contentId =  await newContent._id;
 
  (await client).rPush(`${novelName}:contentIds`, contentId.toString());
 
  if(!contentListExists) await (await client).expire(`${novelName}:contentIds`, 86270);

  res.status(201).json({
    message: 'content saved'
  });
};