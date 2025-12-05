# 📡 Documentation API - Système de Pige Radio

## 🔗 Base URL
```
https://pige.siraj-ai.com
```

## 🎯 Endpoints Implémentés dans le Frontend

### ✅ Déjà Implémentés

#### 1. **Démarrer un Enregistrement**
```typescript
POST /api/recordings/upload/
// Frontend: src/app/api/recordings/upload/route.ts
// Service: startRecording() dans src/services/pigeService.ts
```

#### 2. **Générer un Résumé IA**
```typescript
POST /api/ai/summarize/
// Frontend: src/app/api/ai/summarize/route.ts
// Service: generateSummary() dans src/services/pigeService.ts
```

#### 3. **Liste des Enregistrements**
```typescript
GET /api/archive/recordings/
// Service: fetchRecordings() dans src/services/pigeService.ts
```

#### 4. **Détails d'un Enregistrement**
```typescript
GET /api/archive/recordings/{id}/
// Service: fetchRecordingDetails() dans src/services/pigeService.ts
```

#### 5. **Jobs Actifs**
```typescript
GET /api/recordings/jobs/active/
// Service: fetchActiveJobs() dans src/services/pigeService.ts
```

#### 6. **Statistiques**
```typescript
GET /api/archive/recordings/statistics/
// Service: fetchStatistics() dans src/services/pigeService.ts
```

---

## 🚀 Endpoints à Implémenter

### 1. **Transcrire un Enregistrement**

**Backend:**
```bash
curl -X POST https://pige.siraj-ai.com/api/ai/transcribe/ \
  -H "Content-Type: application/json" \
  -d '{
    "recording_id": 1,
    "language": "fr"
  }'
```

**À créer:**
- `src/app/api/ai/transcribe/route.ts`
- `transcribeRecording()` dans `pigeService.ts`

### 2. **Extraire les Mots-Clés**

**Backend:**
```bash
curl -X POST https://pige.siraj-ai.com/api/ai/extract-keywords/ \
  -H "Content-Type: application/json" \
  -d '{
    "recording_id": 1,
    "max_keywords": 10
  }'
```

**À créer:**
- `src/app/api/ai/extract-keywords/route.ts`
- `extractKeywords()` dans `pigeService.ts`

### 3. **Informations sur les Modèles IA**

**Backend:**
```bash
curl -X GET https://pige.siraj-ai.com/api/ai/models-info/
```

**À créer:**
- `src/app/api/ai/models-info/route.ts`
- `getModelsInfo()` dans `pigeService.ts`

### 4. **Traiter un Enregistrement (Transcription + Résumé)**

**Backend:**
```bash
curl -X POST https://pige.siraj-ai.com/api/archive/recordings/1/process/
```

**À créer:**
- `processRecording()` dans `pigeService.ts`
- Bouton dans `RecordingDetails.tsx`

### 5. **Télécharger un Enregistrement**

**Backend:**
```bash
curl -X GET https://pige.siraj-ai.com/api/archive/recordings/1/download/ -o recording.wav
```

**Déjà implémenté:**
- `getDownloadUrl()` dans `pigeService.ts`
- ✅ Bouton de téléchargement dans `RecordingsList.tsx`

### 6. **Vérifier un Stream Audio**

**Backend:**
```bash
curl -X POST https://pige.siraj-ai.com/api/recordings/check-stream/ \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://stream.example.com/live"
  }'
```

**À créer:**
- `checkStream()` dans `pigeService.ts`
- Validation dans `RecordingForm.tsx`

---

## 📝 Plan d'Implémentation

### Phase 1: Routes API Locales (Proxies) ✅
- [x] `/api/ai/summarize/` ✅
- [x] `/api/recordings/upload/` ✅
- [ ] `/api/ai/transcribe/`
- [ ] `/api/ai/extract-keywords/`
- [ ] `/api/ai/models-info/`

### Phase 2: Services TypeScript
- [x] `generateSummary()` ✅
- [x] `startRecording()` ✅
- [x] `fetchRecordings()` ✅
- [x] `fetchRecordingDetails()` ✅
- [x] `fetchStatistics()` ✅
- [ ] `transcribeRecording()`
- [ ] `extractKeywords()`
- [ ] `processRecording()`
- [ ] `checkStream()`

