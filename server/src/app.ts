import express from "express"
import { Application, Request, Response } from "express"
import router from "./routes"
import cors from "cors"
const app: Application = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: "50mb" }))
app.use(cors())
app.use((req: Request, res: Response, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`)
  next()
})

app.get("/", (req: Request, res: Response) => {
  res.send("Server is listening.")
})
app.use("/api", router)

export default app
