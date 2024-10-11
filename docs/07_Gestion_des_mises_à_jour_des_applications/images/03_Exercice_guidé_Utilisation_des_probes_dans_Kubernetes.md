# Exercice Guidé : Gestion des Probes dans Kubernetes

Dans cet exercice, nous allons pratiquer la configuration et la gestion des probes dans Kubernetes. Nous explorerons comment définir et ajuster les probes de démarrage, de vérification et de liveness pour surveiller la santé des conteneurs et assurer la disponibilité des applications.

## Objectifs de l'Exercice

- Configurer les probes de démarrage, de vérification et de liveness dans un déploiement Kubernetes.
- Tester les probes en simulant des scénarios de défaillance et en observant les réactions du système.
- Ajuster les paramètres des probes pour optimiser la surveillance et la réactivité.

## Instructions

### 1. Déploiement d'une Application avec des Probes

1. **Créez un fichier de spécification de déploiement YAML** pour votre application, en incluant les sections `livenessProbe`, `readinessProbe` et `startupProbe` avec des paramètres appropriés.

2. **Déployez l'application** en utilisant le fichier de spécification YAML :

   ```bash
   kubectl apply -f deployment.yaml
   ```

### 2. Test des Probes

1. **Vérifiez l'état des probes** pour votre déploiement :

   ```bash
   kubectl describe deployment <nom-du-deploiement>
   ```

   Assurez-vous que les probes sont configurées correctement et qu'il n'y a pas d'échecs signalés.

2. **Simulez une défaillance** en introduisant un problème dans votre application (par exemple, en provoquant une erreur 500 dans une URL) ou en arrêtant un processus vital.

3. **Observez le comportement du système** pour voir comment Kubernetes réagit à la défaillance. Vérifiez les logs des pods et observez si des redémarrages sont déclenchés en raison d'échecs de probes.

### 3. Ajustement des Paramètres des Probes

1. **Modifiez les paramètres des probes** dans votre fichier de spécification de déploiement YAML pour ajuster les délais d'attente, les seuils d'échec ou d'autres paramètres pertinents.

2. **Appliquez les modifications** au déploiement en utilisant la commande `kubectl apply`.

3. **Re-testez les probes** pour vous assurer que les ajustements ont l'effet souhaité.

## Conclusion

Cet exercice vous a permis de pratiquer la configuration et la gestion des probes dans Kubernetes. En utilisant les commandes `kubectl` et en modifiant les fichiers de spécification YAML, vous avez pu définir et ajuster les probes de démarrage, de vérification et de liveness pour surveiller la santé des conteneurs de votre application. En comprenant comment les probes fonctionnent et en les configurant correctement, vous pouvez garantir que vos applications sont fiables et disponibles, même en cas de problèmes potentiels.