# 🔍 GUIDE DE DÉBOGAGE - Utiliser le logging pour diagnostiquer les problèmes

## 📊 LOGS DISPONIBLES

L'application a maintenant un logging amélioré pour vous aider à diagnostiquer les problèmes. Voici les tags de log:

- `[Database]` - Opérations de base de données
- `[Upload]` - Opérations d'upload de fichiers
- `[SingleImageUpload]` - Upload d'image unique
- `[MultipleImageUpload]` - Upload de plusieurs images
- `[ProfileModal]` - Upload de photo de profil

---

## 🧪 COMMENT VOIR LES LOGS

### Étape 1: Ouvrir la console du navigateur
1. Appuyez sur **F12** (ou Ctrl+Shift+I)
2. Cliquez sur l'onglet **Console**

### Étape 2: Filtrer les logs
1. Dans la barre de recherche Console, tapez: `Database`, `Upload`, etc.
2. Utilisez les filtres pour afficher uniquement ce qui vous intéresse

### Étape 3: Voir les détails
- Les logs avec ✅ indiquent une réussite
- Les logs avec ❌ indiquent une erreur
- Les logs avec ⚠️ indiquent un avertissement
- Les logs avec 📡 indiquent une opération en cours

---

## 🎯 SCÉNARIOS DE DÉBOGAGE

### Scénario 1: Les données ne s'affichent pas

**1. Vérifiez que vous êtes authentifié**
```
Cherchez le log:
[Database] 👤 Authenticated as: votre_email@exemple.com (ID: xxx)
```
- ✅ Si vous voyez ce log → Vous êtes authentifié
- ❌ Si vous voyez "No authenticated session" → Vous n'êtes pas connecté

**2. Vérifiez les erreurs Supabase**
```
Cherchez le log:
[Database] ❌ Error fetching from [table]:
```
- ✅ Si pas d'erreur → Les RLS policies permettent l'accès
- ❌ Si erreur "permission" → Les RLS policies bloquent l'accès

**3. Vérifiez les détails de l'erreur**
```
Les logs affichent:
- message: le message d'erreur
- code: le code d'erreur Supabase
- details: détails supplémentaires
- hint: conseil pour résoudre
```

### Scénario 2: L'upload d'images échoue

**1. Vérifiez le fichier**
```
Cherchez le log:
[Upload] 📤 Uploading file: photo.jpg to bucket: amescao
[Upload] 📊 File details: image/jpeg, 2048000 bytes
```
- ✅ Si vous voyez ce log → Le fichier est bien envoyé
- ❌ Si absent → Le fichier n'a pas pu être traité

**2. Vérifiez la taille du fichier**
```
Cherchez dans le log:
[Upload] 📊 File details: image/jpeg, X bytes
```
- ✅ Si < 10 MB → Taille OK
- ❌ Si > 10 MB → Fichier trop gros (limite: 10 MB)

**3. Vérifiez les erreurs d'upload**
```
Cherchez le log:
[Upload] ❌ Upload error:
[Upload] 🔍 Error details:
```
- Notez le `statusCode` et le `message`
- 403 = Problème de permissions (RLS policy)
- 404 = Bucket non trouvé

**4. Vérifiez que l'upload a réussi**
```
Cherchez le log:
[Upload] ✅ File uploaded successfully: https://...
```
- ✅ Si présent → L'upload a réussi
- ❌ Si absent → L'upload a échoué

### Scénario 3: ProfileModal ne peut pas uploader

**1. Déclenchez l'upload**
```
Cherchez le log:
[ProfileModal] 📤 Starting profile photo upload: photo.jpg ...
```

**2. Vérifiez le succès ou l'erreur**
```
✅ [ProfileModal] ✅ Profile photo upload successful: https://...

❌ [ProfileModal] ❌ Erreur d'upload
   [ProfileModal] 🔍 Error details: [message d'erreur]
```

---

## 📋 CHECKLIST DE DÉBOGAGE

