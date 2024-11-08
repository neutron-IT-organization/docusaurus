
# Exercices guidé : Sondes de santé des applications sur OpenShift

## Objectifs
Dans cet exercice, vous apprendrez à :
1. Comprendre l'importance des sondes de santé pour maintenir les applications en bonne santé dans OpenShift.
2. Configurer les sondes de **liveness** et de **readiness** pour une application déployée.
3. Tester le comportement d'OpenShift lors de l'échec de chaque type de sonde.

## Prérequis
Avant de commencer, assurez-vous d’avoir accès à un cluster OpenShift et aux autorisations nécessaires pour créer des déploiements.

## Introduction
Les applications peuvent rencontrer des problèmes de fonctionnement dans leurs conteneurs, souvent en raison de facteurs externes (connexions perdues, erreurs de configuration, etc.). Pour gérer ces situations, OpenShift offre des sondes de santé, qui vérifient périodiquement l’état des conteneurs :
- **Liveness Probe** : vérifie si le conteneur doit être redémarré.
- **Readiness Probe** : détermine si le conteneur peut recevoir du trafic.

## Etape 1 : Création du déploiement de base

Créez un fichier de déploiement pour une application simple. Dans cet exemple, nous utiliserons une application Node.js, exposée sur le port 8080.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: demo-app
  template:
    metadata:
      labels:
        app: demo-app
    spec:
      containers:
      - name: demo-app
        image: node:14
        command: ["node", "-e", "require('http').createServer((req, res) => res.end('ok')).listen(8080)"]
        ports:
        - containerPort: 8080
```

Déployez cette application sur votre cluster OpenShift :
```bash
oc apply -f demo-deployment.yaml
```

## Etape 2 : Ajout de la **Liveness Probe**

Ajoutez une sonde de liveness qui vérifiera périodiquement si l'application répond sur le chemin HTTP `/health`. Si cette vérification échoue, OpenShift redémarrera le conteneur.

Mettez à jour votre fichier de déploiement comme suit :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: demo-app
  template:
    metadata:
      labels:
        app: demo-app
    spec:
      containers:
      - name: demo-app
        image: node:14
        command: ["node", "-e", "require('http').createServer((req, res) => res.end('ok')).listen(8080)"]
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 1
          failureThreshold: 3
```

Déployez les modifications :
```bash
oc apply -f demo-deployment.yaml
```

### Explications
- **initialDelaySeconds** : Délai avant la première vérification.
- **periodSeconds** : Intervalle entre les vérifications.
- **timeoutSeconds** : Temps d'attente avant un échec.
- **failureThreshold** : Nombre d'échecs consécutifs avant de redémarrer le conteneur.

## Etape 3 : Ajout de la **Readiness Probe**

Ensuite, configurez la readiness probe pour vérifier si le conteneur est prêt à recevoir du trafic. Si le conteneur échoue cette vérification, il reste actif mais ne reçoit pas de trafic.

Ajoutez les lignes suivantes dans votre configuration de déploiement :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: demo-app
  template:
    metadata:
      labels:
        app: demo-app
    spec:
      containers:
      - name: demo-app
        image: node:14
        command: ["node", "-e", "require('http').createServer((req, res) => res.end('ok')).listen(8080)"]
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 1
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 1
          failureThreshold: 3
```

Déployez les modifications :
```bash
oc apply -f demo-deployment.yaml
```

### Explications
- **Readiness Probe** vérifie que le conteneur peut recevoir des requêtes, par exemple, après un temps d'initialisation prolongé.

## Etape 4 : Tester les sondes

### 4.1. Test de la **Readiness Probe**
Pour simuler un déploiement sans interruption, mettez à jour l'image avec une nouvelle version :

```yaml
image: node:16
```

Observez la transition dans le tableau de bord OpenShift ; la readiness probe empêche le basculement vers le nouveau pod jusqu'à ce qu’il soit prêt.

### 4.2. Test de la **Liveness Probe**
Simulez un échec de liveness probe en modifiant le chemin de la sonde sur `/fail` :

```yaml
livenessProbe:
  httpGet:
    path: /fail
    port: 8080
```

Déployez les modifications :
```bash
oc apply -f demo-deployment.yaml
```

Observez les événements dans le tableau de bord : OpenShift détecte l’échec et redémarre le conteneur plusieurs fois jusqu'à atteindre le seuil de défaillance.

## Nettoyage
Pour nettoyer votre environnement, supprimez le déploiement :

```bash
oc delete deployment demo-app
```

## Conclusion
Cet exercice vous a permis d'implémenter des sondes de santé pour surveiller l'état d'une application. En utilisant des sondes de **liveness** et **readiness**, OpenShift est capable de redémarrer automatiquement les conteneurs en cas de défaillance et de gérer le trafic pour garantir une disponibilité continue.