# Sondes d’intégrité des applications dans OpenShift

## Introduction

Dans l'environnement dynamique des conteneurs, la disponibilité et la performance des applications sont primordiales. Les sondes d'intégrité (ou *probes*) dans OpenShift jouent un rôle crucial dans la gestion de cette disponibilité. Elles permettent à Kubernetes d'évaluer l'état de santé d'une application, d'automatiser les redémarrages en cas de défaillance et d'assurer que le trafic est dirigé uniquement vers des pods en bon état de fonctionnement. Cet article se penche sur le fonctionnement des sondes d'intégrité, leur importance dans le cycle de vie des applications et comment les configurer efficacement.

## Rôle des Sondes d’intégrité

Les sondes d'intégrité sont des mécanismes permettant à Kubernetes de vérifier l'état d'un pod à intervalles réguliers. Elles sont essentielles pour plusieurs raisons :

### 1. Atténuation des plantages

Lorsque des pods échouent, les sondes d'intégrité permettent à Kubernetes de détecter rapidement la défaillance et d'agir en conséquence, par exemple en redémarrant automatiquement le pod. Cela réduit le temps d'indisponibilité et garantit que les utilisateurs peuvent continuer à interagir avec l'application sans interruption prolongée.

### 2. Basculement et équilibrage de charge

Les sondes aident également à diriger le trafic uniquement vers les pods qui fonctionnent correctement. Si un pod échoue à répondre à une sonde d'intégrité, Kubernetes le retire automatiquement de la rotation de service, empêchant ainsi les requêtes de lui être envoyées. Cela assure une meilleure répartition de la charge entre les pods sains, optimisant ainsi la performance de l'application.

### 3. Surveillance des performances

Les sondes d'intégrité jouent un rôle clé dans la surveillance des performances des applications. Elles permettent de détecter les problèmes potentiels avant qu'ils n'affectent les utilisateurs. En surveillant les conditions d'échec des pods, les administrateurs peuvent réagir rapidement aux problèmes et prévenir les interruptions de service.

### 4. Mise à l’échelle efficace

Lorsqu'il s'agit de mise à l'échelle des applications, les sondes d'intégrité aident Kubernetes à déterminer quand un nouveau réplica est prêt à recevoir des demandes. Cela permet une mise à l'échelle automatique des ressources, garantissant que l'application dispose toujours de la capacité nécessaire pour traiter le trafic entrant.

## Types de Sondes

Kubernetes propose trois types principaux de sondes d'intégrité : les sondes Liveness, Readiness et Startup. Chaque type remplit un rôle distinct dans la gestion de l'état des applications.

### 1. Sondes Liveness

Les sondes Liveness sont essentielles pour vérifier si un conteneur fonctionne toujours comme prévu. Elles sont appelées de manière régulière tout au long de la durée de vie de l'application. Si une sonde Liveness échoue après un nombre prédéfini d'essais, Kubernetes redémarre automatiquement le pod. Cela est particulièrement utile pour les applications qui peuvent se retrouver dans un état bloqué ou non réactif. En redémarrant le pod, Kubernetes peut restaurer rapidement le service sans intervention humaine.

### 2. Sondes Readiness

Les sondes Readiness vérifient si une application est prête à recevoir du trafic. Lorsqu'une sonde Readiness échoue, Kubernetes retire temporairement le pod du service, évitant ainsi que le trafic ne soit dirigé vers une application qui n'est pas prête à gérer les demandes. Cela est particulièrement important pour les applications qui peuvent avoir besoin d'un certain temps pour se préparer, par exemple en établissant des connexions initiales à des bases de données ou en effectuant des tâches de démarrage longues. Une fois que la sonde Readiness réussit à nouveau, le pod est réintégré au service, ce qui améliore l'expérience utilisateur en réduisant le risque d'erreurs.

### 3. Sondes Startup

