import express, { Request, Response, NextFunction} from 'express';
import userRoutes from './routers/userRoute';
import novelRoutes from './routers/novelRoute';
import cookieParser from 'cookie-parser';
import connectDB from './dbRedisSchema/dbConnect';
import checkToken from './middlewares/tokenCheck';

connectDB()

const app = express();
const port = 3001;

app.use(express.json());
app.use(cookieParser());
app.use(checkToken);

app.get('/', (req: Request, res: Response) => {
  let userAgent: string | undefined;
  userAgent = req.headers['user-agent']
    res.status(200).json({welcome: `Welcome to novel app ${userAgent}`})
  });

app.use('/user', userRoutes);
app.use('/novel', novelRoutes);

app.use((err: any, req:Request, res:Response, next:NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});

