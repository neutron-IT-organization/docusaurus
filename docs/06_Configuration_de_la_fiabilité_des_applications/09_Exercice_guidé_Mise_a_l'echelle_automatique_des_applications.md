# Exercice Guidé : Mise à l'Échelle Automatique des Applications dans OpenShift

Dans cet exercice, nous allons pratiquer la configuration et la gestion de la mise à l'échelle automatique des applications dans OpenShift. Nous allons définir des règles de mise à l'échelle automatique basées sur l'utilisation des ressources et observer comment OpenShift ajuste automatiquement le nombre de répliques d'une application en fonction de la demande.

## Objectifs de l'Exercice

- Configurer la mise à l'échelle automatique des applications dans OpenShift en utilisant Horizontal Pod Autoscaler (HPA).
- Définir des règles de mise à l'échelle automatique basées sur l'utilisation des ressources.
- Observer comment OpenShift ajuste automatiquement le nombre de répliques d'une application en fonction de la charge de travail.

## Instructions

### 1. Configuration de la Mise à l'Échelle Automatique

1. **Définir les règles de mise à l'échelle automatique** : Modifiez le fichier de spécification YAML de votre application pour inclure les règles de mise à l'échelle automatique. Utilisez les champs `spec.autoscaler.minReplicas`, `spec.autoscaler.maxReplicas` et `spec.autoscaler.targetCPUUtilizationPercentage` pour définir le nombre minimum et maximum de répliques et le niveau d'utilisation cible des ressources CPU pour lequel vous souhaitez ajuster automatiquement le nombre de répliques. Par exemple :

   ```yaml
   apiVersion: autoscaling/v1
   kind: HorizontalPodAutoscaler
   metadata:
     name: my-hpa
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: my-deployment
     minReplicas: 2
     maxReplicas: 10
     targetCPUUtilizationPercentage: 50
   ```

2. **Appliquer les modifications** au HPA en utilisant la commande `oc apply`.

### 2. Observation de la Mise à l'Échelle Automatique

1. **Surveiller l'état du HPA** en utilisant la commande :

   ```bash
   oc get hpa
   ```

   Vérifiez que le HPA est actif et qu'il surveille l'utilisation des ressources de votre application.

2. **Simuler une augmentation de la charge de travail** sur votre application en exécutant des opérations intensives ou en générant du trafic.

3. **Observer l'ajustement automatique du nombre de répliques** de votre application en fonction de la demande. Vous pouvez utiliser la commande `oc get pods` pour surveiller le nombre de répliques en cours d'exécution.

## Conclusion

Cet exercice vous a permis de pratiquer la configuration et la gestion de la mise à l'échelle automatique des applications dans OpenShift en utilisant Horizontal Pod Autoscaler (HPA). En définissant des règles basées sur l'utilisation des ressources, vous avez pu observer comment OpenShift ajuste automatiquement le nombre de répliques d'une application en fonction de la charge de travail, garantissant ainsi des performances optimales et une disponibilité continue de l'application.

Dans la prochaine section, nous explorerons d'autres aspects de la gestion des ressources dans OpenShift.