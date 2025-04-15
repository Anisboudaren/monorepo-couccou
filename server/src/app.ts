import express from "express";
import cors from "cors"
import morgen from "morgan"
import dotenv from "dotenv"

dotenv.config()

const app = express()



app.use(cors())
app.use(express.json())

app.use(morgen("dev"))


app.get("/" , async (req , res)=>{
    res.send("API is up and running 🚀")
})

import userRoutes from "./routes/user.routes."
app.use("/user" , userRoutes)

export default app ;