import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { accessToken, location_id, limit } = req.query;

    if (!accessToken) {
      return res.status(400).json({ error: "Access token is required" });
    }

    if (!location_id) {
      return res.status(400).json({ error: "Location ID is required" });
    }

    try {
      const apiResponse = await axios.get("https://staging-api.arbolitics.com/data/getArboliticsDataset", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: {
          location_id: location_id,
          limit: Number(limit),
        },
      });

      const data = apiResponse.data;
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching dataset:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
