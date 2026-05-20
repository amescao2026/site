# 📚 DOCUMENTATION COMPLÈTE - AMESCAO

**Dernière mise à jour**: Mai 2026  
**Version**: 1.0  

---

## 📑 Table des matières

1. [Démarrage rapide](#démarrage-rapide)
2. [Architecture Supabase](#architecture-supabase)
3. [Guide Administrateur](#guide-administrateur)
4. [Configuration RLS & Sécurité](#configuration-rls--sécurité)
5. [Débogage & Logs](#débogage--logs)
6. [Système de Consentement RGPD](#système-de-consentement-rgpd)
7. [Checklist d'intégration](#checklist-dintégration)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Démarrage rapide

### ⏱️ 5 minutes pour tout mettre en place

**Étape 1 : Copier et exécuter le script SQL**

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Allez à **SQL Editor** → **New Query**
4. Copiez le contenu du fichier `RLS_POLICIES_FIX.sql`
5. Cliquez **Run**

**Étape 2 : Tester**

```bash
npm run dev
```

Accédez à http://localhost:3000

- ✅ Les utilisateurs authentifiés voient les données
- ✅ Les utilisateurs peuvent uploader des images
- ✅ Seuls les admins peuvent modifier/supprimer

**Étape 3 : Vérifier les logs**

Ouvrez F12 → Console pour voir les logs `[Database]` et `[Upload]`

---

## 🏗️ Architecture Supabase

### Structure des fichiers

```
src/services/
├── supabase/
│   ├── client.ts          ← CLIENT-SIDE (ANON_KEY)
│   └── server.ts          ← SERVER-SIDE (SERVICE_ROLE_KEY)
├── supabase.ts            ← SERVICE LAYER (couche métier)
└── ...

src/admin/config/
└── database.ts            ← ADMIN SERVICE (CRUD operations)
```

### Clients Supabase

**Client Côté Client** (`src/services/supabase/client.ts`)
- ✅ Utilisé partout : Client Components, RSC, edge functions
- 🔐 Clé ANON : Sécurisée par RLS policies
- 📦 Export : `supabase`, `SUPABASE_CONFIG`

**Client Côté Serveur** (`src/services/supabase/server.ts`)
- ⚠️ Réservé au serveur : Server Actions, API Routes, Middleware
- 🔓 Clé SERVICE_ROLE : Pleins droits, NE JAMAIS exposer
- 📦 Export : `supabaseAdmin`

### Service Layer (`src/services/supabase.ts`)

Couche d'abstraction pour les opérations métier :

- `getEvents()`, `getAlbums()`, `getReports()`, `getBoardMembers()`
- `getCurrentUserProfile()`, `updateUserProfile()`
- `getMediaUrl()` - Construit les URLs Supabase Storage
- `renderBlocksToText()` - Convertit blocks en texte

**Avantages** :
- ✅ Centralise la logique d'accès
- ✅ Réutilisable partout
- ✅ Facile à maintenir et tester

### Admin Service (`src/admin/config/database.ts`)

API pour le tableau de bord admin avec opérations CRUD :

- `getAll(table)` - Récupère tous les items
- `insertItem(table, payload)` - Crée un nouvel item
- `updateItem(table, id, payload)` - Met à jour un item
- `deleteItem(table, id)` - Supprime un item
- `uploadFile(file, bucket)` - Upload vers Storage
- `getCurrentUserProfile()` - Récupère le profil utilisateur

---

## 👨‍💼 Guide Administrateur

### Accès à la Page Admin

```
http://localhost:3000/admin
```

**Conditions requises** :
- ✅ Vous devez être authentifié
- ✅ Votre profil doit avoir `role = 'admin'`

### Structure des Tables

#### 1️⃣ **Profils** (`profiles`)
Gère les profils utilisateurs du système.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | ID unique (auto) |
| `name` | Text | Prénom |
| `surname` | Text | Nom de famille |
| `email` | Email | Email unique |
| `photo` | Text | URL de la photo |
| `role` | Select | Rôle (`member`, `admin`) |
| `created_at` | Timestamp | Date de création |

#### 2️⃣ **Bureau** (`bureau`)
Gère les membres du bureau de l'association.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | ID unique (auto) |
| `name` | Text | Prénom |
| `surname` | Text | Nom de famille |
| `role` | Text | Poste (Président, Vice-Président, etc.) |
| `biography` | Text | Biographie détaillée |
| `photo` | Text | URL de la photo |
| `order` | Number | Ordre d'affichage |

#### 3️⃣ **Événements** (`events`)
Gère tous les événements de l'association.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | ID unique (auto) |
| `title` | Text | Titre de l'événement |
| `date` | Timestamp | Date et heure |
| `content` | Rich Text | Description détaillée (HTML) |
| `cover_photo` | Text | Photo principale |
| `other_photos` | Array | Galerie de photos supplémentaires |
| `location` | Text | Lieu de l'événement |

#### 4️⃣ **Rapports** (`reports`)
Gère les rapports d'activité.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | ID unique (auto) |
| `title` | Text | Titre du rapport |
| `date` | Date | Date de publication |
| `content` | Rich Text | Contenu / Résumé |
| `document_pdf_link` | Text | URL du PDF |

#### 5️⃣ **Albums** (`albums`)
Gère les albums photos par événement.

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID | ID unique (auto) |
| `event_id` | UUID | ID de l'événement lié |
| `event_title` | Text | Titre de l'événement |
| `event_date` | Date | Date de l'événement |
| `photos` | Array | Liste des URLs des photos |

### Utilisation de la Page Admin

**Créer un nouvel élément** :
1. Cliquez sur **"+ Nouveau"** en haut à droite
2. Remplissez le formulaire
3. Validez les champs obligatoires (affichés en rouge)
4. Cliquez sur **"Enregistrer"**

**Modifier un élément** :
1. Cliquez sur la **carte** de l'élément
2. Le formulaire s'ouvre avec les données pré-remplies
3. Apportez les changements
4. Cliquez sur **"Enregistrer"**

**Supprimer un élément** :
1. Passez votre souris sur la **carte**
2. Cliquez sur l'icône **🗑️ (Supprimer)**
3. Confirmez la suppression

### Types de Champs

| Type | Description |
|------|-------------|
| `text` | Texte simple |
| `email` | Adresse email |
| `number` | Nombre |
| `date` | Date seulement |
| `datetime-local` | Date + Heure |
| `textarea` | Texte multiligne |
| `rich_text` | Éditeur de texte riche (avec HTML) |
| `select` | Liste déroulante |
| `single_image` | Une image (upload) |
| `multiple_images` | Plusieurs images (upload) |
| `file_url` | Lien ou upload PDF |

---

## 🔐 Configuration RLS & Sécurité

### Problèmes Courants

#### ❌ Données inaccessibles aux utilisateurs authentifiés

**Symptôme**: Les utilisateurs authentifiés (non-admin) ne peuvent pas accéder aux données.

**Cause**: Les RLS Policies SELECT restreignent la lecture aux admins seulement.

**Solution**: Exécuter `RLS_POLICIES_FIX.sql` dans Supabase SQL Editor.

#### ❌ Upload d'images ne fonctionne pas

**Symptôme**: L'upload échoue avec une erreur permission denied (403).

**Cause**: Les RLS Policies INSERT du bucket restreignent l'upload aux admins seulement.

**Solution**: Exécuter `RLS_POLICIES_FIX.sql` dans Supabase SQL Editor.

### Configuration Correcte des RLS Policies

**Après exécution de `RLS_POLICIES_FIX.sql`** :

| Opération | Authentifié | Admin | Anonyme |
|-----------|------------|-------|---------|
| Lire données (SELECT) | ✅ | ✅ | ❌ |
| Uploader images (INSERT) | ✅ | ✅ | ❌ |
| Modifier données (UPDATE) | ❌ | ✅ | ❌ |
| Supprimer données (DELETE) | ❌ | ✅ | ❌ |

### Vérification des RLS Policies

Dans Supabase Dashboard → SQL Editor, exécutez :

```sql
-- Vérifier que RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'bureau', 'events', 'albums', 'reports');

-- Devrait afficher : rowsecurity = t (true)
```

---

## 🔍 Débogage & Logs

### Ouvrir la Console du Navigateur

1. Appuyez sur **F12** (ou Ctrl+Shift+I)
2. Cliquez sur l'onglet **Console**

### Logs Disponibles

Les logs sont taggés pour faciliter le filtering :

- `[Database]` - Opérations de base de données
- `[Upload]` - Opérations d'upload de fichiers
- `[SingleImageUpload]` - Upload d'image unique
- `[MultipleImageUpload]` - Upload de plusieurs images
- `[ProfileModal]` - Upload de photo de profil
- `[Auth]` - Opérations d'authentification

### Exemple de Logs Corrects

**Lecteur de données - Succès** :
```
[Database] 📡 Fetching all from table "albums" ordered by "event_date" (ascending: false)
[Database] 👤 Authenticated as: user@example.com (ID: 123abc...)
[Database] ✅ Successfully fetched 5 items from "albums"
```

**Upload d'image - Succès** :
```
[Upload] 📤 Uploading file: photo_12345.jpg to bucket: amescao
[Upload] 📊 File details: image/jpeg, 2048000 bytes
[Upload] ✅ File uploaded successfully: https://...
```

### Scénarios de Débogage

**Si les données ne s'affichent pas** :
1. ✅ Vérifiez que vous êtes connecté (voir log `[Database] 👤`)
2. ✅ Vérifiez qu'il n'y a pas d'erreur Supabase (pas de log `[Database] ❌`)
3. ✅ Vérifiez que les RLS policies permettent SELECT (exécutez `RLS_POLICIES_FIX.sql`)

**Si l'upload d'images échoue** :
1. ✅ Vérifiez que le fichier < 10 MB (voir log `[Upload] 📊`)
2. ✅ Vérifiez qu'il n'y a pas d'erreur 403 permission denied
3. ✅ Vérifiez que les RLS policies permettent INSERT (exécutez `RLS_POLICIES_FIX.sql`)

### Erreurs Courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| "bucket not found" | Bucket `amescao` n'existe pas | Créer le bucket dans Supabase Storage |
| "permission denied" (403) | RLS policies bloquent l'accès | Exécuter `RLS_POLICIES_FIX.sql` |
| "No authenticated session" | Utilisateur pas connecté | Se connecter via `/auth/login` |
| "new row violates row-level security policy" | RLS policies SELECT manquantes | Exécuter `RLS_POLICIES_FIX.sql` |

---

## 🍪 Système de Consentement RGPD

### Vue d'ensemble

Le système gère le consentement utilisateur pour :
- ✅ Analytics (Google Analytics, Facebook Pixel)
- ✅ Marketing (cookies de suivi)
- ✅ Préférences (personnalisation du site)

### Composants

**CookieBanner.tsx** - Banneau sticky en bas de page
- Apparaît 500ms après le chargement
- Trois options : Accepter tout, Refuser, Personnaliser
- Sauvegarde le consentement en base de données

**AnalyticsInitializer.tsx** - Initialise les analytics
- Vérifie le consentement utilisateur
- Initialise Google Analytics si accepté
- Initialise Facebook Pixel si accepté

**useConsent.ts** - Hook personnalisé
- Récupère le consentement utilisateur
- Met à jour le consentement

**consentUtils.ts** - Utilitaires
- Gère le cookie `user_consent`
- Sauvegarde en base de données

### Table Supabase

```sql
CREATE TABLE user_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analytics BOOLEAN DEFAULT false,
  marketing BOOLEAN DEFAULT false,
  preferences BOOLEAN DEFAULT true,
  accepted_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Configuration

1. **Migration SQL** : Exécuter `migrations/001_create_user_consents.sql`
2. **Variables d'environnement** : Ajouter `NEXT_PUBLIC_GA_ID` et `NEXT_PUBLIC_FB_PIXEL_ID`
3. **Layout** : Importer `<CookieBanner />` dans `app/layout.tsx`

---

## ✅ Checklist d'intégration

### ✅ ÉTAPE 1: Copier les Requêtes SQL

1. Ouvrez **RLS_POLICIES_FIX.sql**
2. Copiez tout le code SQL
3. Allez sur https://app.supabase.com

### ✅ ÉTAPE 2: Exécuter dans Supabase

1. Sélectionnez votre projet
2. Cliquez sur **SQL Editor** (gauche)
3. Cliquez sur **+ New Query**
4. **Collez** le code SQL
5. Cliquez sur **Run**

### ✅ ÉTAPE 3: Tester

```bash
npm run dev
```

Allez sur : **http://localhost:3000**

Vous devriez voir :
- ✅ La page d'accueil charge
- ✅ Les utilisateurs authentifiés voient les données
- ✅ Les uploads d'images fonctionnent

### ✅ ÉTAPE 4: Vérifier les logs

Ouvrez F12 → Console et cherchez :
- `[Database]` - Logs de base de données
- `[Upload]` - Logs d'upload

---

## 🆘 Troubleshooting

### ❌ "Aucune donnée" s'affiche dans l'admin

**Étapes de diagnostic** :

1. Vérifiez que vous êtes connecté
   ```javascript
   // F12 Console:
   import { supabase } from '@/src/services/supabase/client'
   const { data: { session } } = await supabase.auth.getSession()
   console.log(session)
   ```

2. Vérifiez les erreurs Supabase
   ```javascript
   // Devrait afficher les données:
   const { data, error } = await supabase.from('events').select('*')
   console.log(data, error)
   ```

3. Exécutez `RLS_POLICIES_FIX.sql` si pas déjà fait

### ❌ L'upload d'images échoue

**Étapes** :

1. Vérifiez le message d'erreur exact (F12 → Console)
2. Cherchez les logs `[Upload]` ou `[SingleImageUpload]`
3. Vérifiez la taille du fichier (max 10 MB)
4. Exécutez `RLS_POLICIES_FIX.sql` si pas déjà fait

### ❌ Impossible de modifier/supprimer des données

**Vérifications** :

- [ ] Êtes-vous connecté avec un compte admin ?
- [ ] Votre profil a `role = 'admin'` ?
- [ ] Les RLS policies UPDATE/DELETE sont-elles créées ?

```sql
-- Vérifier votre rôle:
SELECT id, name, surname, role FROM profiles WHERE id = '<votre_user_id>';
```

### ❌ Erreur "bucket not found"

**Solution** :

1. Allez dans Supabase Storage
2. Créez un nouveau bucket :
   - Nom : `amescao`
   - Cochez "Public bucket"
   - Cliquez "Create"

### ❌ Erreur "permission denied" (403)

**Solution** :

Exécutez `RLS_POLICIES_FIX.sql` dans Supabase SQL Editor. Cela va :
- ✅ Permettre la lecture à tous les utilisateurs authentifiés
- ✅ Permettre l'upload à tous les utilisateurs authentifiés
- ✅ Restreindre la modification/suppression aux admins

---

## 📋 Résumé des Fichiers

| Fichier | But |
|---------|-----|
| `README.md` | Entrée principale du projet |
| `DOCUMENTATION.md` | **VOUS ÊTES ICI** - Documentation complète |
| `RLS_POLICIES_FIX.sql` | Script SQL pour corriger les RLS policies |
| `SUPABASE_ARCHITECTURE.md` | Détails techniques de l'architecture |
| `ADMIN_GUIDE.md` | Guide complet de l'interface admin |
| `DEBUG_LOGGING_GUIDE.md` | Guide pour utiliser les logs de débogage |
| `TROUBLESHOOTING_GUIDE.md` | Guide de dépannage technique |
| `COOKIE_RGPD_SETUP.md` | Configuration du système RGPD |

---

## 🚀 Prochaines Étapes

1. **Immédiatement** :
   - Exécuter `RLS_POLICIES_FIX.sql` dans Supabase
   - Rafraîchir l'app (`npm run dev`)
   - Vérifier que tout fonctionne

2. **Court terme** :
   - Tester les uploads d'images
   - Vérifier les logs (F12 → Console)
   - Tester la page admin

3. **Long terme** :
   - Consulter cette documentation en cas de question
   - Utiliser les logs pour diagnostiquer d'autres problèmes
   - Maintenir la configuration RLS

---

## 📞 Support

Si vous avez des questions :

1. Consultez cette **DOCUMENTATION.md** (vous êtes ici)
2. Cherchez la section correspondante dans le menu
3. Ouvrez F12 → Console pour voir les logs
4. Consultez **TROUBLESHOOTING_GUIDE.md** pour les problèmes courants

---

**Version**: 1.0  
**Dernière mise à jour**: Mai 2026  
**Status**: ✅ COMPLET
