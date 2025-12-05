# Configuration du Système de Pige Radio

## Variables d'environnement

### Fichier `.env.local`

Le fichier `.env.local` contient les variables d'environnement pour la connexion à l'API du système de pige radio.

```bash
# Configuration API Système de Pige Radio
NEXT_PUBLIC_API_BASE_URL=http://91.98.158.148
```

### Configuration

1. **Fichier déjà créé** : Le fichier `.env.local` est déjà configuré avec l'adresse IP par défaut

2. **Pour modifier l'adresse IP** :
   - Éditez le fichier `.env.local` à la racine du projet
   - Changez la valeur de `NEXT_PUBLIC_API_BASE_URL`
   - Redémarrez le serveur de développement

3. **Template disponible** : Le fichier `.env.example` sert de modèle

### Utilisation dans le code

La variable est utilisée dans `/src/app/pige/page.tsx` :

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://91.98.158.148";
```

### Notes importantes

- Le préfixe `NEXT_PUBLIC_` est **obligatoire** pour que la variable soit accessible côté client dans Next.js
- Le fichier `.env.local` est **ignoré par Git** (voir `.gitignore`)
- Après modification, **redémarrez** le serveur : `npm run dev` ou `yarn dev`

## Endpoints API disponibles

Tous les endpoints utilisent `NEXT_PUBLIC_API_BASE_URL` comme base :

- `POST /api/recordings/jobs/start/` - Démarrer un enregistrement
- `GET /api/recordings/jobs/active/` - Jobs actifs
- `GET /api/archive/recordings/` - Liste des enregistrements
- `GET /api/archive/recordings/{id}/` - Détails d'un enregistrement
- `GET /api/archive/recordings/{id}/download/` - Télécharger un enregistrement
- `GET /api/archive/recordings/statistics/` - Statistiques globales
- `POST /api/ai/summarize/` - Générer un résumé IA

## Environnements multiples

Pour gérer plusieurs environnements :

### Développement
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://91.98.158.148
```

### Production
```bash
# .env.production.local
NEXT_PUBLIC_API_BASE_URL=https://api-pige-production.example.com
```

### Test
```bash
# .env.test.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

