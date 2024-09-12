import pool from "../pool";

test('worker pool test', () => {
    const insert = jest.spyOn(pool.scheduledTasks, 'insert')
    const remove = jest.spyOn(pool.scheduledTasks, 'insert')
    let fn = jest.fn().mockResolvedValue('12345')
    for (let i = 1; i < 4; i++) {
        pool.submit(4 - i, 'senMail', {email: 'brainboxiq@gmail.com', name:'Dan'}, fn);
    }
    
    expect(insert).toHaveBeenCalledTimes(3)
  
    expect(remove).toHaveBeenCalledTimes(3)
    expect(remove).toHaveReturnedTimes(3)

    insert.mockRestore()
    remove.mockRestore()
})