# Exercice Guidé : Mise à Jour des Paramètres et de l'Image de l'Application

Dans cet exercice guidé, nous allons pratiquer la mise à jour des paramètres et de l'image de l'application déployée dans OpenShift. Vous apprendrez à modifier le fichier de déploiement pour pointer vers une nouvelle version de l'image et à mettre à jour les variables d'environnement de l'application.

## Objectifs de l'Exercice

- Mettre à jour l'image d'une application.
- Modifier les variables d'environnement de l'application.
- Vérifier que les mises à jour ont été appliquées correctement.

## Prérequis

- Un cluster OpenShift fonctionnel.
- Un déploiement existant de l'application que vous souhaitez mettre à jour.

### Étape 1 : Mettre à Jour l'Image de l'Application

Tout d'abord, nous allons mettre à jour l'image de l'application. Supposons que nous avons une nouvelle version de l'image `my-app:v2.0` disponible dans notre registre.

1. **Ouvrez le fichier de déploiement YAML** de votre application. Par exemple, `deployment.yaml`.

2. **Modifiez la section `image`** pour pointer vers la nouvelle version de l'image :

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

3. **Appliquez les modifications** en utilisant la commande `oc apply` :

   ```bash
   oc apply -f deployment.yaml
   ```

4. **Vérifiez le déploiement** pour vous assurer que les nouveaux pods utilisent la nouvelle image :

   ```bash
   oc get pods
   ```

5. **Décrivez le déploiement** pour vérifier l'image utilisée :

   ```bash
   oc describe deployment my-app
   ```

### Étape 2 : Mettre à Jour les Paramètres de l'Application

Ensuite, nous allons mettre à jour les variables d'environnement de l'application.

1. **Ouvrez le fichier de déploiement YAML** de votre application.

2. **Ajoutez ou modifiez les variables d'environnement** dans la section `env` du conteneur. Par exemple :

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

3. **Appliquez les modifications** comme précédemment :

   ```bash
   oc apply -f deployment.yaml
   ```

4. **Vérifiez les modifications** en décrivant les pods pour confirmer les valeurs des variables d'environnement :

   ```bash
   oc describe pod <pod-name>
   ```

### Étape 3 : Vérification Finale

Après avoir appliqué les modifications, il est crucial de vérifier que tout fonctionne comme prévu.

1. **Obtenez la liste des pods** pour vérifier leur statut :

   ```bash
   oc get pods
   ```

2. **Consultez les journaux** des pods pour vous assurer qu'il n'y a pas d'erreurs liées aux nouvelles variables d'environnement ou à la nouvelle image :

   ```bash
   oc logs <pod-name>
   ```

3. **Accédez à l'application** via son URL (si applicable) pour vérifier qu'elle fonctionne correctement avec les mises à jour appliquées.

## Conclusion

Dans cet exercice guidé, vous avez appris à mettre à jour l'image et les paramètres de l'application déployée dans OpenShift. En suivant ces étapes, vous pouvez assurer que vos applications fonctionnent toujours avec les dernières versions et configurations nécessaires.