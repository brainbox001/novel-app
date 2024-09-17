import express from "express";
import tempSaveContent, {tempSaveNameAndImage} from "../controllers/novels/tempSaveNovel";
import publishNovel from "../controllers/novels/publishNovel";
import multer from 'multer';
import { duplicateName, isAuthenticated } from "../middlewares/novel";

const upload = multer();
const novelRoutes = express.Router();
novelRoutes.use(express.json());

novelRoutes.post('/save-name-and-image', upload.single('coverPhoto'), isAuthenticated, duplicateName, tempSaveNameAndImage);
novelRoutes.post('/save-content', isAuthenticated, tempSaveContent);

novelRoutes.post('/publish', isAuthenticated, publishNovel);
export default novelRoutes;