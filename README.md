# Kenzi Market

Épicerie en ligne avec livraison rapide — commande par voix, texte ou photo grâce à l'IA.

---

## Technologies utilisées

### Frontend
| Technologie | Version | Rôle |
|---|---|---|
| **Next.js** | 16.2.6 | Framework React (App Router, routes groupées, API routes) |
| **React** | 19.2.4 | Interface utilisateur |
| **TypeScript** | 5 | Typage statique |
| **Tailwind CSS** | 4 | Styles et design system |

### Backend & Base de données
| Technologie | Rôle |
|---|---|
| **Firebase Auth** | Authentification des utilisateurs (email/mot de passe) |
| **Firestore** | Base de données NoSQL (produits, commandes, utilisateurs) |
| **Next.js API Routes** | Endpoints serveur (ex: `/api/ai-cart`) |

### Intelligence Artificielle
| Technologie | Rôle |
|---|---|
| **Groq API** | Plateforme d'inférence IA ultra-rapide |
| **Llama 3.3 70B Versatile** | Extraction d'articles depuis du texte ou de la voix |
| **Llama 4 Scout 17B** | Reconnaissance d'image (photo de liste de courses) |
| **Web Speech API** | Reconnaissance vocale dans le navigateur (français) |
| **getUserMedia API** | Accès à la caméra pour photographier une liste |

### Déploiement
| Technologie | Rôle |
|---|---|
| **Vercel** | Hébergement et déploiement continu |
| **GitHub** | Gestion du code source |

---

## Fonctionnalités principales

- **Catalogue produits** avec filtres par catégorie
- **Panier** avec gestion des quantités et calcul automatique
- **Commande par IA** : dicte ta liste de courses à voix haute, par texte ou en prenant une photo — l'IA détecte les produits et les ajoute au panier
- **Espace client** : suivi des commandes en temps réel
- **Espace admin** : gestion des produits, commandes et utilisateurs
- **Espace préparateur** : préparation des commandes avec suivi étape par étape
- **Espace livreur** : gestion des livraisons

---

## Architecture

```
app/
├── (admin)/          → Dashboard administrateur
├── (auth)/           → Pages login / register
├── (client)/         → Espace client
├── (preparateur)/    → Espace préparateur
├── (livreur)/        → Espace livreur
├── api/ai-cart/      → API Groq (parsing IA de la liste de courses)
├── panier/           → Page panier avec assistant IA
└── page.tsx          → Page d'accueil publique

components/
├── AiCartInput.tsx       → Composant commande par voix/texte/photo
├── AiFloatingAgent.tsx   → Bulle agent IA (hero page)
└── layout/               → Navbar, footer, cartes stat...

lib/
└── firestore.ts      → Toutes les fonctions Firestore
```
