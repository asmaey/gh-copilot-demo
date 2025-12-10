import request from "supertest";
import app from "../src/server";
describe("album-api-v2", () => {
    it("GET / returns hint text", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.text).toContain("Hit the /albums endpoint");
    });
    it("GET /albums returns 6 albums", async () => {
        const res = await request(app).get("/albums");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(6);
        const first = res.body[0];
        expect(first).toHaveProperty("id");
        expect(first).toHaveProperty("title");
        expect(first).toHaveProperty("artist");
        expect(first).toHaveProperty("price");
        expect(first).toHaveProperty("imageUrl");
    });
    it("GET /albums/:id returns album when exists", async () => {
        const res = await request(app).get("/albums/1");
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1);
    });
    it("GET /albums/:id 404 when not found", async () => {
        const res = await request(app).get("/albums/9999");
        expect(res.status).toBe(404);
    });
    it("POST /albums creates new album", async () => {
        const payload = { title: "New Album", artist: "New Artist", price: 9.99, imageUrl: "https://example.com/img" };
        const res = await request(app).post("/albums").send(payload);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(payload);
        expect(res.body.id).toBeGreaterThan(6);
    });
    it("POST /albums 400 on invalid payload", async () => {
        const res = await request(app).post("/albums").send({ title: "", artist: "", price: -1, imageUrl: "" });
        expect(res.status).toBe(400);
    });
    it("PUT /albums/:id updates when exists", async () => {
        const payload = { title: "Updated", artist: "Artist", price: 11.5, imageUrl: "https://example.com/u" };
        const res = await request(app).put("/albums/1").send(payload);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 1, ...payload });
    });
    it("PUT /albums/:id 404 when not found", async () => {
        const payload = { title: "Updated", artist: "Artist", price: 11.5, imageUrl: "https://example.com/u" };
        const res = await request(app).put("/albums/9999").send(payload);
        expect(res.status).toBe(404);
    });
    it("DELETE /albums/:id 204 when exists", async () => {
        const res = await request(app).delete("/albums/2");
        expect(res.status).toBe(204);
    });
    it("DELETE /albums/:id 404 when not found", async () => {
        const res = await request(app).delete("/albums/9999");
        expect(res.status).toBe(404);
    });
});