### Si les données ne s'affichent pas:
```
□ Vous êtes connecté ? (voir log [Database] 👤)
□ Pas d'erreur Supabase ? (pas de log [Database] ❌)
□ RLS policies permettent SELECT pour authenticated ? (voir Supabase dashboard)
□ Vous avez exécuté RLS_POLICIES_FIX.sql ? (obligatoire)
```

### Si l'upload échoue:
```
□ Le fichier est sélectionné ? (voir log [Upload] 📤)
□ Le fichier < 10 MB ? (voir log [Upload] 📊)
□ Pas d'erreur permission ? (pas de "403" dans logs)
□ RLS policies permettent INSERT pour authenticated ? (voir Supabase dashboard)
□ Vous avez exécuté RLS_POLICIES_FIX.sql ? (obligatoire)
```

---

## 🔍 MESSAGES D'ERREUR COURANTS

### "bucket not found"
**Cause**: Le bucket `amescao` n'existe pas dans Supabase Storage
**Solution**: Créez le bucket manuellement dans Supabase Storage

### "permission denied" ou "403"
**Cause**: Les RLS policies du bucket ne permettent pas l'upload
**Solution**: Exécutez `RLS_POLICIES_FIX.sql`

### "No authenticated session"
**Cause**: L'utilisateur n'est pas connecté
**Solution**: Connectez-vous d'abord via `/auth/login`

### "Failed to fetch from [table]"
**Cause**: Les RLS policies SELECT ne permettent pas l'accès
**Solution**: Exécutez `RLS_POLICIES_FIX.sql`

---

## 💡 ASTUCES UTILES

### Exporter les logs pour diagnostique
```javascript
// Dans la console, exécutez:
copy(document.querySelector('.console-log').innerText)
// Puis collez dans un fichier pour partager
```

### Voir toutes les erreurs Supabase
```javascript
// Dans la console, exécutez:
JSON.stringify(supabase, null, 2)
// Pour voir l'état du client Supabase
```

### Vérifier si vous êtes authentifié
```javascript
// Dans la console, exécutez:
const { data: { session } } = await supabase.auth.getSession()
console.log(session)
// Devrait afficher votre profil utilisateur
```

### Tester un upload manuellement
```javascript
// Dans la console:
const response = await supabase.storage
  .from('amescao')
  .upload('test.txt', new Blob(['test']))
console.log(response)
```

---

## 📞 SIGNALEMENT DE BUG

Si vous trouvez un bug, incluez:
1. **Screenshots ou texte des logs**
   - Ouvrez F12 → Console
   - Cherchez les logs `[Database]`, `[Upload]`, etc.
   - Copiez les logs pertinents

2. **Description du problème**
   - Qu'essayiez-vous de faire ?
   - Qu'est-ce qui s'est passé au lieu de ça ?

3. **Vérifications**
   - Êtes-vous connecté ?
   - Avez-vous exécuté `RLS_POLICIES_FIX.sql` ?
   - Quel message d'erreur exact voyez-vous ?

---

## ✨ EXEMPLE DE LOGS CORRECTS

### Lecteur de données - Succès
```
[Database] 📡 Fetching all from table "albums" ordered by "event_date" (ascending: false)
[Database] 👤 Authenticated as: user@example.com (ID: 123abc...)
[Database] ✅ Successfully fetched 5 items from "albums"
```

### Upload d'image - Succès
```
[Upload] 📤 Uploading file: photo_12345.jpg to bucket: amescao
[Upload] 📊 File details: image/jpeg, 2048000 bytes
[Upload] ✅ File uploaded successfully: https://...supabase.co/storage/v1/object/public/amescao/photo_12345.jpg
```

### ProfileModal - Succès
```
[ProfileModal] 📤 Starting profile photo upload: avatar.png (image/png, 1024000 bytes)
[ProfileModal] ✅ Profile photo upload successful: https://...
```

---

**Version**: 1.0  
**Dernière mise à jour**: 16 mai 2026
