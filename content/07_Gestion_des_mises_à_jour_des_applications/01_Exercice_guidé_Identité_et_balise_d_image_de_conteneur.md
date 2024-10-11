# Exercice Guidé : Identité et Balisage d'Image de Conteneur

Dans cet exercice guidé, nous allons explorer comment gérer l'identité et le balisage des images de conteneurs dans OpenShift. Vous apprendrez à taguer des images, à les pousser vers un registre et à déployer des applications en utilisant des images avec des balises spécifiques.

## Objectifs de l'Exercice

- Taguer une image de conteneur avec une balise spécifique.
- Pousser l'image taguée vers un registre d'images.
- Déployer une application en utilisant une image avec une balise spécifique.

## Prérequis

- Un cluster OpenShift fonctionnel.
- Une image de conteneur existante que vous souhaitez taguer et déployer.

### Étape 1 : Taguer une Image de Conteneur

Tout d'abord, nous allons taguer une image de conteneur existante avec une nouvelle balise.

1. **Lister les images disponibles** sur votre machine locale pour identifier l'image à taguer :

   ```bash
   docker images
   ```

2. **Taguer l'image** avec une nouvelle balise. Par exemple, si l'image source est `my-app:latest` et que vous voulez la taguer en `my-app:v1.0` :

   ```bash
   docker tag my-app:latest my-registry.example.com/my-namespace/my-app:v1.0
   ```

### Étape 2 : Pousser l'Image Taguée vers un Registre

Ensuite, nous allons pousser l'image taguée vers un registre d'images. Assurez-vous que vous êtes connecté au registre d'images.

1. **Se connecter au registre d'images** (si ce n'est pas déjà fait) :

   ```bash
   docker login my-registry.example.com
   ```

2. **Pousser l'image taguée** vers le registre :

   ```bash
   docker push my-registry.example.com/my-namespace/my-app:v1.0
   ```

### Étape 3 : Déployer une Application en Utilisant l'Image Taguée

Maintenant, nous allons déployer une application dans OpenShift en utilisant l'image que nous avons taguée et poussée vers le registre.

1. **Créer un fichier de déploiement YAML** pour votre application. Par exemple, `deployment.yaml` :

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
           image: my-registry.example.com/my-namespace/my-app:v1.0
           ports:
           - containerPort: 8080
   ```

2. **Appliquer le fichier de déploiement** pour créer le déploiement dans OpenShift :

   ```bash
   oc apply -f deployment.yaml
   ```

3. **Vérifier le statut du déploiement** pour s'assurer que les pods sont correctement créés et en cours d'exécution :

   ```bash
   oc get pods
   ```

## Conclusion

Dans cet exercice guidé, vous avez appris à taguer une image de conteneur, à la pousser vers un registre d'images et à déployer une application dans OpenShift en utilisant cette image. La gestion des balises et l'identité des images sont des compétences essentielles pour assurer la cohérence et la reproductibilité des déploiements d'applications.