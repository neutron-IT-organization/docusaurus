# Exercice Guidé : Déploiement Automatique avec les ImageStreams dans OpenShift

Dans cet exercice guidé, nous allons apprendre à configurer et utiliser les ImageStreams pour déployer automatiquement des applications dans OpenShift lorsque de nouvelles versions d'images sont disponibles.

## Objectifs de l'Exercice

- Créer un ImageStream.
- Configurer un déploiement automatique basé sur un ImageStream.
- Mettre à jour l'ImageStream et observer le déploiement automatique.

## Prérequis

- Accès à un cluster OpenShift.
- OpenShift CLI (`oc`) installé et configuré.
- Un registre d'images Docker pour stocker les images de conteneur.

## Étapes de l'Exercice

### 1. Créer un Projet

Créez un nouveau projet pour cet exercice :

```bash
oc new-project demo-imagestream
```

### 2. Créer un ImageStream

Créez un fichier YAML pour l'ImageStream nommé `imagestream.yaml` :

```yaml
apiVersion: image.openshift.io/v1
kind: ImageStream
metadata:
  name: my-app
  namespace: demo-imagestream
```

Appliquez ce fichier pour créer l'ImageStream :

```bash
oc apply -f imagestream.yaml
```

### 3. Créer une Définition de Déploiement

Créez un fichier YAML pour le déploiement nommé `deployment.yaml` :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-deployment
  namespace: demo-imagestream
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
        image: image-registry.openshift-image-registry.svc:5000/demo-imagestream/my-app:latest
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
oc apply -f deployment.yaml
```

### 4. Pousser une Image Initiale

Construisez et poussez une image initiale vers votre registre d'images Docker :

```bash
docker build -t my-registry.example.com/demo-imagestream/my-app:v1.0 .
docker push my-registry.example.com/demo-imagestream/my-app:v1.0
```

Mettez à jour l'ImageStreamTag `latest` pour pointer vers cette image :

```bash
oc tag demo-imagestream/my-app:v1.0 demo-imagestream/my-app:latest
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
docker build -t my-registry.example.com/demo-imagestream/my-app:v2.0 .
docker push my-registry.example.com/demo-imagestream/my-app:v2.0
```

Mettez à jour l'ImageStreamTag `latest` pour pointer vers la nouvelle image :

```bash
oc tag demo-imagestream/my-app:v2.0 demo-imagestream/my-app:latest
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

### 8. Nettoyage

Pour nettoyer les ressources créées durant cet exercice :

```bash
oc delete project demo-imagestream
```

## Conclusion

Vous avez appris à configurer des déploiements automatiques dans OpenShift en utilisant les ImageStreams. En suivant cet exercice guidé, vous devriez maintenant être capable de créer, gérer et mettre à jour des déploiements basés sur des modifications d'images de conteneur. Cette fonctionnalité est cruciale pour maintenir des environnements de production à jour de manière automatisée et fiable.