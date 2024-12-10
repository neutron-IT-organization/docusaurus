# Exercice Guidé : Gestion des Utilisateurs dans OpenShift

Cet exercice guidé est conçu pour être réalisé en **mode démonstration par un seul participant**. Vous allez configurer un fournisseur d'identité avec **htpasswd**, ajouter deux utilisateurs, leur attribuer des droits différents, puis vérifier que leurs accès au cluster diffèrent en fonction des permissions attribuées.

---

## Objectifs de l'Exercice

- Configurer un fournisseur d'identité (Identity Provider) `htpasswd` dans OpenShift.
- Créer deux utilisateurs avec des identifiants distincts.
- Attribuer des rôles différents à ces utilisateurs.
- Vérifier que chaque utilisateur a des accès spécifiques au cluster.
- Nettoyer le fournisseur d'identité et les utilisateurs créés.

---

## Prérequis

- Un cluster OpenShift opérationnel avec des droits administratifs.
- OpenShift CLI (`oc`) installé et configuré.
- Un outil pour gérer des fichiers comme `vi`, `nano`, ou un éditeur de texte similaire.

---

## Étapes de l'Exercice

### 1. Configurer le Fournisseur d'Identité `htpasswd`

1. **Installer `htpasswd`** :  
   Si `htpasswd` n’est pas installé, installez-le sur votre machine (exemple pour RHEL/CentOS) :
   ```bash
   sudo yum install httpd-tools
   ```

2. **Créer un fichier htpasswd** :  
   Générez un fichier htpasswd contenant les utilisateurs :
   ```bash
   htpasswd -c -B -b htpasswd-file user1 password1
   htpasswd -b htpasswd-file user2 password2
   ```
   - `user1` aura le mot de passe `password1`.
   - `user2` aura le mot de passe `password2`.

3. **Uploader le fichier comme Secret** :  
   Créez un secret contenant le fichier htpasswd dans OpenShift :
   ```bash
   oc create secret generic htpasswd-secret --from-file=htpasswd=htpasswd-file -n openshift-config
   ```

4. **Configurer le fournisseur d'identité** :  
   Mettez à jour la configuration OAuth pour utiliser `htpasswd` comme Identity Provider :
   ```bash
   oc edit oauth cluster
   ```
   Ajoutez le bloc suivant dans `spec.identityProviders` :
   ```yaml
   spec:
     identityProviders:
     - name: htpasswd_provider
       mappingMethod: claim
       type: HTPasswd
       htpasswd:
         fileData:
           name: htpasswd-secret
   ```

5. **Vérifier la configuration** :  
   Une fois appliquée, vérifiez que le fournisseur d'identité est actif :
   ```bash
   oc get oauth cluster -o yaml
   ```

---

### 2. Attribuer des Rôles Différents aux Utilisateurs

1. **Ajouter les utilisateurs au cluster** :  
   Connectez-vous avec les nouveaux utilisateurs pour qu'ils soient reconnus dans OpenShift.

2. **Attribuer des rôles** :  
   - Donnez à `user1` le rôle `view` sur un projet spécifique :
     ```bash
     oc create project demo-user1
     oc policy add-role-to-user view user1 -n demo-user1
     ```
   - Donnez à `user2` le rôle `edit` sur le même projet :
     ```bash
     oc policy add-role-to-user edit user2 -n demo-user1
     ```

---

### 3. Vérifier les Accès des Utilisateurs

1. **Connexion en tant que `user1`** :  
   - Connectez-vous en tant que `user1` dans la console web ou via `oc` :
     ```bash
     oc login -u user1 -p password1
     ```
   - Essayez d’exécuter les commandes suivantes dans le projet `demo-user1` :
     - **Lister les pods** (autorisé) :
       ```bash
       oc get pods -n demo-user1
       ```
     - **Créer un pod** (interdit) :
       ```bash
       oc run nginx --image=nginx -n demo-user1
       ```

2. **Connexion en tant que `user2`** :  
   - Connectez-vous en tant que `user2` :
     ```bash
     oc login -u user2 -p password2
     ```
   - Essayez les mêmes commandes dans le projet `demo-user1` :
     - **Lister les pods** (autorisé) :
       ```bash
       oc get pods -n demo-user1
       ```
     - **Créer un pod** (autorisé) :
       ```bash
       oc run nginx --image=nginx -n demo-user1
       ```

3. **Observer les différences** :  
   Notez que `user1` peut uniquement consulter les ressources, tandis que `user2` peut consulter et modifier les ressources du projet.

---

### 4. Nettoyage

1. **Supprimer le projet et les permissions** :
   ```bash
   oc delete project demo-user1
   ```

2. **Supprimer le fournisseur d'identité** :  
   - Éditez la configuration OAuth pour retirer le fournisseur `htpasswd_provider` :
     ```bash
     oc edit oauth cluster
     ```
     Supprimez le bloc correspondant au fournisseur `htpasswd_provider`.

   - Supprimez le secret associé :
     ```bash
     oc delete secret htpasswd-secret -n openshift-config
     ```

3. **Supprimer les utilisateurs (optionnel)** :  
   Bien qu’OpenShift ne supprime pas automatiquement les utilisateurs connectés via un fournisseur d’identité, vous pouvez manuellement nettoyer leurs traces :
   ```bash
   oc delete user user1
   oc delete user user2
   oc delete identity htpasswd_provider:user1
   oc delete identity htpasswd_provider:user2
   ```

---

## Conclusion

Cet exercice vous a permis de configurer un fournisseur d’identité dans OpenShift, de gérer des utilisateurs et de leur attribuer des permissions spécifiques. En suivant ce processus, vous êtes capable de restreindre ou d’accorder des droits adaptés aux besoins des différents utilisateurs du cluster. Le nettoyage final garantit un environnement propre, prêt pour de futurs exercices ou configurations.