# 🔧 CORRECTION DES PROBLÈMES - Guide Complet

## 📌 RÉSUMÉ DES PROBLÈMES

### Problème 1: Données inaccessibles aux utilisateurs non-admin ❌
Les utilisateurs authentifiés (non-admin) ne peuvent pas voir les albums, événements, rapports, etc.

### Problème 2: Upload d'images ne fonctionne pas ❌
- ProfileModal : impossible d'uploader la photo de profil
- FormModal : impossible d'uploader des images dans les formulaires

---

## 🎯 CAUSE

Les **RLS (Row Level Security) Policies** de Supabase sont actuellement trop restrictives :
- ✗ Les SELECT policies restreignent la lecture aux admins seulement
- ✗ Les INSERT policies du bucket storage restreignent l'upload aux admins seulement

---

## ✅ SOLUTION

Exécuter le script SQL `RLS_POLICIES_FIX.sql` qui va :
- ✅ Permettre la lecture (SELECT) à **TOUS les utilisateurs authentifiés**
- ✅ Permettre l'upload (INSERT) à **TOUS les utilisateurs authentifiés**  
- ✅ Garder les modifications (UPDATE/DELETE) **réservées aux admins**

---

## 📋 ÉTAPES DE CORRECTION

### **ÉTAPE 1 : Accéder à Supabase Dashboard**

1. Ouvrez https://app.supabase.com
2. Connectez-vous
3. Sélectionnez votre projet (amescao)

### **ÉTAPE 2 : Accéder à l'éditeur SQL**

1. Cliquez sur **SQL Editor** dans la sidebar gauche
2. Cliquez sur **New Query** (bouton en haut à droite)

### **ÉTAPE 3 : Exécuter le script de correction**

1. Copiez tout le contenu du fichier `RLS_POLICIES_FIX.sql`
2. Collez-le dans l'éditeur SQL
3. Cliquez sur le bouton **Run** (en bas à droite, ou Ctrl+Enter)
4. Attendez quelques secondes que le script s'exécute

### **ÉTAPE 4 : Vérifier l'exécution**

Vous devriez voir :
- Message de succès en bas de l'écran
- Pas d'erreurs en rouge
- Les logs montrant les policies créées

---

## 🧪 TEST DES CORRECTIONS

### Test 1: Vérifier que les données sont accessibles
1. Rafraîchissez votre app (Ctrl+F5 pour forcer le cache)
2. Visitez `/` (page d'accueil)
3. ✅ Vous devez voir les albums, événements, rapports
4. Ouvrez F12 → Console pour vérifier qu'il n'y a pas d'erreurs Supabase

### Test 2: Vérifier que l'upload fonctionne
1. Cliquez sur votre profil (coin haut droit) → ProfileModal
2. Cliquez sur le bouton "Changer photo"
3. ✅ L'upload doit fonctionner sans erreur

### Test 3: Vérifier l'upload dans FormModal
1. Allez à `/admin` (si vous êtes admin)
2. Ouvrez un élément (ex: événement)
3. Essayez d'uploader une image
4. ✅ L'upload doit fonctionner

---

## ⚠️ SI ÇA NE FONCTIONNE TOUJOURS PAS

### Les données ne s'affichent pas encore

**Étape 1: Vérifier les policies**
1. Allez à **SQL Editor**
2. Exécutez cette requête pour vérifier :
```sql
SELECT policyname, permissive, roles, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'events', 'albums', 'reports', 'bureau')
ORDER BY tablename, policyname;
```
3. Vous devez voir les policies avec `authenticated` dans les rôles

**Étape 2: Vérifier que vous êtes connecté**
1. Ouvrez F12 → Console
2. Exécutez :
```javascript
const { data: { session } } = await window.supabase.auth.getSession()
console.log(session)
```
3. Vous devez voir une session avec un utilisateur

**Étape 3: Vérifier les erreurs Supabase**
1. Ouvrez F12 → Console
2. Cherchez les messages d'erreur en rouge
3. Notez exactement le message d'erreur
4. Vérifiez que les données existent dans Supabase

### L'upload d'images échoue toujours

**Étape 1: Vérifier le bucket**
1. Allez à **Storage** dans Supabase
2. Vérifiez que le bucket `amescao` existe
3. Si absent, créez-le :
   - Cliquez **New Bucket**
   - Nom: `amescao`
   - Cochez **Public bucket**
   - Créez

**Étape 2: Vérifier les policies du bucket**
1. Allez à **SQL Editor**
2. Exécutez cette requête :
```sql
SELECT policyname, permissive, roles 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;
```
3. Vous devez voir une policy `amescao_insert_authenticated`

**Étape 3: Vérifier les logs**
1. Ouvrez F12 → Console
2. Cherchez les logs `[Upload]` 
3. Notez le message d'erreur exact
4. Vérifiez que la variable d'environnement `NEXT_PUBLIC_SUPABASE_URL` est définie

---

## 📊 VÉRIFICATION FINALE

### Checklist de vérification

```
□ RLS policies SELECT existent pour users authentifiés
□ RLS policies INSERT existent pour storage authentifiés
□ Bucket 'amescao' existe et est public
□ Utilisateur est authentifié (peut voir session)
□ Aucune erreur Supabase en F12 Console
□ Les données s'affichent sur la page d'accueil
□ L'upload d'images fonctionne dans ProfileModal
□ L'upload d'images fonctionne dans FormModal
□ Les modifications (edit/delete) restent réservées aux admins
```

---

## 🚨 PROBLÈMES CONNUS À ÉVITER

### Ne pas désactiver RLS complètement
❌ **Mauvais** : `ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;`
- Cela rendrait les données publiques et modifiables

✅ **Bon** : Créer les policies SELECT appropriées

### Ne pas oublier le bucket storage
Le script corrige aussi les policies du bucket `amescao`. Si vous avez un bucket différent, modifiez le script.

### Vérifier l'authentification
Tous les utilisateurs doivent être authentifiés pour :
- Lire les données (avec la new RLS policy)
- Uploader des images

Les utilisateurs anonymes n'auront aucun accès.

---

## 📞 EN CAS DE PROBLÈME PERSISTANT

1. Prenez une capture d'écran de l'erreur
2. Ouvrez F12 → Console et copiez toutes les erreurs
3. Allez à **SQL Editor** et exécutez :
```sql
SELECT tablename, policyname, permissive, roles, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```
4. Partagez les résultats pour diagnostiquer le problème

---

## 🎓 EXPLICATION TECHNIQUE

### Avant la correction (❌ État actuel)
```
- Utilisateur non-admin → Demande albums → Supabase refuse (RLS policy admin only)
- Utilisateur authentifié → Upload image → Supabase refuse (RLS policy admin only)
```

### Après la correction (✅ État désiré)
```
- Utilisateur authentifié → Demande albums → Supabase accepte ✅
- Utilisateur authentifié → Upload image → Supabase accepte ✅
- Utilisateur authentifié → Modifie album → Supabase refuse si non-admin ✅
- Admin → Modifie/supprime données → Supabase accepte ✅
```

---

## ✨ RÉSUMÉ

- Le code de l'application est **correct** ✅
- Les fonctions d'upload sont **correctes** ✅
- Les services Supabase sont **corrects** ✅
- **Seules les RLS policies doivent être corrigées** 🔧

Après exécution du script SQL, tout devrait fonctionner ! 🎉
