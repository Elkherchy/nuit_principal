# Configuration MongoDB pour le stockage des fichiers audio

Ce projet utilise MongoDB avec GridFS pour stocker les fichiers audio de manière persistante sur Vercel.

## 🚀 Installation

### 1. Installer mongoose

```bash
npm install mongoose
# ou
yarn add mongoose
```

### 2. Créer une base de données MongoDB

Vous avez deux options :

#### Option A : MongoDB Atlas (Gratuit, recommandé)

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster (gratuit)
3. Créez un utilisateur de base de données
4. Obtenez votre chaîne de connexion

#### Option B : MongoDB local

1. Installez MongoDB localement
2. Lancez MongoDB : `mongod`
3. Utilisez la chaîne de connexion locale : `mongodb://localhost:27017/votre_database`

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# API Backend Pige (optionnel)
NEXT_PUBLIC_API_BASE_URL=https://pige.siraj-ai.com
```

**⚠️ Important** : Sur Vercel, ajoutez `MONGODB_URI` dans les variables d'environnement de votre projet :
1. Allez dans votre projet Vercel
2. Settings > Environment Variables
3. Ajoutez `MONGODB_URI` avec votre chaîne de connexion

## 📁 Structure des fichiers

Les fichiers créés :

```
src/
├── lib/
│   ├── mongodb.ts          # Connexion MongoDB avec cache
│   ├── fileStorage.ts      # Interface GridFS pour le stockage
│   └── ...
├── app/
│   └── api/
│       └── recordings/
│           ├── upload/
│           │   └── route.ts  # Upload vers MongoDB GridFS
│           └── stream/
│               └── route.ts  # Streaming depuis MongoDB
```

## 🔧 Comment ça marche

### Upload de fichiers

1. Le fichier audio est reçu via `POST /api/recordings/upload`
2. Le fichier est sauvegardé dans MongoDB GridFS avec des métadonnées
3. Un ID unique est généré pour le fichier
4. Le fichier est aussi envoyé au backend externe (si disponible)
5. Si le backend est indisponible, le fichier reste accessible via MongoDB

### Streaming de fichiers

Les fichiers peuvent être streamés via :

```
GET /api/recordings/stream?fileId=<mongo_file_id>
```

Ou par nom de fichier :

```
GET /api/recordings/stream?filename=<nom_du_fichier>
```

Le streaming supporte les requêtes Range HTTP pour la lecture partielle (utile pour l'audio/vidéo).

## 📊 Avantages de cette solution

✅ **Fonctionne sur Vercel** : Pas besoin d'accès au système de fichiers  
✅ **Persistant** : Les fichiers sont stockés dans la base de données  
✅ **Scalable** : GridFS gère automatiquement les gros fichiers  
✅ **Streaming** : Support du streaming audio avec Range requests  
✅ **Fallback** : Continue de fonctionner même si le backend externe est down  

## 🐛 Dépannage

### Erreur : "MONGODB_URI n'est pas défini"

Vérifiez que vous avez bien créé le fichier `.env.local` avec `MONGODB_URI`.

### Erreur de connexion MongoDB

Vérifiez que :
- Votre IP est autorisée dans MongoDB Atlas (Network Access)
- Le nom d'utilisateur et mot de passe sont corrects
- La chaîne de connexion est valide

### Les fichiers ne s'affichent pas

Vérifiez les logs :
```bash
npm run dev
```

Les logs montreront si l'upload a réussi ou échoué.

## 📝 Exemple de test

```bash
curl -X POST http://localhost:3000/api/recordings/upload \
  -F "audio_file=@test.mp3" \
  -F "title=Test Audio" \
  -F "format=mp3" \
  -F "duration=120"
```

Réponse attendue :
```json
{
  "success": true,
  "mongo_file_id": "507f1f77bcf86cd799439011",
  "mongo_url": "/api/recordings/stream?fileId=507f1f77bcf86cd799439011",
  "message": "✅ Fichier \"test.mp3\" uploadé avec succès"
}
```

## 🔐 Sécurité

⚠️ **Ne commitez JAMAIS** votre fichier `.env.local` ou vos identifiants MongoDB !

Le fichier `.gitignore` devrait déjà inclure `.env.local`.

