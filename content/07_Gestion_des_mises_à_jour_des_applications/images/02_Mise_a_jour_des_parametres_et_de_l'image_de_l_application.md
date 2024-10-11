# Mise à Jour des Paramètres et de l'Image de l'Application

La mise à jour des paramètres et de l'image de l'application est une tâche courante dans la gestion des applications conteneurisées. Dans OpenShift, cela implique souvent de mettre à jour la configuration de déploiement pour pointer vers une nouvelle version de l'image ou pour modifier les variables d'environnement et autres paramètres de l'application. Cette section détaille les étapes nécessaires pour effectuer ces mises à jour de manière efficace et sécurisée.

## Objectifs de cette Section

- Comprendre comment mettre à jour l'image d'une application déployée.
- Savoir comment modifier les variables d'environnement et autres paramètres de l'application.
- Apprendre à vérifier que les mises à jour ont été appliquées correctement.

## Mise à Jour de l'Image de l'Application

Mettre à jour l'image de l'application consiste à pointer le déploiement vers une nouvelle version de l'image. Cette opération peut être déclenchée par une modification du fichier de déploiement YAML et l'application de cette mise à jour.

### Étape 1 : Identifier la Nouvelle Version de l'Image

Tout d'abord, déterminez la nouvelle version de l'image que vous souhaitez déployer. Assurez-vous que cette image est disponible dans le registre d'images.

### Étape 2 : Modifier le Fichier de Déploiement

Ouvrez le fichier de déploiement YAML correspondant à votre application et mettez à jour la section `image` avec la nouvelle version. Par exemple, si vous passez de `my-app:v1.0` à `my-app:v2.0` :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
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
        image: my-registry.example.com/my-namespace/my-app:v2.0
        ports:
        - containerPort: 8080
```

### Étape 3 : Appliquer les Modifications

Appliquez les modifications en utilisant la commande `oc apply` :

```bash
oc apply -f deployment.yaml
```

### Étape 4 : Vérifier le Déploiement

Vérifiez que le déploiement a été mis à jour correctement et que les nouveaux pods utilisent la nouvelle image :

```bash
oc get pods
```

Vous pouvez également décrire le déploiement pour vérifier l'image utilisée :

```bash
oc describe deployment my-app
```

## Mise à Jour des Paramètres de l'Application

Les paramètres de l'application, tels que les variables d'environnement, peuvent également être mis à jour via le fichier de déploiement YAML.

### Étape 1 : Modifier les Variables d'Environnement

Ajoutez ou modifiez les variables d'environnement dans la section `env` du conteneur. Par exemple :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
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
        image: my-registry.example.com/my-namespace/my-app:v2.0
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          value: "postgres://user:password@hostname:5432/dbname"
        - name: DEBUG
          value: "true"
```

### Étape 2 : Appliquer les Modifications

Appliquez les modifications comme précédemment :

```bash
oc apply -f deployment.yaml
```

### Étape 3 : Vérifier les Modifications

Vérifiez que les nouvelles variables d'environnement ont été appliquées correctement en décrivant les pods :

```bash
oc describe pod <pod-name>
```

Recherchez la section `Environment` pour confirmer les valeurs des variables.

## Conclusion

Mettre à jour les paramètres et l'image de l'application dans OpenShift est une opération essentielle pour la gestion continue des applications. En suivant les étapes décrites ci-dessus, vous pouvez effectuer ces mises à jour de manière structurée et sécurisée, garantissant ainsi que vos applications fonctionnent avec les dernières versions et configurations nécessaires.

Dans la prochaine section, nous explorerons le déploiement automatique avec les ImageStreams dans OpenShift pour simplifier davantage le processus de gestion des versions.