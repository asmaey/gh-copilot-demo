# album-api-v2

Node.js API en TypeScript pour gérer des albums de musique. Réécriture de l'API .NET `albums-api`, avec les mêmes routes et données d'exemple, en mémoire.

## Démarrage

```bash
npm install
npm run dev        # dev
npm run build
npm run start      # production build
```

L'API écoute sur `http://localhost:3000`.

## Endpoints

- GET `/` → "Hit the /albums endpoint to retrieve a list of albums!"
- GET `/albums` → liste complète des albums (6 items au démarrage)
- GET `/albums/:id` → album par id; 404 si absent
- POST `/albums` → crée un album (201)
- PUT `/albums/:id` → met à jour un album (200); 404 si absent
- DELETE `/albums/:id` → supprime un album (204); 404 si absent

### Exemples rapides (cURL)
```bash
# Lister tous les albums
curl http://localhost:3000/albums

# Récupérer un album par id
curl http://localhost:3000/albums/1

# Créer un album
curl -X POST http://localhost:3000/albums \
  -H 'Content-Type: application/json' \
  -d '{"title":"New Album","artist":"New Artist","price":9.99,"imageUrl":"https://example.com/img"}'

# Mettre à jour un album
curl -X PUT http://localhost:3000/albums/1 \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated","artist":"Artist","price":11.5,"imageUrl":"https://example.com/u"}'

# Supprimer un album
curl -X DELETE http://localhost:3000/albums/2 -i
```

### Modèle `Album`
```ts
interface Album {
  id: number;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
}
```

### Données d'exemple
- (1) You, Me and an App Id | Daprize | 10.99 | https://aka.ms/albums-daprlogo
- (2) Seven Revision Army | The Blue-Green Stripes | 13.99 | https://aka.ms/albums-containerappslogo
- (3) Scale It Up | KEDA Club | 13.99 | https://aka.ms/albums-kedalogo
- (4) Lost in Translation | MegaDNS | 12.99 | https://aka.ms/albums-envoylogo
- (5) Lock Down Your Love | V is for VNET | 12.99 | https://aka.ms/albums-vnetlogo
- (6) Sweet Container O' Mine | Guns N Probeses | 14.99 | https://aka.ms/albums-containerappslogo

## Tests

```bash
npm run test
```

Les tests utilisent Vitest et Supertest pour vérifier chaque route et les cas d'erreur.

## Intégration avec le front Vue

Le projet `album-viewer` utilise Vite avec un proxy vers `http://localhost:3000` pour l'API. En démarrage local, lancez d'abord l'API (`album-api-v2`) puis l'app Vue pour que les appels à `/albums` fonctionnent.

## Configuration

- Port: `3000` (modifiable avec la variable `PORT`).
- CORS: activé par défaut pour le développement.

## Notes de conception

- Comportement REST standard: `GET /albums/:id` renvoie `404` si l'album n'existe pas.
- Données en mémoire: aucune base de données requise; un redémarrage réinitialise l'état.
