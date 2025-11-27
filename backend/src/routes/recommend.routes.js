import { Router } from "express";
import fetch from "node-fetch";

const recommendedRoutes = Router();

recommendedRoutes.get("/recommended", async (req, res) => {
  try {
    const response = await fetch(
      "https://openlibrary.org/subjects/fantasy.json?limit=12"
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Recommended error:", error);
    res.status(500).json({ message: "Failed to load recommended books" });
  }
});

export default recommendedRoutes;
