# Village Numérique Résistant – L'Aventure NIRD

Application web narrative, interactive et libre qui illustre comment un établissement scolaire peut résister aux Big Tech grâce à la démarche **NIRD** (Numérique Inclusif, Responsable, Durable). Construite pour le Défi Principal de la Nuit de l'Info 2025.

## Fonctionnalités clefs
- **Carte du Village Résistant animée** : parallax, cycle jour/nuit, PNJ pingouins/robots et 8 bâtiments cliquables (Studio + Observatoire inclus).
- **NIRD Labs** : comic strip dynamique, city-builder, escape room, potion lab, film SVG, aventure narrative, impact visualizer, Linux Resurrection Machine.
- **Quartier des Missions** : générateur de brief, radio pirate (vidéos/podcasts libres) et mur d’évidence pour amplifier la communauté.
- **Interface dirigeants** : tableau de bord exécutif (calculateur financier + mémo Groq) pour convaincre directions/collectivités.
- **Gestion des utilisateurs** : rôles (élève, enseignant, direction…) stockés localement, centre de contrôle `/compte`.
- **Observatoire / Comparateur NIRD** : radar/bars, résumé narratif, suggestions d'actions, badge `Analyste NIRD`.
- **Simulateurs avancés** : Big Tech Surveillance (cookies/pubs/trackers), Eco Simulator, Impact Visualizer, Linux Resurrection Machine.
- **Progression locale & NIRD Score** : badges, modules complétés, idées communautaires et indicateurs (autonomie, vie privée, CO₂, inclusion, créativité) stockés dans `localStorage`.
- **Contribution Portal** : soumissions d'idées, recycleries, témoignages et ressources libres filtrables par catégorie.
- **Assistant IA “Petit Gaulois Numérique”** : chatbot propulsé par un modèle open-source (Llama 3.1 via API Groq) pour guider les missions sans dépendance propriétaire.
- **Animations Framer Motion + SVG** : transitions cartoon, badges animés, mini film (60s) et dashboards fluides.

## Modules du village
| Bâtiment | Contenu | Badge principal |
| --- | --- | --- |
| Atelier Réemploi | Mini-jeu diagnostic pour prolonger la vie d'un PC | Réparateur du Village |
| Maison Linux | Simulation terminal + Linux Resurrection Machine | Admin Linux Niveau 12 & Réparateur d’Obélix-PC |
| Bibliothèque Libre | Quiz express sur les logiciels libres | Sage du Libre |
| Tour Big Tech | Tower-defense + Surveillance Simulator (cookies, popups, trackers) | Bouclier Numérique & Dompteur de BigTech |
| Salle des Éco-Délégués | Eco Simulator + Impact Visualizer animé | Éco-Guerrier & Éco-Héro |
| Forge de la Communauté | Contribution Portal (idées, recyclerie, ressources) | Forgeron Libre |
| Studio Résistant (Labs) | BD dynamique, city-builder, escape room, potion lab, film SVG, aventure narrative | Auteur BD, Architecte NIRD, Gaulois Libre, Maître Escape, Réalisateur NIRD... |
| Quartier des Missions | Mission generator + Radio Résistance + Mur d’évidence | Stratège Résistant |
| Observatoire NIRD | Comparateur d'établissements, graphiques, plan d’action personnalisé | Analyste NIRD |
| Interface dirigeants | Calculateur budgétaire + mémo Groq | Stratège Exécutif |
| Quartier des Missions | Mission generator + Radio Résistance + Mur d’évidence | Stratège Résistant |

## NIRD Labs (sélection)
- **Dynamic Comic Strip Generator** : canvas + SVG libres, punchline personnalisée, export PNG, badges `Auteur BD Résistant` et `Explorateur du Studio`.
- **Build-Your-Own Resistant Village** : city-builder (grid 4x4) avec points Réemploi / Logiciels libres / Inclusion / Vie privée → NIRD Index.
- **Surveillance Simulator** : cookies espions, popups façon Tetris, pubs rebondissantes, trackers suivant la souris, badge `Dompteur de BigTech`.
- **Linux Resurrection Machine** : étapes interactives (spywares, nettoyage, installation libre) + log terminal, gains CO₂/budget.
- **Digital Escape Room** : 3 énigmes (alternative libre, commande Wi-Fi, outils privacy) avec timer 150 s.
- **Impact Visualizer** : graphique animé CO₂, déchets, budget, liberté logicielle, trackers bloqués.
- **Narrative Adventure** : Choose Your Own NIRD (directeur du lycée Carnot) avec stats Autonomie/Inclusion/Vie privée → badge `Gaulois Libre`.
- **Libre Software Potion Lab** : mixe potions (Liberté, Durabilité, Inclusion, Anti-BigTech) avec animations et stats.
- **Interactive Animated Short** : film SVG de 60 s retraçant la résistance NIRD.

