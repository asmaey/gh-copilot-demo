import { Album } from "../types/album";

let albums: Album[] = [
  { id: 1, title: "You, Me and an App Id", artist: "Daprize", price: 10.99, imageUrl: "https://aka.ms/albums-daprlogo" },
  { id: 2, title: "Seven Revision Army", artist: "The Blue-Green Stripes", price: 13.99, imageUrl: "https://aka.ms/albums-containerappslogo" },
  { id: 3, title: "Scale It Up", artist: "KEDA Club", price: 13.99, imageUrl: "https://aka.ms/albums-kedalogo" },
  { id: 4, title: "Lost in Translation", artist: "MegaDNS", price: 12.99, imageUrl: "https://aka.ms/albums-envoylogo" },
  { id: 5, title: "Lock Down Your Love", artist: "V is for VNET", price: 12.99, imageUrl: "https://aka.ms/albums-vnetlogo" },
  { id: 6, title: "Sweet Container O' Mine", artist: "Guns N Probeses", price: 14.99, imageUrl: "https://aka.ms/albums-containerappslogo" }
];

export function listAlbums(): Album[] {
  return albums;
}

export function getAlbum(id: number): Album | undefined {
  return albums.find(a => a.id === id);
}

export function addAlbum(input: Omit<Album, "id">): Album {
  const id = (albums.length ? Math.max(...albums.map(a => a.id)) : 0) + 1;
  const album: Album = { id, ...input };
  albums.push(album);
  return album;
}

export function updateAlbum(id: number, input: Omit<Album, "id">): Album | undefined {
  const idx = albums.findIndex(a => a.id === id);
  if (idx === -1) return undefined;
  const updated: Album = { id, ...input };
  albums[idx] = updated;
  return updated;
}

export function deleteAlbum(id: number): boolean {
  const before = albums.length;
  albums = albums.filter(a => a.id !== id);
  return albums.length < before;
}
