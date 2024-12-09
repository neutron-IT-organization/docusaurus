# Exercice Guidé : Gestion des Rôles et Role Bindings dans OpenShift

Cet exercice vous guidera dans la configuration et la gestion des rôles et **role bindings** dans un cluster OpenShift. Vous apprendrez à attribuer des rôles aux utilisateurs, à tester les accès et à analyser les autorisations appliquées.



## **Objectifs de l'exercice**

1. Créer et appliquer un rôle local et un rôle de cluster à un utilisateur.
2. Associer des rôles aux utilisateurs à l’aide des **role bindings** et **cluster role bindings**.
3. Tester l’accès d’un utilisateur en fonction des rôles attribués.
4. Analyser les autorisations d'un utilisateur avec les outils d’OpenShift.



## **Étape 1 : Créer un Rôle Local**

1. Créez un fichier YAML nommé `role-local.yaml` pour définir un rôle local dans un projet :

   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: Role
   metadata:
     name: viewer
     namespace: YOURCITY-user-ns
   rules:
   - apiGroups: [""]
     resources: ["pods"]
     verbs: ["get", "list"]
   ```

   **Explication** :
   - Le rôle **viewer** permet à un utilisateur de **lire** les pods dans le projet `YOURCITY-user-ns`.
   - **`get`** et **`list`** sont les actions autorisées.

2. Appliquez ce rôle dans le projet :

   ```bash
   oc apply -f role-local.yaml -n YOURCITY-user-ns
   ```

3. Vérifiez que le rôle a bien été créé :

   ```bash
   oc describe role viewer -n YOURCITY-user-ns
   ```

---

## **Étape 2 : Créer un Role Binding Local**

1. Créez un fichier `rolebinding-local.yaml` pour associer un utilisateur à ce rôle local :

   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: RoleBinding
   metadata:
     name: viewer-binding
     namespace: YOURCITY-user-ns
   subjects:
   - kind: User
     name: user1
     apiGroup: rbac.authorization.k8s.io
   roleRef:
     kind: Role
     name: viewer
     apiGroup: rbac.authorization.k8s.io
   ```

   **Explication** :
   - Ce role binding lie l'utilisateur `user1` au rôle **viewer** dans le namespace `YOURCITY-user-ns`.

2. Appliquez ce role binding :

   ```bash
   oc apply -f rolebinding-local.yaml -n YOURCITY-user-ns
   ```

3. Vérifiez le role binding :

   ```bash
   oc describe rolebinding viewer-binding -n YOURCITY-user-ns
   ```


## **Étape 3 : Créer un Rôle de Cluster**

1. Créez un fichier `role-cluster.yaml` pour définir un rôle de cluster qui permet de lister tous les projets du cluster :

   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRole
   metadata:
     name: project-lister
   rules:
   - apiGroups: [""]
     resources: ["namespaces"]
     verbs: ["list"]
   ```

   **Explication** :
   - Le rôle **project-lister** permet de **lister** les namespaces (projets) dans le cluster.

2. Appliquez ce rôle de cluster :

   ```bash
   oc apply -f role-cluster.yaml
   ```

3. Vérifiez que le rôle a bien été créé :

   ```bash
   oc describe clusterrole project-lister
   ```


## **Étape 4 : Créer un Cluster Role Binding**

1. Créez un fichier `clusterrolebinding.yaml` pour associer un utilisateur à ce rôle de cluster :

   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     name: project-lister-binding
   subjects:
   - kind: User
     name: user2
     apiGroup: rbac.authorization.k8s.io
   roleRef:
     kind: ClusterRole
     name: project-lister
     apiGroup: rbac.authorization.k8s.io
   ```

   **Explication** :
   - Ce cluster role binding lie l'utilisateur `user2` au rôle **project-lister** au niveau du cluster.

2. Appliquez ce cluster role binding :

   ```bash
   oc apply -f clusterrolebinding.yaml
   ```

3. Vérifiez le cluster role binding :

   ```bash
   oc describe clusterrolebinding project-lister-binding
   ```


## **Étape 5 : Tester les Autorisations d'un Utilisateur**

1. Connectez-vous avec l'utilisateur `user1` pour tester l'accès au projet `YOURCITY-user-ns` :

   ```bash
   oc login -u user1
   ```

2. Essayez de lister les pods dans le projet `YOURCITY-user-ns` :

   ```bash
   oc get pods -n YOURCITY-user-ns
   ```

   **Ce que vous devriez voir** :  
   - L'utilisateur **user1** devrait pouvoir lister les pods, car il a le rôle **viewer**.

3. Connectez-vous avec l'utilisateur `user2` pour tester l'accès au cluster :

   ```bash
   oc login -u user2
   ```

4. Essayez de lister les namespaces du cluster :

   ```bash
   oc get namespaces
   ```

   **Ce que vous devriez voir** :  
   - L'utilisateur **user2** devrait pouvoir lister les namespaces, car il a le rôle **project-lister**.


## **Étape 6 : Analyser les Autorisations**

1. Pour vérifier les rôles et role bindings d'un utilisateur, utilisez la commande suivante pour **user1** :

   ```bash
   oc describe rolebinding viewer-binding -n YOURCITY-user-ns
   ```

2. Pour vérifier les rôles et cluster role bindings d'un utilisateur, utilisez la commande suivante pour **user2** :

   ```bash
   oc describe clusterrolebinding project-lister-binding
   ```

## **Étape 7 : Nettoyer l'Environnement**

Pour supprimer les ressources créées :

```bash
oc delete role viewer -n YOURCITY-user-ns
oc delete rolebinding viewer-binding -n YOURCITY-user-ns
oc delete clusterrole project-lister
oc delete clusterrolebinding project-lister-binding
```

## **Conclusion**

Dans cet exercice, vous avez appris à :

1. Créer des rôles locaux et des rôles de cluster dans OpenShift.
2. Associer des utilisateurs à ces rôles à l’aide des **role bindings** et **cluster role bindings**.
3. Tester les autorisations d’un utilisateur pour vérifier l’accès aux ressources.
4. Analyser les rôles et **role bindings** appliqués à un utilisateur.

**Astuce** : Lors de la gestion des accès, assurez-vous d'appliquer le principe du moindre privilège en attribuant uniquement les rôles nécessaires pour chaque utilisateur ou groupe.