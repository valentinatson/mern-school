const express = require("express");
const userRoute = require("./Routes/userRoute")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())




app.use("/user" , userRoute)


app.listen(5000 || process.env.PORT)