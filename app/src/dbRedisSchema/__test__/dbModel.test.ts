import mongoose from 'mongoose'
import User from '../userSchema'
import connectDB from '../dbConnect'

beforeAll(async () => {
  await connectDB()
  await User.deleteMany({})

})

afterEach(async () => {
    await User.deleteMany({})
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('user model tests', () => {
  it('can create a new user', async () => {
    await new User({name:'Daniel', email: 'dan@test.com', password: 'testpass', emailIsVerified : true}).save()
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
    await new User({name:'Daniel', email: 'dan@test.com', password: 'testpass', emailIsVerified : true}).save()
    try {
      await new User({name:'Daniel', email: 'dan@test.com', password: 'testpass', emailIsVerified : true}).save()
    } catch (err) {
      emailError = err
    }
    const userCount = await User.countDocuments()
    expect(userCount).toEqual(1)
    expect(emailError instanceof Error).toBeTruthy()
  });
})