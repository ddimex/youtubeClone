const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/api/youtube", async (req, res) => {
  const { q, category } = req.query;

  try {
    let response;

    if (q) {
      response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            q,
            key: process.env.YOUTUBE_API_KEY,
            maxResults: 50,
            type: "video",
            regionCode: "US",
          },
        }
      );
    } else if (category) {
      response = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet,contentDetails,statistics",
            chart: "mostPopular",
            maxResults: 50,
            regionCode: "US",
            videoCategoryId: category,
            key: process.env.YOUTUBE_API_KEY,
          },
        }
      );
    } else {
      response = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet,contentDetails,statistics",
            chart: "mostPopular",
            maxResults: 50,
            regionCode: "US",
            key: process.env.YOUTUBE_API_KEY,
          },
        }
      );
    }

    res.json(response.data);
  } catch (error) {
    console.error("YouTube API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch from YouTube API" });
  }
});

app.get("/api/youtube/channel", async (req, res) => {
  const { id } = req.query;

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "snippet",
          id,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Channel fetch error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch channel info" });
  }
});

const PORT = 10000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
