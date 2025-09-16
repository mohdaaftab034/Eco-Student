import express from "express";
import { createCompaign, getCompaign, updateCampaignStatus } from "../controller/compaign.controller.js";


const compaignRouter = express.Router();

compaignRouter.get("/", getCompaign);
compaignRouter.post("/", createCompaign);
compaignRouter.put("/:id/status", updateCampaignStatus);

export default compaignRouter;