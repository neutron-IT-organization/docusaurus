# Exercice Guidé : Mise à Jour Automatique avec les Triggers Kubernetes

Dans cet exercice guidé, nous allons mettre en pratique les concepts appris dans la section précédente en configurant des triggers pour automatiser les mises à jour de notre application déployée sur Kubernetes.

## Objectifs de l'Exercice

- Configurer des `ImageChangeTrigger` et `ConfigChangeTrigger` pour un déploiement.
- Déclencher automatiquement des mises à jour en réponse à des changements d'images de conteneur et de configurations.
- Valider les mises à jour automatiques en vérifiant l'état du déploiement et des pods.

## Pré-requis

- Un cluster OpenShift/Kubernetes fonctionnel.
- `oc` CLI configuré pour accéder à votre cluster.
- Docker installé et configuré pour pousser des images vers votre registre.

## Étapes de l'Exercice

### 1. Créer un Projet

Créez un nouveau projet pour cet exercice :

```bash
oc new-project demo-triggers-exercise
```

### 2. Créer un Déploiement avec un ImageChangeTrigger

Créez un fichier YAML pour le déploiement nommé `deployment-with-trigger.yaml` :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment
  namespace: demo-triggers-exercise
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
      - name: my-app-container
        image: image-registry.openshift-image-registry.svc:5000/demo-triggers-exercise/my-app:latest
        ports:
        - containerPort: 8080
  triggers:
  - type: ImageChange
    imageChangeParams:
      automatic: true
      containerNames:
      - my-app-container
      from:
        kind: ImageStreamTag
        name: my-app:latest
```

Appliquez ce fichier pour créer le déploiement :

```bash
oc apply -f deployment-with-trigger.yaml
```

### 3. Créer un ImageStream

Créez un fichier YAML pour l'ImageStream nommé `imagestream.yaml` :

```yaml
apiVersion: image.openshift.io/v1
kind: ImageStream
metadata:
  name: my-app
  namespace: demo-triggers-exercise
```

Appliquez ce fichier pour créer l'ImageStream :

```bash
oc apply -f imagestream.yaml
```

### 4. Pousser une Image Initiale

Construisez et poussez une image initiale vers votre registre d'images Docker :

```bash
docker build -t my-registry.example.com/demo-triggers-exercise/my-app:v1.0 .
docker push my-registry.example.com/demo-triggers-exercise/my-app:v1.0
```

Mettez à jour l'ImageStreamTag `latest` pour pointer vers cette image :

```bash
oc tag demo-triggers-exercise/my-app:v1.0 demo-triggers-exercise/my-app:latest
```

### 5. Vérifier le Déploiement

Vérifiez que le déploiement a été déclenché automatiquement :

```bash
oc get deployments
oc get pods
```

Obtenez les journaux des pods pour vous assurer qu'ils fonctionnent correctement :

```bash
oc logs <pod-name>
```

### 6. Mettre à Jour l'Image

Construisez et poussez une nouvelle version de l'image :

```bash
docker build -t my-registry.example.com/demo-triggers-exercise/my-app:v2.0 .
docker push my-registry.example.com/demo-triggers-exercise/my-app:v2.0
```

Mettez à jour l'ImageStreamTag `latest` pour pointer vers la nouvelle image :

```bash
oc tag demo-triggers-exercise/my-app:v2.0 demo-triggers-exercise/my-app:latest
```

### 7. Observer le Déploiement Automatique

Vérifiez que le déploiement automatique a été déclenché suite à la mise à jour de l'ImageStream :

```bash
oc get deployments
oc get pods
```

Obtenez les journaux des nouveaux pods pour vous assurer qu'ils fonctionnent correctement :

```bash
oc logs <new-pod-name>
```

### 8. Configurer un ConfigChangeTrigger

Modifiez le fichier de déploiement pour ajouter un trigger de changement de configuration :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment
  namespace: demo-triggers-exercise
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
      - name: my-app-container
        image: image-registry.openshift-image-registry.svc:5000/demo-triggers-exercise/my-app:latest
        ports:
        - containerPort: 8080
  triggers:
  - type: ImageChange
    imageChangeParams:
      automatic: true
      containerNames:
      - my-app-container
      from:
        kind: ImageStreamTag
        name: my-app:latest
  - type: ConfigChange
```

Appliquez ce fichier pour mettre à jour le déploiement :

```bash
oc apply -f deployment-with-trigger.yaml
```

### 9. Modifier la Configuration

Modifiez la configuration de l'application pour voir le déclenchement du déploiement :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment
  namespace: demo-triggers-exercise
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
      - name: my-app-container
        image: image-registry.openshift-image-registry.svc:5000/demo-triggers-exercise/my-app:latest
        ports:
        - containerPort: 8080
        env:
        - name: NEW_ENV_VAR
          value: "new-value"
  triggers:
  - type: ImageChange
    imageChangeParams:
      automatic: true
      containerNames:
      - my-app-container
      from:
        kind: ImageStreamTag
        name: my-app:latest
  - type: ConfigChange
```

Appliquez cette modification :

```bash
oc apply -f deployment-with-trigger.yaml
```

### 10. Observer la Mise à Jour

Vérifiez que le déploiement a été déclenché suite à la modification de configuration :

```bash
oc get deployments
oc get pods
```

Obtenez les journaux des nouveaux pods pour vous assurer qu'ils fonctionnent correctement :

```bash
oc logs <new-pod-name>
```

### 11. Nettoyage

Pour nettoyer les ressources créées durant cet exercice :

```bash
oc delete project demo-triggers-exercise
```

## Conclusion

Dans cet exercice, vous avez configuré et testé des triggers Kubernetes pour automatiser les mises à jour des déploiements. Vous avez appris à utiliser les `ImageChangeTrigger` et `ConfigChangeTrigger` pour déclencher des déploiements en réponse à des événements spécifiques, tels que des changements d'images de conteneur et des modifications de configuration. Cette automatisation est essentielle pour maintenir les applications à jour de manière efficace et rapide dans des environnements de production dynamiques.