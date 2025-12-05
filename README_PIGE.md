# 📡 Système de Pige Radio - Architecture

## 📁 Structure du Projet

```
src/
├── app/pige/
│   └── page.tsx                    # Page principale (orchestration)
├── components/pige/
│   ├── RecordingForm.tsx          # Formulaire d'enregistrement
│   ├── ActiveJobsList.tsx         # Liste des jobs actifs
│   ├── RecordingsList.tsx         # Liste des enregistrements
│   ├── RecordingDetails.tsx       # Détails d'un enregistrement
│   ├── StatisticsPanel.tsx        # Panneau des statistiques
│   ├── StatisticsCharts.tsx       # Graphiques Highcharts
│   └── index.ts                   # Export des composants
├── hooks/
│   ├── usePigeRecordings.ts       # Hook pour les enregistrements
│   ├── usePigeStatistics.ts       # Hook pour les statistiques
│   └── index.ts                   # Export des hooks
├── services/
│   └── pigeService.ts             # Appels API et types
└── lib/
    └── pigeFormatters.ts          # Fonctions utilitaires de formatage
```

## 🎯 Architecture

### 1. **Services** (`src/services/pigeService.ts`)
Couche d'abstraction pour les appels API :
- `startRecording()` - Démarre un enregistrement
- `fetchActiveJobs()` - Récupère les jobs actifs
- `fetchRecordings()` - Liste des enregistrements
- `fetchRecordingDetails()` - Détails d'un enregistrement
- `generateSummary()` - Génère un résumé IA
- `fetchStatistics()` - Statistiques globales
- `getDownloadUrl()` - URL de téléchargement

**Avantages** :
- Centralisation des appels API
- Types TypeScript partagés
- Facile à tester et à mock

### 2. **Hooks** (`src/hooks/`)

#### `usePigeRecordings.ts`
Hook pour gérer l'état et les actions des enregistrements :
```typescript
const {
  loading,
  message,
  activeJobs,
  recordings,
  selectedRecording,
  startRecording,
  fetchActiveJobs,
  fetchRecordings,
  fetchRecordingDetails,
  generateSummary,
  clearMessage,
} = usePigeRecordings();
```

#### `usePigeStatistics.ts`
Hook dédié aux statistiques :
```typescript
const {
  statistics,
  loading,
  fetchStatistics,
} = usePigeStatistics();
```

**Avantages** :
- Logique métier séparée des composants UI
- État réutilisable
- Code plus maintenable

### 3. **Composants** (`src/components/pige/`)

#### Composants de présentation (dumb components) :
- **`RecordingForm`** - Formulaire pour démarrer un enregistrement
- **`ActiveJobsList`** - Affichage des jobs actifs
- **`RecordingsList`** - Liste des enregistrements
- **`RecordingDetails`** - Détails complets d'un enregistrement
- **`StatisticsPanel`** - Panneau de statistiques
- **`StatisticsCharts`** - Graphiques Highcharts

**Avantages** :
- Composants réutilisables
- Props bien définies
- Faciles à tester
- UI séparée de la logique

### 4. **Utilitaires** (`src/lib/pigeFormatters.ts`)

Fonctions de formatage :
- `formatBytes()` - Octets → KB/MB/GB
- `formatDuration()` - Secondes → h/m/s
- `formatTime()` - Secondes → MM:SS ou HH:MM:SS

### 5. **Page** (`src/app/pige/page.tsx`)

Page principale qui orchestre tout :
- Utilise les hooks
- Passe les props aux composants
- Gère le layout

## 🔄 Flux de Données

```
┌─────────────────────────────────────────────┐
│          Page (pige/page.tsx)               │
│  - Orchestre les hooks et composants       │
└────────────┬────────────────────────────────┘
             │
     ┌───────┴────────┐
     ▼                ▼
┌─────────┐      ┌─────────┐
│  Hooks  │      │  Props  │
│ (State) │      │  (Data) │
└────┬────┘      └────┬────┘
     │                │
     ▼                ▼
┌─────────────────────────┐
│   Services (API)         │
│  - pigeService.ts       │
└──────────┬──────────────┘
           │
           ▼
    ┌─────────────┐
    │  Backend    │
    │ 91.98.158.148│
    └─────────────┘
```

## 📦 Installation et Configuration

### 1. Variables d'environnement

Créez `.env.local` :
```bash
NEXT_PUBLIC_API_BASE_URL=http://91.98.158.148
```

### 2. Dépendances

```bash
yarn add highcharts highcharts-react-official
```

### 3. Démarrage

```bash
yarn dev
```

Accédez à : `http://localhost:3000/pige`

## 🧪 Utilisation des Hooks

### Exemple : Utiliser le hook dans un nouveau composant

```typescript
import { usePigeRecordings } from '@/hooks/usePigeRecordings';

function MonComposant() {
  const { recordings, fetchRecordings } = usePigeRecordings();

  useEffect(() => {
    fetchRecordings();
  }, []);

  return (
    <div>
      {recordings.map(rec => (
        <div key={rec.id}>{rec.title}</div>
      ))}
    </div>
  );
}
```

## 🎨 Ajouter un Nouveau Composant

1. Créez le fichier dans `src/components/pige/MonComposant.tsx`
2. Définissez l'interface des props
3. Exportez-le dans `src/components/pige/index.ts`
4. Utilisez-le dans la page

## 🔧 Ajouter un Nouvel Endpoint API

1. Ajoutez le type dans `pigeService.ts`
2. Créez la fonction d'appel API
3. Ajoutez la logique dans le hook approprié
4. Utilisez-la dans votre composant

## 🎯 Avantages de cette Architecture

✅ **Séparation des préoccupations**
- UI séparée de la logique métier
- Services isolés des composants

✅ **Réutilisabilité**
- Hooks réutilisables
- Composants modulaires

✅ **Maintenabilité**
- Code organisé et clair
- Facile à déboguer

✅ **Testabilité**
- Services mockables
- Composants testables isolément

✅ **TypeScript**
- Types partagés
- Autocomplete
- Moins d'erreurs

✅ **Performance**
- Séparation des états
- Optimisations possibles

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Highcharts React](https://www.highcharts.com/docs/getting-started/install-from-npm)
- [React Hooks](https://react.dev/reference/react)

