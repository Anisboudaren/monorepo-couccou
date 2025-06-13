"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scrape_controllers_1 = require("../controllers/scrape.controllers");
const router = (0, express_1.Router)();
router.post('/links', scrape_controllers_1.scrapeController);
router.post('/content', scrape_controllers_1.scrapeContentController);
exports.default = router;
