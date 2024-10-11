# Mise à Jour Automatique avec les Triggers Kubernetes

Dans cette section, nous allons explorer comment configurer et utiliser les triggers Kubernetes pour effectuer des mises à jour automatiques des applications déployées. Les triggers permettent d'automatiser des actions spécifiques en réponse à des événements tels que des changements d'images de conteneur ou des modifications de configuration.

## Objectifs

- Comprendre les différents types de triggers dans Kubernetes.
- Configurer des triggers pour les déploiements.
- Automatiser les mises à jour des applications en réponse à des événements spécifiques.

## Types de Triggers dans Kubernetes

Kubernetes propose plusieurs types de triggers pour automatiser les mises à jour :

1. **ImageChangeTrigger** : Déclenche une mise à jour lorsque l'image d'un conteneur est mise à jour.
2. **ConfigChangeTrigger** : Déclenche une mise à jour lorsque la configuration d'une application change.

## Étapes de Configuration des Triggers

### 1. Créer un Projet

Créez un nouveau projet pour cet exercice :

```bash
oc new-project demo-triggers
```

### 2. Créer un Déploiement avec un ImageChangeTrigger

Créez un fichier YAML pour le déploiement nommé `deployment-with-trigger.yaml` :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment
  namespace: demo-triggers
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
        image: image-registry.openshift-image-registry.svc:5000/demo-triggers/my-app:latest
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
  namespace: demo-triggers
```

Appliquez ce fichier pour créer l'ImageStream :

```bash
oc apply -f imagestream.yaml
```

### 4. Pousser une Image Initiale

Construisez et poussez une image initiale vers votre registre d'images Docker :

```bash
docker build -t my-registry.example.com/demo-triggers/my-app:v1.0 .
docker push my-registry.example.com/demo-triggers/my-app:v1.0
```

Mettez à jour l'ImageStreamTag `latest` pour pointer vers cette image :

```bash
oc tag demo-triggers/my-app:v1.0 demo-triggers/my-app:latest
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
docker build -t my-registry.example.com/demo-triggers/my-app:v2.0 .
docker push my-registry.example.com/demo-triggers/my-app:v2.0
```

Mettez à jour l'ImageStreamTag `latest` pour pointer vers la nouvelle image :

```bash
oc tag demo-triggers/my-app:v2.0 demo-triggers/my-app:latest
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
  namespace: demo-triggers
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
        image: image-registry.openshift-image-registry.svc:5000/demo-triggers/my-app:latest
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
  namespace: demo-triggers
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
        image: image-registry.openshift-image-registry.svc:5000/demo-triggers/my-app:latest
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
oc delete project demo-triggers
```

## Conclusion

Dans cette section, vous avez appris à configurer des triggers dans Kubernetes pour automatiser les mises à jour de déploiement. Les triggers permettent de maintenir vos applications à jour de manière automatique, en réponse à des événements tels que des changements d'images ou des modifications de configuration. Cette fonctionnalité est essentielle pour des environnements de production dynamiques où la rapidité et l'efficacité des mises à jour sont cruciales.