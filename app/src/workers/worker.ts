import { parentPort } from "worker_threads";
import transporter from "./mailTp";

parentPort?.on("message", ({ taskName, options }) => {
    switch (taskName) {
      case "sendMail":
        let code = 12345.
        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
          // send mail with defined transport object
          await transporter.sendMail({
            from: '"Novel-app" <momsdboy@gmail.com>', // sender address
            to: options.email, // list of receivers
            subject: "User verification code", // Subject line
            html: `
            <p>Dear ${options.name}, your verification code is;</p>
            <h3>${code.toString()}</h3>
            `, // html body
          });

          parentPort?.postMessage(code)
        }
        main().catch((error) => {
          console.log(error)
        })
        break;
      default:
        parentPort?.postMessage("Unknown task");
    }
  });
