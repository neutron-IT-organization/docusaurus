Voici un exercice guidé sur le thème des sondes d’intégrité dans OpenShift, suivant la structure que vous avez fournie.

---

# Exercice Guidé : Configuration des Sondes d’Intégrité dans OpenShift

Cet exercice vous montrera comment configurer des sondes d’intégrité dans OpenShift pour garantir que votre application reste opérationnelle et accessible.

## Objectif de la Section

Configurer des sondes Liveness et Readiness pour un déploiement d’application dans OpenShift afin d’automatiser la gestion de l’état de l’application.

## Prérequis

Déployez une application simple avec une route d’intégrité. Utilisez le manifest suivant, nommé `health-check-app.yaml` :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: health-check-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: health-check-app
  template:
    metadata:
      labels:
        app: health-check-app
    spec:
      containers:
        - name: httpd
          image: httpd:2.4
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: health-check-app
spec:
  selector:
    app: health-check-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
---
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: health-check-app
spec:
  to:
    kind: Service
    name: health-check-app
  port:
    targetPort: 8080
```

**Appliquez ce déploiement avec la commande suivante :**

```bash
oc apply -f health-check-app.yaml
```

## Étapes

### Étape 1 : Vérifier l'État de l'Application

1. **Vérifiez que le déploiement est actif :**

   Utilisez la commande suivante pour lister les déploiements et vérifier que votre application fonctionne :

   ```bash
   oc get deployments
   ```

   Vous devriez voir `health-check-app` avec un nombre de réplicas disponibles.

2. **Vérifiez l'état des pods :**

   Exécutez cette commande pour voir l'état des pods de l'application :

   ```bash
   oc get pods
   ```

   Vous devriez avoir un pod en cours d'exécution pour `health-check-app`.

### Étape 2 : Tester la Route d'Intégrité

1. **Récupérez l'URL de la Route :**

   Récupérez l'URL de la route créée pour accéder à votre application :

   ```bash
   oc get route health-check-app -o jsonpath='{.spec.host}'
   ```

   Notez cette URL, car elle sera utilisée pour tester la route d'intégrité.

2. **Tester la route d'intégrité :**

   Exécutez la commande suivante pour vérifier que la route `/health` répond correctement :

   ```bash
   curl http://<URL-de-la-route>/health
   ```

   Remplacez `<URL-de-la-route>` par l'URL récupérée. Vous devriez recevoir une réponse positive.

### Étape 3 : Observer le Comportement des Sondes

1. **Modifier le Conteneur pour Simuler un Échec :**

   Connectez-vous au pod et modifiez le fichier de configuration pour que l'application retourne une erreur. Par exemple, vous pouvez créer un fichier vide à la place du script `/health` :

   ```bash
   oc rsh <nom-du-pod>
   echo "" > /usr/local/apache2/htdocs/health
   exit
   ```

2. **Surveiller le Comportement des Sondes :**

   Après quelques secondes, utilisez cette commande pour voir l’état des pods :

   ```bash
   oc get pods -l app=health-check-app --watch
   ```

   Vous devriez voir que le pod a été redémarré à cause de l’échec de la sonde Liveness.

### Étape 4 : Réparer et Restaurer l'Application

1. **Restaurer le Fichier de Route d'Intégrité :**

   Revenez à votre pod et restaurez le fichier pour que la route `/health` réponde correctement :

   ```bash
   oc rsh <nom-du-pod>
   echo "Healthy" > /usr/local/apache2/htdocs/health
   exit
   ```

2. **Vérifier à Nouveau l'État :**

   Attendez quelques instants puis vérifiez à nouveau l’état des pods pour confirmer que le pod est opérationnel :

   ```bash
   oc get pods -l app=health-check-app
   ```

   Vous devriez voir que le pod est de nouveau en cours d'exécution.

### Étape 5 : Nettoyage des Ressources

Une fois que vous avez terminé l'exercice et que vous souhaitez libérer les ressources du cluster, exécutez les commandes suivantes pour supprimer les objets créés :

```bash
oc delete deployment health-check-app
oc delete service health-check-app
oc delete route health-check-app
```

## Observations

- **Échec et redémarrage automatique** : Lorsque le pod échoue à répondre à la sonde Liveness, Kubernetes redémarre automatiquement le pod, garantissant ainsi la disponibilité de l'application.
- **Préparation à recevoir du trafic** : La sonde Readiness assure que le pod est prêt à recevoir du trafic avant d’être réintégré au service, ce qui améliore l’expérience utilisateur.

---

Cet exercice vous permet de configurer et de tester des sondes d’intégrité pour une application simple dans OpenShift, tout en observant comment elles influent sur le comportement et la résilience de l’application.