### Phase 3: Interface Utilisateur
- [x] Formulaire d'upload ✅
- [x] Bouton "Générer un résumé IA" ✅
- [x] Liste des enregistrements ✅
- [x] Onglets (Enregistrements, Analyse IA, Statistiques) ✅
- [ ] Bouton "Transcrire"
- [ ] Bouton "Extraire les mots-clés"
- [ ] Bouton "Tout traiter" (transcription + résumé)
- [ ] Affichage des mots-clés
- [ ] Validation de stream en temps réel

---

## 🔧 Exemple d'Implémentation

### Créer la Route de Transcription

**1. Créer `src/app/api/ai/transcribe/route.ts`:**
```typescript
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pige.siraj-ai.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recording_id, language = "fr" } = body;

    if (!recording_id) {
      return NextResponse.json(
        { success: false, message: "recording_id requis" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(`${API_BASE}/api/ai/transcribe/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recording_id, language }),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json(
        { success: false, message: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Erreur" },
      { status: 500 }
    );
  }
}
```

**2. Ajouter au Service `pigeService.ts`:**
```typescript
export const transcribeRecording = async (
  recordingId: number,
  language = "fr"
): Promise<{ success: boolean; transcript?: string; message?: string }> => {
  const endpoint = "/api/ai/transcribe";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recording_id: recordingId, language }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Erreur" }));
    throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
  }

  return response.json();
};
```

**3. Ajouter au Composant `RecordingDetails.tsx`:**
```typescript
<button
  type="button"
  onClick={() => handleTranscribe(recording.id)}
  className="..."
>
  <FileText className="h-5 w-5" />
  <span>Transcrire l'audio</span>
</button>
```

---

## 📊 Matrice de Fonctionnalités

| Fonctionnalité | Backend | Route API Frontend | Service | UI | Statut |
|----------------|---------|-------------------|---------|----|---------| 
| Upload fichier | ✅ | ✅ | ✅ | ✅ | ✅ Complet |
| Résumé IA | ✅ | ✅ | ✅ | ✅ | ✅ Complet |
| Transcription | ✅ | ❌ | ❌ | ❌ | 🔴 À faire |
| Mots-clés | ✅ | ❌ | ❌ | ❌ | 🔴 À faire |
| Traiter (full) | ✅ | ❌ | ❌ | ❌ | 🔴 À faire |
| Check stream | ✅ | ❌ | ❌ | ❌ | 🔴 À faire |
| Télécharger | ✅ | ✅ | ✅ | ✅ | ✅ Complet |
| Liste | ✅ | ✅ | ✅ | ✅ | ✅ Complet |
| Détails | ✅ | ✅ | ✅ | ✅ | ✅ Complet |
| Statistiques | ✅ | ✅ | ✅ | ✅ | ✅ Complet |
| Jobs actifs | ✅ | ✅ | ✅ | ❌ | 🟡 Masqué |

---

## 🎯 Prochaines Étapes

1. **Créer les routes API manquantes**
   - `/api/ai/transcribe/`
   - `/api/ai/extract-keywords/`
   - `/api/ai/models-info/`

2. **Ajouter les services TypeScript**
   - `transcribeRecording()`
   - `extractKeywords()`
   - `getModelsInfo()`

3. **Améliorer l'UI**
   - Bouton "Transcrire" dans RecordingDetails
   - Bouton "Extraire mots-clés"
   - Affichage des mots-clés comme badges
   - Bouton "Tout traiter" pour transcription + résumé en un clic

4. **Tests**
   - Tester chaque endpoint
   - Vérifier la gestion d'erreurs
   - Valider les timeouts

---

## 🔍 Debug

Pour vérifier si le backend est accessible :
```bash
curl -X GET https://pige.siraj-ai.com/health
curl -X GET https://pige.siraj-ai.com/api/ai/models-info/
```

Pour voir les logs dans la console du navigateur :
```javascript
// Les appels API affichent maintenant des logs détaillés
// Exemple: "🔍 Récupération des jobs actifs depuis: ..."
```

---

**Auteur**: Système NIRD  
**Version**: 2.0  
**Date**: Décembre 2025

