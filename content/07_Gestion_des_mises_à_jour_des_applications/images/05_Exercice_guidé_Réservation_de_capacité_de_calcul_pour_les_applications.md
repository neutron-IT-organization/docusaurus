# Exercice Guidé : Réservation de Capacité de Calcul dans Kubernetes

Dans cet exercice, nous allons pratiquer la configuration et la gestion de la réservation de capacité de calcul dans Kubernetes. Nous allons définir des limites minimales sur la quantité de CPU et de mémoire allouée à chaque conteneur d'une application, et observer comment Kubernetes utilise ces réservations pour planifier et gérer les ressources sur le cluster.

## Objectifs de l'Exercice

- Définir des réservations de capacité de calcul pour les conteneurs d'un déploiement Kubernetes.
- Observer comment Kubernetes utilise ces réservations pour planifier les conteneurs sur les nœuds du cluster.
- Vérifier que les réservations de capacité garantissent des performances stables pour l'application, même en cas de charge élevée sur le cluster.

## Instructions

### 1. Définition des Réservations de Capacité

1. **Modifiez le fichier de spécification de déploiement YAML** de votre application pour inclure des réservations de capacité de calcul pour chaque conteneur. Utilisez les champs `resources.requests.cpu` et `resources.requests.memory` pour définir les quantités minimales de CPU et de mémoire requises par chaque conteneur.

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: my-deployment
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: my-app
     template:
       metadata:
         labels:
           app: my-app
       spec:
         containers:
         - name: my-container
           image: my-image:latest
           resources:
             requests:
               cpu: "0.5"  # Réserve 0.5 unité de CPU
               memory: "512Mi"  # Réserve 512 MiB de mémoire
   ```

2. **Appliquez les modifications** au déploiement en utilisant la commande `kubectl apply`.

### 2. Observation de l'Utilisation des Réservations

1. **Surveillez l'état des pods** pour votre déploiement en utilisant la commande :

   ```bash
   kubectl get pods
   ```

   Vérifiez que les pods sont en cours d'exécution et qu'ils ont été planifiés sur les nœuds du cluster en fonction des réservations de capacité définies.

2. **Vérifiez l'utilisation des ressources** sur les nœuds du cluster en utilisant la commande :

   ```bash
   kubectl top nodes
   ```

   Observez comment les réservations de capacité influencent la répartition des ressources sur les nœuds du cluster.

### 3. Test des Performances de l'Application

1. **Démarrez une charge de travail sur l'application** pour simuler une charge élevée sur le cluster. Cela peut être fait en exécutant des requêtes HTTP ou en exécutant des opérations intensives sur l'application.

2. **Surveillez les performances de l'application** en termes de temps de réponse, de latence et de stabilité. Assurez-vous que l'application continue de fonctionner de manière stable, même sous une charge élevée, grâce aux réservations de capacité de calcul.

## Conclusion

Cet exercice vous a permis de pratiquer la configuration et la gestion de la réservation de capacité de calcul dans Kubernetes. En définissant des réservations minimales de CPU et de mémoire pour les conteneurs d'une application, vous avez pu observer comment Kubernetes utilise ces informations pour planifier et gérer efficacement les ressources sur le cluster. En comprenant comment les réservations de capacité fonctionnent et en les ajustant en fonction des besoins de votre application, vous pouvez garantir des performances stables et fiables, même dans des conditions de charge élevée sur le cluster.