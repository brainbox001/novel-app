import express, { Request, Response, NextFunction} from 'express';
import userRoutes from './routers/userRoute';
import cookieParser from 'cookie-parser';
import connectDB from './dbRedisSchema/dbConnect';

connectDB()

const app = express();
const port = 3001;

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({welcome: 'Welcome to novel app'})
  });

app.use('/user', userRoutes);

app.use((err: any, req:Request, res:Response, next:NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});

