const { json } = require("express");
const express = require("express");
const { createClient } = require("redis");

const PORT = 5003;

const app = express();

app.use(express.json());

const redisClient = createClient();

redisClient.connect();

app.post("/", async (req, res, next) => {
  try {
    const key = await redisClient.set('Key', JSON.stringify(req.body));
    res.status(200).json({
      success: true,
      data: key,
    });
  } catch (e) {
    next(e);
  }
});

app.get("/", async (req, res, next) => {
  try {
    const key = await redisClient.get('Key');
    res.json(key)
  } catch (e) {
    next(e);
  }
});

app.delete("/", async (req, res, next) => {
    try{
        await redisClient.flushAll()
        res.json('Deleted all')
    }catch(e){
        next(e)
    }
});

app.listen(PORT, () => {
  console.log(`app currently running on ${PORT}`);
});
