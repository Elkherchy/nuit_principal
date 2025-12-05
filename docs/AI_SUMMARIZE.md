# 🤖 Fonctionnalité de Résumé IA - Système de Pige Radio

## 📋 Vue d'ensemble

Le système de pige radio intègre désormais une fonctionnalité de **résumé automatique par intelligence artificielle** pour analyser et synthétiser le contenu des enregistrements audio.

## 🎯 Fonctionnalités

### 1. **Génération de Résumé IA**
- Génère automatiquement un résumé concis du contenu audio transcrit
- Paramétrable avec le nombre maximum de phrases (défaut : 5)
- Utilise l'IA pour extraire les informations clés

### 2. **Interface Utilisateur Améliorée**

#### Dans la liste des enregistrements (`RecordingsList`)
- 🏷️ **Badge "Résumé IA"** : Indique visuellement les enregistrements ayant déjà un résumé
- 🏷️ **Badge "Transcrit"** : Indique les enregistrements avec transcription mais sans résumé

#### Dans les détails d'un enregistrement (`RecordingDetails`)
- ✨ **Affichage du résumé** avec un design moderne et gradient
- 🔄 **Bouton de régénération** pour créer un nouveau résumé
- 📊 **Indicateur de chargement** pendant la génération
- ⚠️ **Messages d'information** si la transcription n'est pas disponible

### 3. **Gestion des États**
- État de chargement pendant la génération
- Feedback visuel instantané
- Messages d'erreur explicites

## 🏗️ Architecture Technique

### API Route : `/api/ai/summarize/`

```typescript
POST /api/ai/summarize
Content-Type: application/json

Request Body:
{
  "recording_id": number,
  "max_sentences": number (optionnel, défaut: 5)
}

Response Success:
{
  "success": true,
  "summary": string,
  "message": string
}

Response Error:
{
  "success": false,
  "message": string,
  "error": string (optionnel)
}
```

### Fichiers Modifiés/Créés

#### 1. **Route API**
- 📁 `src/app/api/ai/summarize/route.ts`
  - Proxy vers le backend de pige
  - Gestion des erreurs (404, 503, 500)
  - Validation des paramètres

#### 2. **Service**
- 📁 `src/services/pigeService.ts`
  - Fonction `generateSummary()` mise à jour pour utiliser la route locale
  - Types enrichis avec `has_summary` et `has_transcript`

#### 3. **Composants**
- 📁 `src/components/pige/RecordingDetails.tsx`
  - État de chargement local
  - Interface améliorée avec gradients et animations
  - Bouton de régénération
  - Messages contextuels

- 📁 `src/components/pige/RecordingsList.tsx`
  - Badges visuels pour résumés et transcriptions
  - Icônes `Sparkles` et `FileText`

#### 4. **Hook**
- 📁 `src/hooks/usePigeRecordings.ts`
  - Fonction `generateSummary()` avec gestion d'état
  - Rafraîchissement automatique après génération

## 🎨 Design & UX

### Couleurs et Thème
- **Gradient bleu-violet** pour la section résumé IA
- **Badge "AI" avec effet blur** en haut à droite
- **Icône Sparkles** (✨) pour représenter l'IA
- **Animations de chargement** fluides

### États Visuels
1. **Pas de résumé** : Bouton d'action principal avec gradient
2. **Génération en cours** : Spinner animé + message
3. **Résumé disponible** : Affichage dans une carte stylisée
4. **Erreur** : Message explicite avec icône d'alerte

## 🔒 Gestion des Erreurs

### Côté API
- **404** : Enregistrement ou transcription introuvable
- **503** : Service IA temporairement indisponible
- **500** : Erreur interne du serveur

### Côté Client
- Messages d'erreur traduits en français
- Désactivation des boutons pendant le chargement
- Feedback visuel pour chaque état

## 📊 Workflow Utilisateur

1. **Upload d'un fichier audio** → Enregistrement créé
2. **Transcription automatique** → Badge "Transcrit" apparaît
3. **Clic sur l'enregistrement** → Vue détails
4. **Clic sur "Générer un résumé IA"** → Spinner de chargement
5. **Résumé généré** → Affichage avec option de régénération
6. **Badge "Résumé IA"** apparaît dans la liste

## 🚀 Améliorations Futures

- [ ] Cache des résumés côté client
- [ ] Paramètres de génération personnalisables (ton, longueur, style)
- [ ] Export des résumés en PDF/TXT
- [ ] Résumés multilingues
- [ ] Analyse de sentiment dans les résumés
- [ ] Génération automatique après transcription

## 📝 Exemple d'Utilisation

```typescript
// Dans un composant
import { usePigeRecordings } from "@/hooks/usePigeRecordings";

const { generateSummary, selectedRecording } = usePigeRecordings();

// Générer un résumé
await generateSummary(recordingId);

// Avec paramètre personnalisé
await generateSummary(recordingId, 3); // 3 phrases max
```

## ✅ Tests Recommandés

1. **Test de génération** : Vérifier qu'un résumé est créé
2. **Test de régénération** : Vérifier qu'on peut régénérer
3. **Test sans transcription** : Vérifier le message d'erreur
4. **Test de chargement** : Vérifier l'animation
5. **Test de persistance** : Vérifier que le résumé est sauvegardé

## 🔗 Dépendances

- **Backend Pige** : Doit exposer l'endpoint `/api/ai/summarize/`
- **Transcription** : Nécessaire avant de générer un résumé
- **MongoDB** : Stockage des résumés générés

---

**Version** : 1.0.0  
**Date** : Décembre 2025  
**Auteur** : Système NIRD - Numérique Inclusif Responsable et Durable

