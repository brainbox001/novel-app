import { Request } from "express";

declare global{
    namespace Express{
      interface Request{
        user:{};
        novelName:string;
        user_id : string;
        user_name: string;
      }
    }
  }