import mongoose from "mongoose";
import Preference from "../../dbRedisSchema/preferenceSchema";
import funcObj from "../novels/preference";
import client from "../../dbRedisSchema/redisConnect";

const mongooseSpy = jest.spyOn(mongoose.Types, 'ObjectId') as jest.Mock
mongooseSpy.mockImplementation(() => 'ey274832h3hfhtre3');

jest.mock('../../dbRedisSchema/preferenceSchema', () => {
    const mockPref = {
        findOne : jest.fn(),
        findOneAndUpdate: jest.fn(),
        };
        return {
            __esModule: true,
            default: mockPref, 
        };
});

jest.mock('../../dbRedisSchema/redisConnect', () => {
    const mockClient = {
        exists: jest.fn().mockResolvedValue(true),
        set : jest.fn().mockResolvedValue('1'),
        incr : jest.fn(),
        get : jest.fn().mockResolvedValue('2'),
        del : jest.fn().mockResolvedValue('0'),
    };
    return {
        __esModule: true,
        default: Promise.resolve(mockClient), 
    };
});

afterEach(() => {
    jest.clearAllMocks();
});

test('user preference', async() => {
    let findObj = {visitCount : 2};
    (Preference.findOne as jest.Mock).mockResolvedValue(findObj);
    (Preference.findOneAndUpdate as jest.Mock).mockResolvedValue(() => {return{visitCount : 2}});
    await funcObj.pref('64854662gtegr473', 'A stitch in time', 'others');
    expect(Preference.findOne).toHaveBeenCalled()
    expect(Preference.findOneAndUpdate).toHaveBeenCalled()
});

test('set preference', async() => {
    let prefSpy = jest.spyOn(funcObj, 'pref').mockResolvedValue(1);
    await funcObj.setPref('u486uehwhwh234', 'A stitch in time', 3, 'thriller');
    
    expect(prefSpy).toHaveBeenCalled()
})
