import roomCreateController from "controllers/room/create";
import { Router } from "express";
import protectWithAuth from "middleware/protected";

const roomRouter = Router();

roomRouter.post("/create", protectWithAuth, roomCreateController);

export default roomRouter;