Les sondes Startup sont conçues pour les applications dont le processus de démarrage est long. Contrairement aux sondes Liveness et Readiness, une sonde Startup est appelée uniquement lors du démarrage initial de l'application. Si elle échoue après un certain temps, le pod est redémarré. Cela permet aux sondes Liveness de rester réactives, car elles ne sont pas submergées par des vérifications pendant le démarrage. En intégrant des sondes Startup, les développeurs peuvent mieux gérer les applications qui nécessitent un temps de préparation prolongé.

## Types de Test

Lors de la configuration des sondes d'intégrité, il est crucial de choisir le type de test approprié. Kubernetes propose plusieurs méthodes pour évaluer l'état des conteneurs :

### 1. HTTP GET

Ce type de sonde envoie une requête HTTP à un point de terminaison spécifié de l'application. La sonde réussit si le serveur renvoie un code de réponse HTTP compris entre 200 et 399. Ce type de test est idéal pour les applications web, car il permet de vérifier la réponse de l'application à des requêtes réelles.

### 2. Commande de conteneur

Pour ce type de sonde, Kubernetes exécute une commande spécifiée à l'intérieur du conteneur. Si la commande renvoie un code d'état 0, le test est considéré comme réussi. Ce type de test peut être utilisé pour vérifier l'état interne d'une application, en exécutant des scripts de diagnostic ou d'autres commandes.

### 3. Socket TCP

Ce type de test vérifie si une connexion TCP peut être établie avec le conteneur. Le test réussit uniquement si la connexion est réussie, ce qui est utile pour s'assurer que l'application écoute sur le bon port.

## Horaires et Seuils

La configuration des sondes d'intégrité nécessite une attention particulière aux paramètres de minutage et de seuils. Deux variables clés à prendre en compte sont :

- **periodSeconds** : Ce paramètre détermine la fréquence à laquelle la sonde est exécutée. Un intervalle trop court peut conduire à une surcharge inutile des ressources, tandis qu'un intervalle trop long pourrait retarder la détection des problèmes.

- **failureThreshold** : Ce paramètre définit le nombre d'échecs consécutifs nécessaires avant que la sonde soit considérée comme échouée. Par exemple, une sonde avec une valeur de `failureThreshold` de 3 et `periodSeconds` de 5 peut permettre jusqu'à 15 secondes avant de déclencher une action corrective. Cette configuration offre un équilibre entre la réactivité et la tolérance aux pannes temporaires.

## Configuration des Sondes

Les sondes d'intégrité peuvent être configurées directement dans les fichiers YAML des ressources Kubernetes, telles que les déploiements. Voici un exemple de configuration d'une sonde Liveness dans un déploiement :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
spec:
  template:
    spec:
      containers:
      - name: web-server
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 10
          failureThreshold: 3
```

Dans cet exemple, la sonde Liveness est configurée pour effectuer une requête HTTP sur le chemin `/health` du serveur web. La sonde attendra 15 secondes après le démarrage avant de commencer les vérifications, puis s'exécutera toutes les 10 secondes, en permettant jusqu'à trois échecs consécutifs avant de redémarrer le pod.

### Commande en Ligne de Commande

Les sondes peuvent également être ajoutées ou modifiées via la ligne de commande en utilisant la commande `oc set probe`. Par exemple, pour ajouter une sonde Readiness à un déploiement :

```bash
oc set probe deployment/front-end --readiness --failure-threshold 6 --period-seconds 10 --get-url http://:8080/healthz
```

Cette commande configure une sonde Readiness qui teste la santé de l'application à l'URL spécifiée, avec un seuil d'échec et une fréquence définis.

## Conclusion

Les sondes d'intégrité dans OpenShift sont un élément fondamental pour maintenir la disponibilité et la performance des applications. En intégrant ces sondes dans vos déploiements, vous pouvez non seulement améliorer la résilience de vos applications, mais aussi garantir une expérience utilisateur fluide et sans interruption. Une bonne configuration des sondes d'intégrité est essentielle pour assurer la réactivité du système et la détection précoce des problèmes, permettant ainsi aux équipes de développement et d'exploitation de réagir rapidement et de maintenir la qualité du service.
