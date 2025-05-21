import app from "./app"

const PORT = process.env.PORT || 5000

app.listen(PORT , ()=>{
    try {
  app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("❌ Failed to start server:", err);
}

})

