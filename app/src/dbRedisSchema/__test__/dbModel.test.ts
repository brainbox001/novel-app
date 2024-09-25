import mongoose from 'mongoose';
import User from '../userSchema';
import Preference from '../preferenceSchema';
import connectDB from '../dbConnect';

beforeAll(async () => {
  await connectDB()
  await User.deleteMany({})

})

afterEach(async () => {
    await User.deleteMany({})

})

afterAll(async () => {
  await Preference.deleteMany({});
  await mongoose.connection.close();
})

describe('model tests', () => {
  it('can create a new user', async () => {
    await new User({name:'Daniel', email: 'dan@test.com', password: {
      string: '3idfhr4i3rhrhrh:ei4jfhgjttirjernt',
      salt: '3idfhr4i3rhrhrh'
  }, emailIsVerified : true}).save()
    const userCount = await User.countDocuments()
    expect(userCount).toEqual(1)
  });
  it('can check for db validations', async () => {
    let error:any
    try {
      await new User({name:'Daniel'}).save()
    } catch (err) {
      error = err
    }
    expect(error).not.toBe(null)
    expect(error.name).toBe('ValidationError')
  });
  it('can check for duplicate emails', async() => {
    let emailError: any
    await new User({name:'Daniel', email: 'dan@test.com', password: {
      string: '3idfhr4i3rhrhrh:ei4jfhgjttirjernt',
      salt: '3idfhr4i3rhrhrh'
  }, emailIsVerified : true}).save()
    try {
      await new User({name:'Daniel', email: 'dan@test.com', password: {
        string: '3idfhr4i3rhrhrh:ei4jfhgjttirjernt',
        salt: '3idfhr4i3rhrhrh'
    }, emailIsVerified : true}).save()
    } catch (err) {
      emailError = err
    }
    const userCount = await User.countDocuments()
    expect(userCount).toEqual(1)
    expect(emailError instanceof Error).toBeTruthy()
  });

  it ('testing mongoose.Types and Preference model methods', async () => {
    let userId: mongoose.Types.ObjectId;
    userId = new mongoose.Types.ObjectId('66ea1b2c954e');
    console.log('converted userId - ', userId);
    let novelName = 'a stitch in time saves nine';
    let category = 'thriller';
    let doc : any;
    let updatedDoc: any;
  
    try {
      doc = await Preference.findOne({ userId, novelName });
  
      let existingDoc = await Preference.findOne({ userId, category });
  
      let ttlValue: Date | undefined;
      if (existingDoc && existingDoc.visitCount > 10) {
        ttlValue = undefined; 
      } else {
        ttlValue = new Date(Date.now() + 60 * 60 * 24 * 1000 * 30);
      }

      updatedDoc = await Preference.findOneAndUpdate(
        { userId, category },
        {
          $inc: { visitCount: 1 },
          $set: { ttl: ttlValue },
        },
        { new: true, upsert: true }
      );
  
      if (updatedDoc) {
        let pIdString = updatedDoc._id;
        let pId = new mongoose.Types.ObjectId(pIdString.toString());
        console.log('preference id -', pId);
        console.log("updated or new document -", updatedDoc);
      }
    } catch (err: any) {
      console.error("Error:", err);
    }
    expect(doc).toBeNull();
  });

  it ('updates a document that already exists', async () => {
    let userId: mongoose.Types.ObjectId;
    userId = new mongoose.Types.ObjectId('66ea1b2c954e');
    console.log('converted userId - ', userId);
    let category = 'thriller';
    let updatedDoc: any;
    let visitCount: string | undefined;
  
    try {
      let existingDoc = await Preference.findOne({ userId, category });
  
      let ttlValue: Date | undefined;
      if (existingDoc && existingDoc.visitCount > 10) {
        ttlValue = undefined; 
      } else {
        ttlValue = new Date(Date.now() + 60 * 60 * 24 * 1000 * 40);
      }

      updatedDoc = await Preference.findOneAndUpdate(
        { userId, category },
        {
          $inc: { visitCount: 1 },
          $set: { ttl: ttlValue },
        },
        { new: true, upsert: true }
      );
  
      if (updatedDoc) {
        let pIdString = updatedDoc._id;
        visitCount = updatedDoc.visitCount;
        let pId = new mongoose.Types.ObjectId(pIdString.toString());
        console.log('preference id -', pId);
        console.log("updated or new document -", updatedDoc);
      }
    } catch (err: any) {
      console.error("Error:", err);
    }
    expect(visitCount).toEqual(2);
  });
  
})