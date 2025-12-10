import express from "express";
import cors from "cors";
import { listAlbums, getAlbum, addAlbum, updateAlbum, deleteAlbum } from "./data/albums";
import { Album } from "./types/album";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hit the /albums endpoint to retrieve a list of albums!");
});

app.get("/albums", (_req, res) => {
  res.json(listAlbums());
});

app.get("/albums/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const album = getAlbum(id);
  if (!album) return res.status(404).json({ error: "Album not found" });
  res.json(album);
});

function validateAlbumPayload(payload: any): payload is Omit<Album, "id"> {
  return (
    payload &&
    typeof payload.title === "string" && payload.title.trim().length > 0 &&
    typeof payload.artist === "string" && payload.artist.trim().length > 0 &&
    typeof payload.price === "number" && payload.price >= 0 &&
    typeof payload.imageUrl === "string" && payload.imageUrl.trim().length > 0
  );
}

app.post("/albums", (req, res) => {
  const payload = req.body;
  if (!validateAlbumPayload(payload)) return res.status(400).json({ error: "Invalid album payload" });
  const created = addAlbum(payload);
  res.status(201).json(created);
});

app.put("/albums/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const payload = req.body;
  if (!validateAlbumPayload(payload)) return res.status(400).json({ error: "Invalid album payload" });
  const updated = updateAlbum(id, payload);
  if (!updated) return res.status(404).json({ error: "Album not found" });
  res.json(updated);
});

app.delete("/albums/:id", (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const ok = deleteAlbum(id);
  if (!ok) return res.status(404).json({ error: "Album not found" });
  res.status(204).send();
});

const port = Number(process.env.PORT ?? 3000);
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`album-api-v2 listening on http://localhost:${port}`);
  });
}

export default app;
