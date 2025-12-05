# 🚀 Installation rapide MongoDB + Vercel

## Étape 1 : Installer les dépendances

```bash
npm install
# ou
yarn install
```

Cela installera automatiquement `mongoose` qui est maintenant dans `package.json`.

## Étape 2 : Créer une base de données MongoDB

### Option rapide : MongoDB Atlas (Gratuit)

1. **Créer un compte** : [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)

2. **Créer un cluster gratuit** :
   - Choisissez "M0 Sandbox" (gratuit)
   - Sélectionnez une région proche de vous
   - Cliquez sur "Create"

3. **Créer un utilisateur** :
   - Security > Database Access > Add New Database User
   - Username: `admin`
   - Password: générez un mot de passe sécurisé
   - Rôle: "Atlas admin"
   - Cliquez sur "Add User"

4. **Autoriser l'accès réseau** :
   - Security > Network Access > Add IP Address
   - Cliquez sur "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirmez

5. **Obtenir la chaîne de connexion** :
   - Cliquez sur "Connect" sur votre cluster
   - Choisissez "Drivers"
   - Copiez la chaîne de connexion
   - Remplacez `<password>` par votre mot de passe

Exemple :
```
mongodb+srv://admin:VotreMotDePasse@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Étape 3 : Configurer les variables d'environnement

### En local (.env.local)

Créez un fichier `.env.local` à la racine du projet :

```env
MONGODB_URI=mongodb+srv://admin:VotreMotDePasse@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
NEXT_PUBLIC_API_BASE_URL=https://pige.siraj-ai.com
```

### Sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez la variable :
   - **Name**: `MONGODB_URI`
   - **Value**: Votre chaîne de connexion MongoDB
   - Cochez : Production, Preview, Development
5. Cliquez sur **Save**

## Étape 4 : Tester localement

```bash
npm run dev
```

Testez l'upload :
```bash
curl -X POST http://localhost:3000/api/recordings/upload \
  -F "audio_file=@test.mp3" \
  -F "title=Test Audio" \
  -F "format=mp3" \
  -F "duration=120"
```

✅ Vous devriez voir :
```json
{
  "success": true,
  "mongo_file_id": "...",
  "message": "✅ Fichier uploadé avec succès"
}
```

## Étape 5 : Déployer sur Vercel

```bash
git add .
git commit -m "feat: ajout de MongoDB GridFS pour le stockage des fichiers"
git push
```

Vercel redéploiera automatiquement votre application ! 🎉

## 🔍 Vérifier que tout fonctionne

1. **Vérifier les logs** :
   - Sur Vercel : Project > Deployments > Latest > View Function Logs
   - Recherchez : "✅ MongoDB connecté avec succès"

2. **Tester l'upload** sur votre URL de production

3. **Voir les fichiers dans MongoDB** :
   - Retournez sur MongoDB Atlas
   - Collections > Browse Collections
   - Vous verrez une collection `audio_files.files` et `audio_files.chunks`

## ⚠️ Problèmes courants

### "unable to get local issuer certificate"
- **Solution** : Utilisez MongoDB Atlas au lieu de MongoDB local

### "MongoServerError: bad auth"
- **Solution** : Vérifiez votre nom d'utilisateur et mot de passe

### "IP not whitelisted"
- **Solution** : Ajoutez 0.0.0.0/0 dans Network Access sur MongoDB Atlas

### "MONGODB_URI is not defined"
- **Solution** : Vérifiez que vous avez bien créé le fichier `.env.local` (en local) ou ajouté la variable sur Vercel

## 📚 Documentation complète

Consultez [docs/MONGODB_SETUP.md](docs/MONGODB_SETUP.md) pour plus de détails.

## 🎯 C'est tout !

Votre application peut maintenant stocker des fichiers audio sur MongoDB, ce qui fonctionne parfaitement avec Vercel ! 🚀