## Observatoire / Comparateur NIRD
- Sélectionne deux établissements parmi les profils par défaut (Lycée Carnot, Lycée Néotech Corporate, Collège des Rivières, Campus Métropole) ou ajoute ton campus via un formulaire “Mon établissement”.
- Visualisation : barres comparatives pour Linux, suites libres, réemploi, dépendance cloud, souveraineté, inclusion, sobriété CO₂.
- Analyse : résumé narratif + propositions d’actions contextualisées (migration Linux, ateliers de réemploi, gouvernance data…).
- Export : bouton “Exporter en PDF” pour générer un rapport hors-ligne (via jsPDF) et le partager aux équipes.
- Progression : actionne le bouton “Lancer l’analyse” pour débloquer le badge `Analyste NIRD`, mettre à jour le NIRD Score (autonomie/créativité) et conserver les établissements personnalisés dans `localStorage` (`nird_custom_institutions`).

## Quartier des Missions & Radio Résistance
- Générateur de missions thématiques (Linux, réemploi, privacy, labs…) qui attribue le badge `Stratège Résistant`.
- Radio pirate : playlist d’articles, vidéos et podcasts issus de sources libres (France 3, France Inter, Café Pédagogique…) avec suivi local (`nird_media_progress`).
- Mur d’évidence : liens clés vers la Forge, le site NIRD, les vidéos des élèves (utilisateur convainc son équipe en 2 clics).

## Interface Dirigeants / Collectivités (`/executif`)
- **Calculateur financier** : nombre de postes, licences, cloud, support, énergie → projection automatique des économies & CO₂ évité.
- **Export AI (Groq)** : bouton “Générer le mémo stratégique” qui appelle Llama 3.1 (API Groq) pour produire une note d’intention prête à présenter.
- **API `/api/budget`** : dédiée à cette analyse (format structuré + ton “Petit Gaulois CFO”).

## Centre Utilisateur & Gestion locale (`/compte`)
- Stockage local des comptes (sans backend) mais possibilité d’assigner des rôles : élève, enseignant, direction, collectivité, partenaire.
- Mise à jour du profil (organisation, avatar) et affichage de la “task force” locale pour gérer qui pilote le village depuis ce navigateur.

## Architecture technique
- **Framework** : Next.js 16 (App Router) + TypeScript
- **Style** : Tailwind CSS 4 + design system maison
- **Animations** : Framer Motion
- **Icônes** : Tabler Icons (MIT)
- **Stockage** : `localStorage` uniquement (`nird_progress`, `nird_score`, `nird_ideas`, `nird_custom_institutions`)

Arborescence principale :
```
src/
 ├─ app/ (routes : /, /village, /village/*, /labs, /observatoire, /badges, /about-nird, /credits)
 ├─ components/ (VillageMap, Observatoire, mini-jeux, quiz, simulateurs, badges)
 ├─ data/ (bâtiments, quiz, institutions, projets forge)
 └─ lib/ (progression, localStorage utils, moteurs de mini-jeux, observatoire)
```

## Lancer le projet
```bash
npm install
npm run dev
```
Ouvre ensuite http://localhost:3000 pour parcourir le village.

### Assistant IA (Petit Gaulois Numérique)
1. Copie `.env.example` en `.env.local`.
2. Renseigne `GROQ_API_KEY=gsk_...` pour utiliser le modèle open-source Llama 3.1 (hébergé via l’API Groq). Un fallback `OPENAI_API_KEY` reste possible si tu souhaites tester une autre compatibilité.
3. Redémarre `npm run dev` puis ouvre le widget "Petit Gaulois" en bas à droite : toutes les réponses proviennent de ce modèle open-source, dans l’esprit souveraineté NIRD.

### Tests rapides
- `npm run lint` : vérifie les règles ESLint / Next.js.
- Chaque module fonctionne hors-ligne (localStorage) et ne nécessite aucun backend.

## Déploiement Vercel
1. `npm run build` pour vérifier la compilation.
2. `vercel` ou déploiement via l'UI Vercel (projet Next.js statique + RSC pris en charge).
3. Partager l'URL publique exigée par le cahier des charges.

## Licence & ressources
- Code et contenus sous **MIT License** (voir `LICENSE`).
- Assets libres recommandés : Tabler Icons, unDraw / OpenClipart (non inclus mais compatibles).

Bon voyage au cœur du Village Numérique Résistant !
