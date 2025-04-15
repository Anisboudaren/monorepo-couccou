import app from "./app"

const PORT = process.env.PORT || 5000

app.listen(PORT , ()=>{
    console.log(`Serve is listening at http://localhost:${PORT} 🤖`);
})

