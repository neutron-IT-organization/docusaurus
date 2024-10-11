# Déploiement Automatique avec les ImageStreams dans OpenShift

Le déploiement automatique avec les ImageStreams dans OpenShift permet de simplifier la gestion des versions et des mises à jour des applications. En utilisant les ImageStreams, OpenShift peut surveiller les modifications des images de conteneur et déclencher automatiquement des déploiements lorsque de nouvelles versions d'images sont disponibles.

## Objectifs de cette Section

- Comprendre ce qu'est un ImageStream.
- Apprendre à créer et gérer des ImageStreams.
- Configurer des déploiements automatiques basés sur les mises à jour des ImageStreams.

## Qu'est-ce qu'un ImageStream ?

Un ImageStream est une abstraction dans OpenShift qui permet de gérer et de suivre les versions des images de conteneur. Au lieu de référencer directement les images de conteneur par leur nom et leur balise, vous pouvez utiliser un ImageStream pour obtenir un niveau d'indirection et de flexibilité. Cela permet de :

- Surveiller les modifications d'images.
- Déclencher automatiquement des déploiements lorsque de nouvelles versions d'images sont disponibles.
- Gérer les versions d'images de manière centralisée.

## Création d'un ImageStream

Pour créer un ImageStream, vous pouvez utiliser un fichier YAML ou la ligne de commande OpenShift. Voici un exemple de fichier YAML pour créer un ImageStream :

```yaml
apiVersion: image.openshift.io/v1
kind: ImageStream
metadata:
  name: my-app
  namespace: my-namespace
```

Pour créer cet ImageStream, utilisez la commande suivante :

```bash
oc apply -f imagestream.yaml
```

Vous pouvez également créer un ImageStream directement via la ligne de commande :

```bash
oc create imagestream my-app
```

## Gestion des ImageStreams

Une fois l'ImageStream créé, vous pouvez configurer des déclencheurs de déploiement automatique. Un déclencheur de déploiement surveille les mises à jour de l'ImageStream et déclenche un nouveau déploiement lorsque l'image est mise à jour.

### Exemple de Déploiement avec Déclencheur Automatique

Voici un exemple de fichier de déploiement YAML avec un déclencheur de déploiement automatique basé sur un ImageStream :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: my-namespace
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
        image: image-registry.openshift-image-registry.svc:5000/my-namespace/my-app:latest
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

Dans cet exemple, le déclencheur de type `ImageChange` est configuré pour surveiller les modifications de l'ImageStreamTag `my-app:latest`. Lorsque cette balise est mise à jour, un nouveau déploiement est automatiquement déclenché.

### Appliquer le Déploiement

Pour appliquer ce déploiement, utilisez la commande suivante :

```bash
oc apply -f deployment.yaml
```

## Mettre à Jour l'ImageStream

Lorsque vous poussez une nouvelle version de l'image de votre application vers le registre d'images, l'ImageStream est automatiquement mis à jour, et le déclencheur de déploiement se déclenche.

### Exemple de Mise à Jour de l'Image

Supposons que vous avez une nouvelle version de l'image `my-app:v2.0`. Pour pousser cette image vers le registre et mettre à jour l'ImageStream, utilisez les commandes suivantes :

```bash
docker build -t my-registry.example.com/my-namespace/my-app:v2.0 .
docker push my-registry.example.com/my-namespace/my-app:v2.0
oc tag my-namespace/my-app:v2.0 my-namespace/my-app:latest
```

La dernière commande met à jour l'ImageStreamTag `my-app:latest` pour pointer vers la nouvelle image `v2.0`, ce qui déclenche automatiquement un nouveau déploiement.

## Vérification du Déploiement Automatique

Après avoir mis à jour l'ImageStream, vérifiez que le déploiement automatique s'est bien déroulé :

1. **Obtenez la liste des déploiements** pour vérifier l'état :

   ```bash
   oc get deployments
   ```

2. **Consultez les journaux** des nouveaux pods pour vous assurer qu'ils fonctionnent correctement :

   ```bash
   oc logs <pod-name>
   ```

3. **Accédez à l'application** via son URL (si applicable) pour vérifier qu'elle fonctionne correctement avec la nouvelle version de l'image.

## Conclusion

Le déploiement automatique avec les ImageStreams dans OpenShift permet de simplifier la gestion des versions et des mises à jour des applications. En configurant des déclencheurs de déploiement basés sur les ImageStreams, vous pouvez assurer que vos applications sont toujours à jour avec les dernières versions d'images disponibles.