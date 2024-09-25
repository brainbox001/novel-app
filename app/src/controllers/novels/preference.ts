import mongoose from "mongoose";
import Preference from "../../dbRedisSchema/preferenceSchema";
import client from "../../dbRedisSchema/redisConnect";

interface FuncObj {
  pref : (_user:string, novel:string, category:string) => Promise<"User not registered" | "Novel name not provided" | 0 | 1>
  setPref : (_user:string, novel:string, totalChapter:number, category:string) => Promise<void>
}

const funcObj : FuncObj = {
  pref : userPreference,
  setPref : setPreference
}
async function setPreference(_user: string, novel: string, totalChapter: number, category: string) {
  let readCount:number;
  let readPercent:number;

  if(!(await (await client).exists(`${_user}:${novel}`))){
    (await client).set(`${_user}:${novel}`, 1, {
      EX: 60 * 60 * 24
    });
  }else{
  await (await client).incr(`${_user}:${novel}`);
  const redisCount: string | null = (await (await client).get(`${_user}:${novel}`));
  readCount = parseInt(redisCount!);
  readPercent = (readCount / totalChapter) * 100;
  if (readPercent >= 40) {
      await funcObj.pref(_user, novel, category);
      (await client).del(`${_user}:${novel}`);
    }
  };
};

async function userPreference(
  dbUserId: string,
  novelName: string,
  category: string
) {
  if (!dbUserId) return "User not registered";
  if (!novelName) return "Novel name not provided";

  let userId: mongoose.Types.ObjectId;
  userId = new mongoose.Types.ObjectId(dbUserId);

  try {
    let doc = await Preference.findOne({ userId, novelName });

    if (doc) {
      return 0
    }

    let existingDoc = await Preference.findOne({ userId, category }, 'visitCount');
    console.log('exisiting Doc - ', existingDoc);
    let ttlValue: Date | undefined;
    if (existingDoc && existingDoc.visitCount >= 10) {
      ttlValue = undefined;
    } else {
      ttlValue = new Date(Date.now() + 60 * 60 * 24 * 1000 * 30);
    }

    const updatedDoc = await Preference.findOneAndUpdate(
      { userId, category },
      {
        $inc: { visitCount: 1 },
        $set: { ttl: ttlValue },
      },
      { new: true, upsert: true }
    );

    if (updatedDoc) {
      console.log("updated or new document -", updatedDoc);
    }
    new Preference({
      userId,
      category,
      novelName
    }).save();
    
  } catch (err: any) {
    console.error("Error:", err);
    return 0;
  }
  return 1
};

export default funcObj;