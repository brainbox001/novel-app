import pool from "../pool";
pool.submit(1, 'sendMail', {email:'brainboxiq@gmail.com', name:'Dan'}, (code) => {
    console.log(code)
})