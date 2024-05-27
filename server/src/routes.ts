import express, { Request, Response } from "express"
import { chat } from "./handler"

const router = express.Router()

router.post("/chat", chat)

export default router