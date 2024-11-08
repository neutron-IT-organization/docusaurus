# Exercice Guidé : Gestion des Requests, Limites et Quotas dans OpenShift

Cet exercice vous guidera dans la configuration et la gestion des requests, des limites et des quotas pour des pods dans un projet OpenShift. Vous apprendrez à définir ces paramètres et à observer leur impact sur les ressources disponibles dans le cluster.

---

#### Objectifs de l'Exercice

1. **Configurer les requests et les limites** pour des pods dans un projet OpenShift.
2. **Définir un quota de ressources** pour restreindre l’utilisation globale des ressources par le projet.
3. **Observer l’impact des requests et des limites** sur la planification et l'exécution des pods.
4. **Simuler un dépassement de quota** pour voir comment OpenShift limite la création de nouveaux pods.

---

### Pré-requis

- Accès à un cluster OpenShift avec des droits d’administrateur.
- CLI OpenShift (`oc`) installée et connectée à votre cluster.

### Étape 1 : Création d'un Projet

Commencez par créer un nouveau projet dans OpenShift pour isoler vos ressources.

```bash
oc new-project gestion-ressources
```

---

### Étape 2 : Créer un Pod avec Requests et Limites

Dans cette étape, vous allez créer un fichier YAML définissant un pod avec des requests et des limites pour le CPU et la mémoire.

1. Créez un fichier nommé `pod-limite.yaml` et ajoutez-y la configuration suivante :

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: pod-limite-exemple
     labels:
       app: test-limite
   spec:
     containers:
     - name: limite-container
       image: busybox
       command: ["sh", "-c", "while true; do echo Hello OpenShift; sleep 5; done"]
       resources:
         requests:
           memory: "128Mi"
           cpu: "250m"
         limits:
           memory: "256Mi"
           cpu: "500m"
   ```

   Dans ce fichier :
   - **Request de mémoire** : 128 Mi
   - **Limite de mémoire** : 256 Mi
   - **Request de CPU** : 250 m (soit 0.25 CPU)
   - **Limite de CPU** : 500 m (soit 0.5 CPU)

2. Déployez le pod dans le projet `gestion-ressources` :

   ```bash
   oc apply -f pod-limite.yaml -n gestion-ressources
   ```

3. Vérifiez que le pod a été déployé avec succès :

   ```bash
   oc get pods -n gestion-ressources
   ```

4. Pour consulter les requests et limites appliquées, exécutez la commande suivante :

   ```bash
   oc describe pod pod-limite-exemple -n gestion-ressources
   ```

   Vérifiez les sections **Requests** et **Limits** dans la description du pod pour confirmer la configuration.

---

### Étape 3 : Créer un Quota de Ressources pour le Projet

Maintenant que nous avons configuré les requests et les limites pour un pod, ajoutons un quota de ressources pour limiter la consommation globale des ressources dans le projet.

1. Créez un fichier nommé `quota.yaml` avec la configuration suivante :

   ```yaml
   apiVersion: v1
   kind: ResourceQuota
   metadata:
     name: quota-cpu-memoire
     namespace: gestion-ressources
   spec:
     hard:
       requests.cpu: "1"           # Limite totale de requests CPU à 1 CPU
       requests.memory: "512Mi"     # Limite totale de requests mémoire à 512 Mi
       limits.cpu: "2"              # Limite totale de CPU pour le projet
       limits.memory: "1Gi"         # Limite totale de mémoire pour le projet
   ```

   Ce quota limite :
   - La demande totale de CPU à **1 CPU**.
   - La demande totale de mémoire à **512 Mi**.
   - La limite totale de CPU à **2 CPU**.
   - La limite totale de mémoire à **1 Gi**.

2. Appliquez le quota au projet `gestion-ressources` :

   ```bash
   oc apply -f quota.yaml -n gestion-ressources
   ```

3. Vérifiez que le quota a été configuré :

   ```bash
   oc describe resourcequota quota-cpu-memoire -n gestion-ressources
   ```

---

### Étape 4 : Test de la Limite de Quota

Nous allons maintenant tester les effets du quota en essayant de déployer plusieurs pods avec des requests et des limites de ressources proches de la limite définie.

1. Créez un fichier `pod-multiple.yaml` avec la configuration suivante pour déployer un pod similaire au précédent mais nommé différemment :

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: pod-limite-exemple-2
     labels:
       app: test-limite
   spec:
     containers:
     - name: limite-container
       image: busybox
       command: ["sh", "-c", "while true; do echo Hello OpenShift; sleep 5; done"]
       resources:
         requests:
           memory: "256Mi"
           cpu: "500m"
         limits:
           memory: "512Mi"
           cpu: "1"
   ```

2. Essayez de déployer ce pod dans le même projet :

   ```bash
   oc apply -f pod-multiple.yaml -n gestion-ressources
   ```

   Cette configuration dépassera le quota de requests de CPU et de mémoire, car le premier pod consomme déjà des ressources proches des limites.

3. Vérifiez que le pod n'a pas pu être déployé en raison du quota. Pour cela, exécutez :

   ```bash
   oc get events -n gestion-ressources
   ```

   Dans les événements, vous devriez voir une erreur indiquant que le quota de ressources a été dépassé.

---

### Étape 5 : Analyse des Consommations de Ressources

OpenShift permet de surveiller l’utilisation des ressources et d’ajuster les configurations si nécessaire.

1. Pour consulter l'état actuel de l'utilisation des ressources par rapport au quota, exécutez :

   ```bash
   oc describe quota quota-cpu-memoire -n gestion-ressources
   ```

   Cette commande affiche l’état de chaque request et limite, ainsi que l’utilisation actuelle des ressources dans le projet.

2. Pour vérifier l’utilisation de chaque pod, vous pouvez également utiliser :

   ```bash
   oc adm top pod -n gestion-ressources
   ```

   **Note** : La commande `oc adm top` nécessite l’outil `metrics-server` dans le cluster pour fournir des données de consommation en temps réel.

---

### Étape 6 : Nettoyage de l'Environnement

Une fois l’exercice terminé, vous pouvez supprimer les ressources créées pour libérer les ressources du cluster.

```bash
oc delete pod pod-limite-exemple -n gestion-ressources
oc delete pod pod-limite-exemple-2 -n gestion-ressources
oc delete resourcequota quota-cpu-memoire -n gestion-ressources
oc delete project gestion-ressources
```

---

### Conclusion

Dans cet exercice, vous avez appris à configurer des requests, des limites et des quotas de ressources dans OpenShift. Vous avez également vu comment OpenShift applique ces limites pour contrôler la planification et l’utilisation des ressources dans un projet. Ces concepts sont cruciaux pour optimiser l’utilisation des ressources dans un environnement OpenShift partagé, garantissant ainsi un environnement de production stable et équilibré.