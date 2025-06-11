import { Router } from 'express';
import { scrapeController , scrapeContentController } from '../controllers/scrape.controllers';

const router = Router();

router.post('/links', scrapeController);

router.post('/content', scrapeContentController);
export default router;
