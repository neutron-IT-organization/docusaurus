# Exercice Guidé : Mise à l’échelle automatique des applications dans OpenShift

Cet exercice vous guidera à travers la configuration et la gestion de la mise à l’échelle automatique de vos applications déployées dans OpenShift. Vous apprendrez à créer un autoscaler de pod horizontal (HPA) pour adapter dynamiquement les ressources en fonction de la charge, garantissant ainsi une haute disponibilité et une utilisation optimale des ressources.

### Objectifs de l'Exercice

- Comprendre les concepts de base de la mise à l'échelle automatique dans Kubernetes.
- Configurer un autoscaler de pod horizontal (HPA) pour une application.
- Vérifier le comportement de la mise à l'échelle en fonction de la charge de l'application.
- Ajuster les paramètres de l'HPA pour optimiser la performance et la résilience de l'application.

## Prérequis

Pour cet exercice, vous allez déployer une application simple qui simule une charge de CPU. Vous utiliserez un déploiement de `php-apache` qui génère une charge sur le processeur pour tester la mise à l’échelle automatique. Créez un fichier nommé `cpu-load-app.yaml` avec le contenu suivant :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpu-load-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cpu-load-app
  template:
    metadata:
      labels:
        app: cpu-load-app
    spec:
      containers:
        - name: php-apache
          image: k8s.gcr.io/hpa-example
          resources:
            requests:
              cpu: 200m
          ports:
            - containerPort: 80
```

**Appliquez ce déploiement avec la commande suivante :**

```bash
oc apply -f cpu-load-app.yaml
```

## Étape 1 : Comprendre la mise à l’échelle automatique

1. **Objectif :** Comprendre les principes de base de l’HorizontalPodAutoscaler (HPA) et de son fonctionnement en boucle.

2. **Résumé :** L’HPA ajuste automatiquement le nombre de réplicas d’un déploiement en fonction des ressources utilisées par les pods, comme le CPU ou la mémoire. L’HPA collecte les métriques de performance toutes les 15 secondes et ajuste le nombre de pods pour maintenir un niveau de charge optimal.

## Étape 2 : Créer une ressource de mise à l’échelle automatique de pod horizontale (HPA)

1. **Objectif :** Créer un HPA pour ajuster dynamiquement le nombre de réplicas de l'application en fonction de l'utilisation du CPU.

2. **Action :** Utilisez la commande suivante pour créer un HPA qui ajuste les réplicas entre 1 et 10 pods, en essayant de maintenir une utilisation CPU à 50 % :

```bash
oc autoscale deployment/cpu-load-app --min 1 --max 10 --cpu-percent 50
```

3. **Vérification :** Affichez les HPA pour vérifier leur création :

```bash
oc get hpa
```

La sortie devrait inclure des informations sur le HPA créé, indiquant les seuils de CPU et le nombre de réplicas.

## Étape 3 : Générer une charge de CPU pour tester la mise à l’échelle

1. **Objectif :** Simuler une charge de CPU pour observer l'effet de la mise à l'échelle automatique.

2. **Action :** Exécutez un `kubectl` ou `oc` command pour générer une requête en boucle sur le service exposé par l'application :

```bash
while true; do curl http://<route-de-votre-app>; done
```

**Remarque :** Remplacez `<route-de-votre-app>` par l'URL de la route associée à l'application `cpu-load-app`.

3. **Vérification :** Surveillez la montée en charge des pods :

```bash
oc get pods -l app=cpu-load-app --watch
```

Vous devriez voir le nombre de pods augmenter pour répondre à la demande de CPU.

## Étape 4 : Ajuster les paramètres de l’HPA

1. **Objectif :** Modifier les paramètres de l’HPA pour mieux adapter la réponse aux pics de charge.

2. **Action :** Éditez le HPA pour ajuster les seuils de CPU ou le nombre maximal de réplicas :

```bash
oc edit hpa cpu-load-app
```

Modifiez les valeurs de `minReplicas`, `maxReplicas`, ou `targetCPUUtilizationPercentage` pour ajuster la réponse de la mise à l’échelle.

3. **Vérification :** Observez les effets de la modification en répétant la génération de charge et en surveillant la création de pods.

## Étape 5 : Créer un HPA à partir d’un fichier YAML

1. **Objectif :** Créer un HPA à l’aide d’un fichier YAML pour plus de contrôle sur la configuration.

2. **Action :** Créez un fichier nommé `cpu-load-hpa.yaml` avec le contenu suivant :

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: cpu-load-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: cpu-load-app
  minReplicas: 1
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50
```

3. **Commande :** Appliquez le fichier pour créer le HPA :

```bash
oc apply -f cpu-load-hpa.yaml
```

4. **Vérification :** Vérifiez que le HPA est configuré correctement :

```bash
oc get hpa cpu-load-app -o yaml
```

## Étape 6 : Nettoyage

Après avoir terminé les tests, nettoyez les ressources créées pour libérer les ressources du cluster :

```bash
oc delete deployment cpu-load-app
oc delete hpa cpu-load-app
```

## Conclusion

En suivant cet exercice, vous avez appris à configurer et à gérer l'**HorizontalPodAutoscaler (HPA)** dans OpenShift. Vous avez exploré la création d'un HPA via la ligne de commande et les fichiers YAML, testé le comportement de mise à l’échelle dynamique sous différentes charges, et ajusté les paramètres pour une meilleure adaptation à vos besoins. Cela vous permet de garantir que votre application est prête à faire face aux variations de charge tout en optimisant l’utilisation des ressources.
