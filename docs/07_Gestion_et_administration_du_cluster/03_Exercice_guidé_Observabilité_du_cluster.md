# Exercice Guidé : Découvrir les Dashboards et les Alertes dans OpenShift Observe

Cet exercice vous permet d'explorer les fonctionnalités de monitoring d'OpenShift via les dashboards dans l'onglet **Observe**. Vous allez configurer une alerte personnalisée détectant les pods dans l'état `Failed`, `Pending`, ou `Unknown`, tester cette alerte en déclenchant un échec de pod, et la résoudre.


## Objectif

À la fin de cet exercice, vous serez capable de :
1. Configurer une règle d’alerte dans un namespace spécifique.
2. Observer les dashboards dans OpenShift pour visualiser les métriques et alertes.
3. Tester et résoudre une alerte en manipulant un pod défectueux.


## Étape 1 : Configurer une Règle d’Alerte Prometheus

1. **Créer un fichier YAML pour la règle Prometheus** :

   Sauvegardez le contenu suivant dans un fichier nommé `pod-not-ready-alert.yaml` :

   ```yaml
   apiVersion: monitoring.coreos.com/v1
   kind: PrometheusRule
   metadata:
     name: YOURCITY-kube-pod-not-ready
     namespace: openshift-monitoring
   spec:
     groups:
       - name: pod-readiness-rules
         rules:
           - alert: YOURCITY-OpenshiftPodNotHealthy
             expr: sum by (namespace, pod) (kube_pod_status_phase{namespace="YOURCITY-user-ns", phase=~"Pending|Unknown|Failed|Error"}) > 0
             for: 1m
             labels:
               severity: critical
             annotations:
               summary: "Pod {{ $labels.namespace }}/{{ $labels.pod }} is not healthy"
               description: |
                 The pod {{ $labels.namespace }}/{{ $labels.pod }} has been in a non-running state for over 1 minute.
                 VALUE = {{ $value }}
                 LABELS = {{ $labels }}
   ```



2. **Appliquer la règle dans le namespace `YOURCITY-user-ns`** :

   ```bash
   oc apply -f pod-not-ready-alert.yaml
   ```

Cette règle sera appliqué au bout d'environ quelques minutes (environ 5 minutes).

Pour vérifier que la règle est appliqué, rendez-vous dans Observe>Alerting>Alerting rules et cherchez OpenshiftPodNotHealthy dans les filtres.

![Prague alerting rule](./images/prague-alerting-rule.png)

## Étape 2 : Déployer un Pod Défectueux

1. **Créer un fichier YAML pour le pod défectueux** :

   Sauvegardez le contenu suivant dans un fichier nommé `failed-pod.yaml` :

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: failed-pod-demo
     namespace: YOURCITY-user-ns
   spec:
     containers:
       - name: failed-container
         image: busybox
         command: ["/bin/sh", "-c", "exit 1"]
     restartPolicy: Never
   ```

2. **Appliquer la configuration pour créer le pod** :

   ```bash
   oc apply -f failed-pod.yaml
   ```

   Ce pod passera immédiatement dans l’état `Failed`.


## Étape 3 : Explorer les Dashboards dans OpenShift

1. **Accéder à l’interface Observe** :
   - Connectez-vous à la console OpenShift.
   - Naviguez vers **Observe > Dashboards**.

2. **Filtrer par namespace** :
   - Sélectionnez les dashboards **Kubernetes / Pods**.
   - Filtrez pour afficher uniquement les pods du namespace `YOURCITY-user-ns`.

3. **Examiner les métriques** :
   - Vérifiez l’état des pods.
   - Confirmez que le pod `failed-pod-demo` est marqué comme `Failed`.

4. **Vérifier les alertes** :
   - Naviguez vers **Observe > Alerts**.
   - Recherchez l’alerte **KubernetesPodNotHealthy**.
   - Cliquez sur l'alerte pour voir ses détails, comme le pod concerné et les annotations configurées.


## Étape 4 : Résoudre l'Alerte

Pour lever l'alerte, supprimez le pod défectueux :

```bash
oc delete pod -n YOURCITY-user-ns failed-pod-demo
```

Revenez dans l’onglet **Alerts** pour confirmer que l’alerte a disparu.

## Étape 5 : Nettoyage

1. **Supprimez la règle d’alerte** :

   ```bash
   oc delete -f pod-not-ready-alert.yaml
   ```

2. **Supprimez les ressources restantes dans `YOURCITY-user-ns`** :

   ```bash
   oc delete pod -n YOURCITY-user-ns failed-pod-demo --ignore-not-found
   ```

## Résultat Attendu

1. Vous avez configuré une règle Prometheus pour surveiller les pods non prêts dans le namespace `YOURCITY-user-ns`.
2. Vous avez déployé un pod défectueux et confirmé que l’alerte s’est déclenchée.
3. Vous avez exploré les dashboards pour analyser les métriques et les alertes.
4. Vous avez résolu et nettoyé l’environnement.
