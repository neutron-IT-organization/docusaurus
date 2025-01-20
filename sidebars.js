/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  //tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
    },
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'Introduction/Objectif_du_cours',
        'Introduction/Organisation_de_la_formation',
      ],
    },
    {
      type: 'category',
      label: 'Présentation de Kubernetes et Openshift',
      items: [
        'Présentation_de_Kubernetes_et_Openshift/Presentation_d_Openshift',
        'Présentation_de_Kubernetes_et_Openshift/Quiz_Presentation_d_Openshift',
        'Présentation_de_Kubernetes_et_Openshift/Exploration_de_la_console',
        'Présentation_de_Kubernetes_et_Openshift/Exercice_guidé_Exploration_de_la_console',
        'Présentation_de_Kubernetes_et_Openshift/Architecture_Openshift_et_Kubernetes',
        'Présentation_de_Kubernetes_et_Openshift/Quiz_Architecture_Openshift_et_Kubernetes',
        'Présentation_de_Kubernetes_et_Openshift/Résumé',
      ],
    },
    {
      type: 'category',
      label: 'Interface et ligne de commande',
      items: [
        'Interface_et_ligne_de_commande/Intéragir_avec_la_ligne_de_commande',
        'Interface_et_ligne_de_commande/Exerice_guidé_Intéragir_avec_la_ligne_de_commande',
        'Interface_et_ligne_de_commande/Examen_des_ressources_Kubernetes',
        'Interface_et_ligne_de_commande/Exercice_guidé_Examen_des_ressources_Kubernetes',
        'Interface_et_ligne_de_commande/Résumé',
      ],
    },
    {
      type: 'category',
      label: 'Exécutez des applications conteneurisées',
      items: [
        'Executez_des_applications_conteneurisé/Les_Workloads_dans_Openshift',
        'Executez_des_applications_conteneurisé/Quiz_Les_Workloads_dans_Openshift',
        'Executez_des_applications_conteneurisé/Les_deployment_et_les_daemonset',
        'Executez_des_applications_conteneurisé/Exercice_guidé_Les_deployment_et_les_daemonset',
        'Executez_des_applications_conteneurisé/Les_statefulset',
        'Executez_des_applications_conteneurisé/Exercice_guidé_Les_statefulset',
        'Executez_des_applications_conteneurisé/Résumé',
      ],
    },
    {
      type: 'category',
      label: 'Les réseaux dans OpenShift',
      items: [
        'Les_réseaux_dans_openshift/Les_sdn_dans_openshift',
        'Les_réseaux_dans_openshift/Quiz_Les_sdn_dans_openshift',
        'Les_réseaux_dans_openshift/Les_réseaux_de_pods_et_de_services',
        'Les_réseaux_dans_openshift/Exercice_guidé_Les_réseaux_de_pods_et_de_services',
        'Les_réseaux_dans_openshift/Résumé',
      ],
    },
    {
      type: 'category',
      label: 'Gestion du stockage',
      items: [
        'Gestion_du_stockage/Les_configmap_et_les_secrets_dans_openshift',
        'Gestion_du_stockage/Exercice_guidé_Les_configmap_et_les_secrets_dans_openshifts',
        'Gestion_du_stockage/Approvisionnement_des_volumes_de_donnés_persistantes',
        'Gestion_du_stockage/Selection_d_une_classe_de_stockage',
        'Gestion_du_stockage/Exercice_guidé_pv_pvc_storage_class',
        'Gestion_du_stockage/Résumé',
      ],
    },
    {
      type: 'category',
      label: 'Configuration de la fiabilité des applications',
      items: [
        'Configuration_de_la_fiabilité_des_applications/Utilisation_des_probes_dans_Kubernetes',
        'Configuration_de_la_fiabilité_des_applications/Exercice_guidé_Utilisation_des_probes_dans_Kubernetes',
        'Configuration_de_la_fiabilité_des_applications/Réservation_et_Limitation_de_capacité_de_calcul_pour_les_applications',
        'Configuration_de_la_fiabilité_des_applications/Exercice_guidé_Réservation_et_Limitation_de_capacité_de_calcul_pour_les_applications',
        'Configuration_de_la_fiabilité_des_applications/Mise_a_l\'echelle_automatique_des_applications',
        'Configuration_de_la_fiabilité_des_applications/Résumé',
      ],
    },
    {
      type: 'category',
      label: 'Gestion et administration du cluster',
      items: [
        'Gestion_et_administration_du_cluster/User_management',
        'Gestion_et_administration_du_cluster/Exercice_guidé_user_management',
        'Gestion_et_administration_du_cluster/Observabilité_du_cluster',
        'Gestion_et_administration_du_cluster/Exercice_guidé_Observabilité_du_cluster',
        'Gestion_et_administration_du_cluster/Node_MachineSet_MachineConfigs',
        'Gestion_et_administration_du_cluster/Exercice_guidé_MachineSet_MachineConfigs.md',
        'Gestion_et_administration_du_cluster/Gestion_des_mises_a_jours',
        'Gestion_et_administration_du_cluster/Quiz_gestion',
        'Gestion_et_administration_du_cluster/Résumé',
      ],
    },
  ],   
};

export default sidebars;
