# Architecture — Cache Distribué

## Diagramme général

\`\`\`mermaid
graph TD
    C1[Client 1] --> API
    C2[Client 2] --> API
    C3[Client 3] --> API

    API[API Express :3000] --> CACHE{Cache Redis}

    CACHE -->|HIT - moins de 1ms| REP[Réponse rapide]
    CACHE -->|MISS - 100ms| DB[(Base de données)]
    DB --> STORE[Stocker en cache]
    STORE --> REP

    subgraph Docker
        API
        CACHE
        DB
    end
\`\`\`

## Flux d'une requête

\`\`\`mermaid
sequenceDiagram
    participant C as Client
    participant A as API Express
    participant R as Redis Cache
    participant D as Base de données

    C->>A: GET /api/produits/1
    A->>R: Chercher produit:1
    alt Cache HIT
        R-->>A: Données trouvées
        A-->>C: 200 OK - source: CACHE
    else Cache MISS
        R-->>A: Rien trouvé
        A->>D: SELECT produit WHERE id=1
        D-->>A: Données
        A->>R: Stocker avec TTL 60s
        A-->>C: 200 OK - source: BASE DE DONNÉES
    end
\`\`\`

## Choix techniques

- **Redis** : cache in-memory, TTL natif, moins de 1ms de latence
- **Express** : framework léger pour API REST
- **Docker** : isolation et reproductibilité
- **Jest** : tests automatisés Node.js
- **GitHub Actions** : CI/CD automatique