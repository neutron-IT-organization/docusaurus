# Exercice Guidé : Limitation de la Capacité de Calcul dans OpenShift

Dans cet exercice, nous allons pratiquer la configuration et la gestion de la limitation de la capacité de calcul dans OpenShift. Nous allons définir des limites maximales sur la quantité de CPU et de mémoire qu'un conteneur peut consommer, et observer comment OpenShift utilise ces limites pour contrôler l'utilisation des ressources sur le cluster.

## Objectifs de l'Exercice

- Définir des limites de capacité de calcul pour les conteneurs d'un déploiement OpenShift.
- Observer comment OpenShift applique ces limites pour contrôler l'utilisation des ressources par les conteneurs.
- Vérifier que les limites de capacité empêchent les conteneurs de consommer excessivement les ressources du cluster.

## Instructions

### 1. Définition des Limites de Capacité

1. **Modifiez le fichier de spécification de déploiement YAML** de votre application pour inclure des limites de capacité de calcul pour chaque conteneur. Utilisez les champs `resources.limits.cpu` et `resources.limits.memory` pour définir les quantités maximales de CPU et de mémoire que chaque conteneur peut utiliser. Par exemple :

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
             limits:
               cpu: "1"  # Limite de 1 unité de CPU
               memory: "1Gi"  # Limite de 1 GiB de mémoire
   ```

2. **Appliquez les modifications** au déploiement en utilisant la commande `oc apply`.

### 2. Observation de l'Utilisation des Limites

1. **Surveillez l'état des pods** pour votre déploiement en utilisant la commande :

   ```bash
   oc get pods
   ```

   Vérifiez que les pods sont en cours d'exécution et que les limites de capacité de calcul sont appliquées aux conteneurs.

2. **Surveillez l'utilisation des ressources** sur le cluster en utilisant la console OpenShift ou en utilisant des outils de surveillance tiers. Observez comment OpenShift contrôle l'utilisation des ressources en fonction des limites de capacité définies.

### 3. Test des Performances de l'Application

1. **Démarrez une charge de travail sur l'application** pour simuler une utilisation intensive des ressources. Cela peut être fait en exécutant des requêtes HTTP ou en exécutant des opérations intensives sur l'application.

2. **Surveillez les performances de l'application** en termes de temps de réponse, de latence et de stabilité. Assurez-vous que l'application continue de fonctionner de manière stable, même lorsque les limites de capacité sont atteintes.

## Conclusion

Cet exercice vous a permis de pratiquer la configuration et la gestion de la limitation de la capacité de calcul dans OpenShift. En définissant des limites maximales sur la quantité de CPU et de mémoire qu'un conteneur peut consommer, vous avez pu observer comment OpenShift contrôle l'utilisation des ressources sur le cluster pour garantir des performances stables et prévisibles pour toutes les charges de travail déployées.

---

Cet exercice devrait vous donner une expérience pratique de la gestion des limites de capacité de calcul dans OpenShift. Si vous avez des questions supplémentaires ou si vous rencontrez des difficultés lors de cet exercice, n'hésitez pas à demander de l'aide !