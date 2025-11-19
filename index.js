const axios = require("axios");
const FormData = require("form-data");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    return res
      .status(405)
      .send(JSON.stringify({ error: "Only GET allowed" }, null, 2));
  }

  // Determine endpoint based on path
  const path = req.url.split("?")[0]; // remove query string

  if (path === "/" || path === "") {
    // Info endpoint
    return res.status(200).send(
      JSON.stringify(
        {
          success: true,
          endpoint: "/",
          author: "ItachiXD",
          message:
            "Welcome to the YouTube Downloader API. Use /download?url=<VIDEO_URL> to download videos.",
        },
        null,
        2
      )
    );
  } else if (path === "/download") {
    // Download endpoint
    const videoUrl = req.query.url;
    if (!videoUrl) {
      return res
        .status(400)
        .send(JSON.stringify({ error: "Missing ?url=" }, null, 2));
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
            "authority": "tools.xrespond.com",
            "accept": "application/json",
            "origin": "https://downsocial.io",
            "referer": "https://downsocial.io/",
            "sec-ch-ua": `"Chromium";v="137", "Not/A)Brand";v="24"`,
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": `"Android"`,
            "user-agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
          },
        }
      );

      return res.status(200).send(
        JSON.stringify(
          {
            success: true,
            endpoint: "/download",
            author: "ItachiXD",
            data: response.data,
          },
          null,
          2
        )
      );
    } catch (error) {
      return res.status(500).send(
        JSON.stringify(
          {
            success: false,
            message: "Upstream API failed",
            error: error.message,
          },
          null,
          2
        )
      );
    }
  } else {
    // Unknown path
    return res
      .status(404)
      .send(JSON.stringify({ error: "Endpoint not found" }, null, 2));
  }
};
