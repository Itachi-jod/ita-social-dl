const axios = require("axios");
const FormData = require("form-data");

module.exports = async (req, res) => {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const path = req.url.split("?")[0]; // Get the path
  const query = req.query;

  // Root endpoint
  if (path === "/api/" || path === "/api") {
    return res.status(200).json({
      success: true,
      endpoint: "/",
      author: "ItachiXD",
      message:
        "Welcome to the YouTube Downloader API. Use /api/download?url=<VIDEO_URL> to download videos.",
    });
  }

  // Download endpoint
  if (path === "/api/download") {
    const videoUrl = query.url;

    if (!videoUrl) {
      return res.status(400).json({ error: "Missing ?url=" });
    }

    try {
      const form = new FormData();
      form.append("url", videoUrl);

      const response = await axios.post(
        "https://tools.xrespond.com/api/youtube/video/downloader",
        form,
        {
          headers: {
            ...form.getHeaders(),
            authority: "tools.xrespond.com",
            accept: "application/json",
            origin: "https://downsocial.io",
            referer: "https://downsocial.io/",
            "sec-ch-ua": `"Chromium";v="137", "Not/A)Brand";v="24"`,
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": `"Android"`,
            "user-agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
          },
        }
      );

      return res.status(200).json({
        success: true,
        endpoint: "/download",
        author: "ItachiXD",
        data: response.data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Upstream API failed",
        error: error.message,
      });
    }
  }

  // If path doesn't match
  return res.status(404).json({ error: "Endpoint not found" });
};
