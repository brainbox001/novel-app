import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "momsdboy@gmail.com",
    pass: "drjhcrmmdilimqxp",
  },
});
export default transporter
