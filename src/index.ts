import express from "express";
import { Article } from "./types/api";

// In-memory store
const articles: Article[] = [];

const app = express();
app.use(express.json());

app.get("/articles", (req, res) => {
    res.json(articles);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${ PORT }`);
});
