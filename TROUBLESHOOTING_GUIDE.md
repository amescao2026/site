# 🔧 GUIDE DE CORRECTION - Problèmes d'accès et d'upload

## PROBLÈME 1: Données inaccessibles aux utilisateurs non-admin

**Symptôme**: Les utilisateurs authentifiés (non-admin) ne peuvent pas accéder aux données des tables
- Albums ne s'affichent pas
- Événements ne s'affichent pas
- Rapports ne s'affichent pas

**Cause**: Les RLS Policies actuelles restreignent la lecture (SELECT) aux admins seulement
- La policy SELECT doit être: `USING (auth.role() = 'authenticated')` et non `role = 'admin'`

**Correction**: Exécuter le script SQL dans `RLS_POLICIES_FIX.sql`
- Va créer les policies SELECT pour permettre la lecture à TOUS les utilisateurs authentifiés
- Va garder les policies INSERT/UPDATE/DELETE restreintes aux admins

---

## PROBLÈME 2: Upload d'images ne fonctionne pas

**Symptômes**:
1. ProfileModal ne peut pas uploader la photo de profil
2. FormModal (RichEditor avec SingleImageUpload) ne peut pas uploader d'images

**Causes possibles**:

### 2a. RLS Policy du bucket storage `amescao`
- Restriction: Le bucket n'autorise que les admins à uploader
- Solution: La policy INSERT doit être: `auth.role() = 'authenticated'` et non `role = 'admin'`

### 2b. Code - Pas d'erreur apparente trouvée
- Les composants SingleImageUpload et MultipleImageUpload utilisent `uploadFile()` correctement
- La fonction uploadFile() dans database.ts semble bien implémentée

**Correction**: 
1. Exécuter le script SQL dans `RLS_POLICIES_FIX.sql`
   - Va créer la policy INSERT pour le bucket `amescao` permettant l'upload à tous les authentifiés
2. Vérifier les erreurs dans la console du navigateur (F12) après la correction RLS

---

## 📋 ÉTAPES DE CORRECTION

### ✅ ÉTAPE 1: Accéder à Supabase Dashboard

1. Allez à https://app.supabase.com
2. Connectez-vous à votre compte
3. Sélectionnez votre projet

### ✅ ÉTAPE 2: Exécuter le script SQL

1. Allez à **SQL Editor** (dans la sidebar gauche)
2. Cliquez sur **New Query**
3. Copiez tout le contenu du fichier `RLS_POLICIES_FIX.sql`
4. Collez dans l'éditeur SQL
5. Cliquez sur **Run** (bouton en bas à droite)
6. Attendez que le script s'exécute complètement (devrait afficher "Success")

### ✅ ÉTAPE 3: Vérifier dans votre application

1. Rafraîchissez votre app (Ctrl+F5 pour forcer)
2. Testez:
   - ✓ Les utilisateurs authentifiés peuvent voir les albums/événements/rapports
   - ✓ Le ProfileModal permet d'uploader une photo
   - ✓ Le FormModal permet d'uploader des images

### ✅ ÉTAPE 4: Vérifier les logs

Si les uploads échouent encore:
1. Ouvrez la console du navigateur (F12)
2. Cherchez les logs `[Upload]` ou `[Database]`
3. Vérifiez les messages d'erreur exactes

---

## 🔍 DÉTAILS TECHNIQUES

### Ce que le script SQL va faire:

**Tables (events, albums, reports, bureau, profiles)**
- ✅ SELECT: Permet la lecture à `auth.role() = 'authenticated'`
- ✅ INSERT: Restreint aux admins seulement
- ✅ UPDATE: Restreint aux admins seulement  
- ✅ DELETE: Restreint aux admins seulement

**Bucket storage `amescao`**
- ✅ SELECT: Permet la lecture à tous (public)
- ✅ INSERT: Permet l'upload à `auth.role() = 'authenticated'`
- ✅ UPDATE: Permet la modification aux utilisateurs authentifiés
- ✅ DELETE: Restreint aux admins seulement

---

## 📝 RÉSUMÉ DES CHANGEMENTS

| Opération | Avant | Après |
|-----------|-------|-------|
| Lecture données (SELECT) | Admin seulement ❌ | Tous authentifiés ✅ |
| Upload images (INSERT storage) | Admin seulement ❌ | Tous authentifiés ✅ |
| Modifier données (UPDATE) | Admin seulement ✅ | Admin seulement ✅ |
| Supprimer données (DELETE) | Admin seulement ✅ | Admin seulement ✅ |

---

## ⚠️ IMPORTANT

- Les utilisateurs non-authentifiés (anonymes) n'ont AUCUN accès
- Seuls les utilisateurs avec `role = 'admin'` peuvent modifier/supprimer
- Le bucket storage permet la lecture publique des fichiers (c'est normal et désiré)

---

## ❓ QUESTIONS/PROBLÈMES

Si après l'exécution du script vous avez encore des problèmes:

1. **Les données ne s'affichent toujours pas**
   - Vérifiez que vous êtes connecté avec un utilisateur authentifié
   - Ouvrez F12 → Console et cherchez les erreurs Supabase
   - Vérifiez que les RLS policies ont bien été créées (SQL Editor → Policies)

2. **L'upload d'images échoue toujours**
   - Vérifiez le message d'erreur exact dans F12 → Console
   - Vérifiez que le bucket `amescao` existe et est configuré public
   - Vérifiez que les policies du bucket ont bien été créées

3. **Erreur "bucket not found"**
   - Créez le bucket `amescao` manuellement:
     - Allez à Storage → New Bucket
     - Nom: `amescao`
     - Cochez "Public bucket"
     - Créez

---

## 🎯 PROCHAINES ÉTAPES

Après la correction:
- Les utilisateurs authentifiés verront toutes les données (albums, événements, rapports)
- Les utilisateurs authentifiés pourront uploader des images
- Seuls les admins pourront modifier/supprimer les données
- L'authentification remains obligatoire pour tout accès
