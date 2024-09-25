import express from "express";
import tempSaveContent, {tempSaveNameAndImage} from "../controllers/novels/tempSaveNovel";
import publishNovel from "../controllers/novels/publishNovel";
import multer from 'multer';
import { duplicateName, isAuthenticated, chapters } from "../middlewares/novel";
import compression from 'compression';
import recommender from "../controllers/novels/recommend";
import { getChapter } from "../controllers/novels/getChapter";

const upload = multer();
const novelRoutes = express.Router();
novelRoutes.use(express.json());
novelRoutes.use(compression({
    level: 6,
    threshold: 128
}));

novelRoutes.get('/recommended', recommender);
novelRoutes.get('/:category/:novelName/:chapterNum', chapters, getChapter);
novelRoutes.post('/save-name-and-image', upload.single('coverPhoto'), isAuthenticated, duplicateName, tempSaveNameAndImage);
novelRoutes.post('/save-content', isAuthenticated, tempSaveContent);

novelRoutes.post('/publish', isAuthenticated, publishNovel);
export default novelRoutes;