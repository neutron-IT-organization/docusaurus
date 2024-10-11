Bien sûr, voici la version mise à jour avec les commandes Linux pour chaque étape de l'exercice :

---

# Exercice Guidée : Gestion de la Haute Disponibilité dans Kubernetes

Dans cet exercice, nous allons pratiquer la mise en œuvre de la haute disponibilité (HA) pour les charges de travail dans Kubernetes. Nous allons explorer différentes stratégies et outils pour garantir que nos applications restent disponibles et fonctionnelles même en cas de défaillance.

## Objectifs de l'Exercice

- Apprendre à utiliser les contrôleurs de réplication et les ensembles de réplicas pour assurer la haute disponibilité.
- Comprendre comment configurer des stratégies de mise à jour sans temps d'arrêt.
- Pratiquer la surveillance et les alertes pour détecter et réagir aux incidents de défaillance.

## Instructions

### 1. Déploiement d'une Application avec Réplication

1. **Déployez une application avec un contrôleur de réplication** en utilisant un fichier de déploiement YAML :
   
   ```bash
   kubectl apply -f deployment.yaml
   ```

   Assurez-vous que le fichier `deployment.yaml` spécifie le nombre de répliques souhaité pour l'application.

2. **Vérifiez que les répliques de l'application sont en cours d'exécution** :
   
   ```bash
   kubectl get pods
   ```

   Assurez-vous que le nombre de pods en cours d'exécution correspond au nombre de répliques spécifié dans le déploiement.

### 2. Configuration des Stratégies de Mise à Jour

1. **Modifiez la stratégie de mise à jour du déploiement** pour utiliser un déploiement progressif (rolling update) :
   
   ```bash
   kubectl edit deployment <nom-du-deploiement>
   ```

   Assurez-vous que la stratégie de mise à jour spécifie les paramètres appropriés pour le déploiement progressif.

2. **Appliquez la nouvelle configuration de déploiement** :
   
   ```bash
   kubectl apply -f deployment.yaml
   ```

### 3. Configuration de la Surveillance et des Alertes

1. **Installez et configurez Prometheus et Grafana** pour surveiller l'état de votre cluster Kubernetes.
   
   ```bash
   helm install prometheus stable/prometheus
   helm install grafana stable/grafana
   ```

2. **Configurez des alertes dans Prometheus** pour détecter les incidents de défaillance potentiels, tels que le nombre élevé de redémarrages de pods ou les erreurs de santé des pods.

3. **Testez les alertes en simulant une défaillance** d'un pod ou d'un nœud dans le cluster, puis observez comment les alertes sont déclenchées dans Prometheus.

## Conclusion

Cet exercice vous a permis de pratiquer la gestion de la haute disponibilité dans Kubernetes en utilisant des contrôleurs de réplication, des stratégies de mise à jour sans temps d'arrêt, et des outils de surveillance et d'alerte. En mettant en œuvre ces pratiques, vous pouvez garantir que vos applications restent disponibles et fonctionnelles même en cas de défaillance des composants sous-jacents.

---

Cet exercice devrait vous donner une bonne expérience pratique dans la gestion de la haute disponibilité dans Kubernetes. Si vous avez des questions supplémentaires ou si vous rencontrez des difficultés lors de cet exercice, n'hésitez pas à demander de l'aide !