import axios from "axios";

export default async function loginHandler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const apiResponse = await axios.post(
        "https://staging-api.arbolitics.com/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      res.status(apiResponse.status).json(apiResponse.data);
    } catch (error) {
      console.error("Error forwarding request:", error);
      res
        .status(error.response?.status || 500)
        .json({ error: error.response?.data?.message || "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
