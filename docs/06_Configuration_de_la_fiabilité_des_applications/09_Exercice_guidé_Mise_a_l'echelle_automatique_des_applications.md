D'accord, voici une version épurée de l'exercice, sans les parties 5 et 6, mais avec un développement plus détaillé des autres étapes pour une meilleure compréhension et un déroulement plus fluide.

---

# Exercice Guidé : Mise à l’échelle automatique des applications dans OpenShift

Cet exercice vous montre comment configurer la mise à l’échelle automatique pour une application déployée dans OpenShift à l'aide de l'**HorizontalPodAutoscaler (HPA)**.

## Objectif de la Section

Configurer un **HorizontalPodAutoscaler (HPA)** pour ajuster dynamiquement le nombre de réplicas d'une application en fonction de l'utilisation du CPU et observer son comportement sous différentes charges.

## Prérequis

Déployez une application de simulation de charge CPU à l’aide du manifest suivant, nommé `cpu-load-app.yaml` :

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
---
apiVersion: v1
kind: Service
metadata:
  name: cpu-load-app
spec:
  selector:
    app: cpu-load-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
---
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: cpu-load-app
spec:
  to:
    kind: Service
    name: cpu-load-app
  port:
    targetPort: 80
  tls:
    termination: edge
```

**Appliquez ce déploiement avec la commande suivante :**

```bash
oc apply -f cpu-load-app.yaml
```

## Étapes

### Étape 1 : Créer un HPA pour Ajuster Dynamiquement les Réplicas

Utilisez la commande suivante pour créer un **HorizontalPodAutoscaler (HPA)** qui ajuste le nombre de réplicas entre 1 et 10 pods, en maintenant une utilisation de CPU à 50 % :

```bash
oc autoscale deployment/cpu-load-app --min 1 --max 10 --cpu-percent 50
```

### Étape 2 : Observer le Comportement du HPA

1. **Vérifier l'état du HPA :**

   Utilisez la commande suivante pour afficher les HPA présents et vérifier les détails :

   ```bash
   oc get hpa
   ```

   Vous verrez une sortie qui montre le nom du HPA, le seuil de CPU, le nombre de réplicas actuels et la cible d'utilisation de CPU.

2. **Analyser le comportement du HPA :**

   Le HPA ajuste automatiquement le nombre de réplicas de `cpu-load-app` en fonction de l'utilisation de la CPU. Si l'utilisation moyenne du CPU des pods dépasse 50 %, le HPA augmentera le nombre de réplicas pour équilibrer la charge. À l'inverse, si l'utilisation est inférieure à ce seuil, le HPA réduira le nombre de réplicas.

### Étape 3 : Générer une Charge de CPU pour Tester la Mise à l’Échelle

1. **Récupérer l'URL de la Route :**

   Récupérez l'URL de la route créée pour accéder à votre application :

   ```bash
   oc get route cpu-load-app -o jsonpath='{.spec.host}'
   ```

   Notez cette URL, car elle sera utilisée pour simuler la charge.

2. **Simuler une Charge de CPU :**

   Exécutez une boucle de requêtes pour générer une charge sur l'application :

   ```bash
   while true; do curl http://<URL-de-la-route>; done
   ```

   Remplacez `<URL-de-la-route>` par l'URL récupérée à l'étape précédente.

   Cette boucle de requêtes va générer une charge continue sur l'application, ce qui forcera l'utilisation de la CPU à augmenter.

### Étape 4 : Observer la Montée en Charge des Pods

1. **Surveiller les Pods :**

   Surveillez le comportement des pods pour voir comment l'application réagit à la charge :

   ```bash
   oc get pods -l app=cpu-load-app --watch
   ```

   Cette commande affiche les pods correspondant à l'application `cpu-load-app` et met à jour la liste en temps réel. Vous devriez voir de nouveaux pods apparaître à mesure que l'utilisation de la CPU augmente.

2. **Analyser les résultats :**

   Vous pouvez observer que le nombre de pods augmente au fur et à mesure que la charge augmente. Cela montre que le HPA fonctionne et ajuste automatiquement le nombre de réplicas pour maintenir une utilisation de CPU à 50 %.

### Étape 5 : Nettoyage des Ressources

Une fois que vous avez terminé l'exercice et que vous souhaitez libérer les ressources du cluster, exécutez les commandes suivantes pour supprimer les objets créés :

```bash
oc delete deployment cpu-load-app
oc delete hpa cpu-load-app
oc delete service cpu-load-app
oc delete route cpu-load-app
```

## Observations

- **Mise à l’échelle automatique** : Vous pouvez observer que le HPA ajuste le nombre de pods pour maintenir une utilisation de CPU proche de la cible (50 % dans cet exemple).
- **Réactivité** : La montée en charge peut prendre quelques secondes à quelques minutes en fonction de la capacité de votre cluster à démarrer de nouveaux pods.
- **Impact des modifications** : En ajustant les paramètres de `minReplicas`, `maxReplicas` ou `targetCPUUtilizationPercentage`, vous pouvez influencer la manière dont le HPA répond aux variations de charge.

---

Ce guide vous permet de configurer et de tester un HPA pour une application simple dans OpenShift, tout en observant comment il répond aux changements de charge et comment ajuster ses paramètres pour une meilleure performance.
