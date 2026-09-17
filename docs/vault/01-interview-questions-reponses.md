# ONE:ACCESS — Interview complète / Questions & réponses

> **Source de vérité de conception.** Ce document reprend l'ensemble de l'interview disponible jusqu'au cadrage du MVP du samedi 19 septembre 2026. Les formulations sont normalisées pour être lisibles comme documentation. Les Q1–Q19 sont reconstruites à partir des décisions prises avant la numérotation explicite ; à partir de Q20, la numérotation suit l'interview. Ce n'est donc pas une retranscription mot à mot, mais aucune décision volontairement exprimée n'est remplacée par une invention.

## A — Fondations du référentiel

### Q1 — Quel problème ONE:ACCESS cherche-t-il à rendre visible ?
**R.** Le fait qu'un accès puisse officiellement « exister » alors que le parcours réellement imposé à une personne est beaucoup plus long, lent, fatigant, complexe ou dépendant d'une aide. O:A compare le même trajet A → B et mesure ce différentiel réel.

### Q2 — Le référentiel est-il réservé au fauteuil roulant ?
**R.** Non. Le fauteuil est le premier cas d'usage et le point de départ, mais le cadre doit pouvoir être étendu à d'autres situations avec des critères adaptés.

### Q3 — Quelle philosophie de conception doit guider O:A ?
**R.** Le design universel : autant que possible, intégrer l'accessibilité au parcours commun plutôt que créer un parcours séparé. Un parcours spécifique peut être nécessaire, mais la séparation ne doit pas être la solution par défaut.

### Q4 — O:A doit-il imposer la solution technique ?
**R.** Non. O:A mesure le résultat, identifie les causes et peut proposer plusieurs solutions. Si deux solutions différentes produisent réellement la même expérience mesurée, elles peuvent recevoir le même score.

### Q5 — Que faut-il changer pour les constructions neuves ?
**R.** Intégrer l'accessibilité dès les premières étapes et dans les plans, plutôt que l'ajouter après conception comme une contrainte technique.

### Q6 — Quelle cible à long terme pour les parcours essentiels ?
**R.** Le 1:1 : un différentiel aussi proche que possible de 1 entre le parcours de référence et le parcours de la personne concernée.

### Q7 — Comment construire le score ?
**R.** Mesurer d'abord chaque parcours, puis agréger par zone/service et éventuellement au niveau du bâtiment. Un parcours critique ne doit jamais être masqué par une moyenne favorable.

### Q8 — Quelles dimensions doivent être mesurées ?
**R.** Distance, temps, effort physique, complexité et autonomie.

### Q9 — Quelle échelle conceptuelle utiliser ?
**R.** 1.0 → 1.6 → 2.0 → 3.0 → ∞. Les seuils sont provisoires et devront être validés. ∞ décrit un parcours impossible, pas une catégorie entière de lieux.

### Q10 — Une pente dégrade-t-elle automatiquement le score ?
**R.** Non. Une pente douce, confortable, sûre et intégrée au parcours commun peut être quasiment équivalente. Il faut distinguer effort intégré/universel, effort supplémentaire acceptable et effort excessif/obstacle fonctionnel.

### Q11 — Une assistance humaine obligatoire exclut-elle automatiquement le 1:1 ?
**R.** Non, car certaines contraintes de sécurité peuvent être légitimes. Mais l'autonomie doit mesurer la dépendance, l'attente, la complexité et l'incertitude. O:A doit favoriser la suppression des dépendances évitables.

### Q12 — Quels lieux doivent être prioritaires si O:A devient institutionnel ?
**R.** Les lieux essentiels et structurants : hôpitaux, kinés/ostéos/ergos/psys et autres structures médicales, grandes gares, mairies, police et services publics, grands centres commerciaux, cinémas/théâtres, et certains lieux de vie comme les terrasses de bars.

### Q13 — Que se passe-t-il si une institution publique reste inaccessible ?
**R.** Elle doit avoir une échéance d'amélioration et ne doit pas transférer les conséquences de sa propre inaccessibilité à l'usager. Le principe vient notamment de l'expérience France Travail : l'usager ne doit pas être rendu responsable de l'impossibilité d'accéder au service.

### Q14 — Et pour le privé existant ?
**R.** Une trajectoire progressive plutôt qu'un passage instantané à 1 : mesurer, identifier, améliorer, remesurer. Une rénovation importante doit déclencher une réévaluation et une amélioration systématique.

### Q15 — Le coût peut-il justifier l'inaction ?
**R.** Pas automatiquement. Un projet peut documenter score actuel, cible, travaux, coût et bénéfices. Une participation publique est envisageable lorsque la restructuration apporte un bénéfice d'accessibilité important, durable et plus large.

### Q16 — Quelle tolérance transitoire pour le neuf ?
**R.** Pendant une phase d'institutionnalisation, accepter conceptuellement des scores de 1 à moins de 2, avant de tendre vers 1:1. Ce seuil reste expérimental et non réglementaire.

### Q17 — Quel est le rôle d'O:A pour un lieu existant ?
**R.** Diagnostic et amélioration : mesurer → identifier les causes → proposer des adaptations → réduire le différentiel → améliorer l'autonomie. Les solutions peuvent être architecturales, organisationnelles, technologiques, opérationnelles ou informationnelles.

### Q18 — Comment éviter qu'un score global masque un point critique ?
**R.** Conserver les scores par parcours et faire remonter les parcours critiques dans la synthèse publique. Une moyenne seule n'est pas suffisante.

### Q19 — Comment rendre le score visible au public ?
**R.** À l'entrée du lieu, en ligne et idéalement dans les fiches de lieux de services tiers comme les moteurs de recherche/cartes. Le score doit être une donnée publique attachée au lieu et renvoyer vers sa fiche O:A.

## B — Fiche lieu, signalements et audit

### Q20 — Le score public doit-il afficher la date de dernière évaluation ?
**R.** La fiche doit permettre de connaître la fraîcheur de l'évaluation et l'historique ; l'état actuel et les évaluations antérieures seront ensuite distingués explicitement.

### Q21 — Un signalement peut-il contenir photos, description et parcours concerné, et déclencher une réévaluation ?
**R.** Oui. Le signalement doit être extrêmement simple et éviter la paperasse. O:A réutilise les informations déjà connues sur le lieu au lieu de les redemander.

### Q22 — Le signalement doit-il être anonyme ?
**R.** L'identité est vérifiée par O:A mais protégée vis-à-vis du propriétaire/exploitant. Le propriétaire reçoit le problème et les éléments utiles, pas l'identité de l'usager.

### Q23 — Le propriétaire peut-il répondre avec une preuve de correction ?
**R.** Oui. Cycle envisagé : Signalé → Vérifié par O:A → Transmis → Pris en compte → Travaux annoncés → Travaux réalisés → Audit O:A → Résolu → Nouveau score.

### Q24 — Qui peut devenir auditeur O:A ?
**R.** Le rôle peut être ouvert à tous sous réserve de formation, certification/validation et engagement déontologique (« serment »). O:A ne doit pas devenir un goulot d'étranglement composé uniquement de salariés internes.

### Q25 — Les personnes concernées doivent-elles participer à l'évolution des projets ?
**R.** Elles peuvent participer lorsqu'elles sont concernées. L'idée n'est pas de créer une commission permanente, mais de permettre aux personnes réellement touchées par un projet de devenir parties prenantes.

### Q26 — O:A doit-il suggérer automatiquement les parties prenantes à contacter ?
**R.** Pas en V1. Quand le réseau sera suffisamment développé, O:A pourra aider à identifier les acteurs pertinents. La V1 repose sur le volontariat.

### Q27 — Les premiers audits sont-ils ouverts à tous les établissements ?
**R.** Non au départ : commencer par des lieux pilotes sélectionnés, puis élargir.

## C — Parties prenantes, QR et implication

### Q28 — Comment rattacher une personne à un projet sans ressaisie ?
**R.** Via son identité O:A portable : l'initiateur scanne le QR O:A de la personne et O:A propose le rattachement au projet, sans ressaisir ses informations. La saisie manuelle peut rester possible.

### Q29 — Le scan suffit-il à rattacher la personne ?
**R.** Non. La personne reçoit une demande et choisit **Autoriser / Refuser**.

### Q30 — Une partie prenante peut-elle quitter le projet ?
**R.** Oui, à tout moment. Elle peut aussi indiquer qu'elle a « fait sa partie » et rester liée au projet avec une implication moindre.

### Q31 — Comment représenter le niveau d'implication ?
**R.** Par un continuum conceptuel de **1 à ∞** : 1 = implication forte, puis implication décroissante jusqu'à un état proche de l'observation. Ce niveau peut évoluer.

### Q32 — Un changement de niveau doit-il notifier l'initiateur ?
**R.** Non. L'information est consultable si l'initiateur la cherche, mais le changement ne génère pas automatiquement une notification.

### Q33 — Le niveau 1 → ∞ représente-t-il disponibilité ou importance du rôle ?
**R.** Les deux. Il reflète à la fois l'envie/la disponibilité pour être sollicité et l'importance de l'implication dans le projet.

## D — Qui voit qui ?

### Q34 — Que voit le public dans « Parties prenantes » ?
**R.** Des agrégats, pas les identités individuelles : par exemple **4 usagers concernés · 1 initiateur de la demande · État impliqué : oui/non**.

### Q35 — Un usager voit-il l'identité des autres usagers ?
**R.** Seulement si la personne concernée a donné l'autorisation correspondante. La visibilité peut être liée à son niveau/curseur, tout en gardant la possibilité de protéger son identité.

### Q36 — L'initiateur dispose-t-il automatiquement de plus de visibilité ?
**R.** Non automatiquement ; cela dépend aussi de sa volonté et des permissions. Le fait d'avoir initié le projet ne doit pas donner un accès illimité aux identités.

### Q37 — Montrer son implication peut-il affecter un score ?
**R.** Oui, mais dans un **score dissocié** du score d'accessibilité. L'implication ne doit jamais améliorer artificiellement l'accessibilité physique.

### Q38 — Comment représenter accessibilité et implication ?
**R.** Par une matrice : **X = accessibilité (1 → ∞)**, **Y = implication (idéalement 1 → ∞ également)**. Les deux axes restent séparés et ne sont jamais moyennés.

### Q39 — L'implication doit-elle être calculée pour l'établissement ou pour chaque partie prenante ?
**R.** À déterminer. Pour la V1, ne pas figer la formule ; collecter les données et expérimenter.

### Q40 — O:A connaît-il l'identité réelle des parties prenantes ?
**R.** Oui, a priori. Mais « O:A connaît » ne doit pas signifier que chaque salarié peut consulter les identités : accès interne contrôlé, masqué par défaut et traçable lorsque possible.

## E — Institutions publiques et financement

### Q41 — Si l'État finance ou participe, son identité doit-elle être publique ?
**R.** Oui. Si une personne publique accorde un financement spécial ou participe officiellement, cela doit être visible.

### Q42 — Les financements privés doivent-ils être aussi détaillés ?
**R.** Non, priorité à la transparence des fonds publics. Le privé peut publier volontairement davantage d'informations.

### Q43 — Le coût total des travaux doit-il être public ?
**R.** S'il est déjà rendu public, par exemple affiché sur le devis/panneau devant le bâtiment, O:A peut le reprendre. O:A ne doit pas créer une obligation supplémentaire de publication du coût privé.

### Q44 — Un QR O:A peut-il être affiché devant les travaux ?
**R.** Oui. Ceux qui veulent en savoir plus peuvent scanner ; les autres ignorent simplement le QR. Il mène directement à la fiche du projet.

## F — Participation aux projets

### Q45 — Quelqu'un peut-il demander lui-même à devenir partie prenante ?
**R.** Cela dépend des règles initiales du projet. Un projet privé peut être sur invitation, sur demande avec validation, ou plus ouvert.

### Q46 — Les règles de participation peuvent-elles changer ?
**R.** Oui, mais toute modification doit être **historisée**.

### Q47 — Quelle règle pour une institution publique ?
**R.** Pour un projet porté par une institution publique, toute personne qui passe sur la fiche peut rejoindre directement, sans demander l'autorisation de l'institution.

### Q48 — Quel statut choisit la personne qui rejoint un projet public ?
**R.** Elle choisit elle-même entre **Partie prenante** et **Intéressé**. O:A ne lui impose pas de justifier pourquoi elle est concernée.

### Q49 — Un « Intéressé » peut-il participer aux décisions ?
**R.** Cela dépend du type de décision. Les droits ne sont pas déterminés uniquement par le statut ; ils dépendent aussi de la nature de la décision.

### Q50 — Les résultats des décisions/consultations sont-ils publics ?
**R.** O:A conserve la traçabilité (qui pouvait participer, combien ont participé, résultat, date), mais ces informations ne sont **pas publiques par défaut**. Le propriétaire/porteur décide de leur publication, sous réserve de futures règles spécifiques au public.

## G — Historique immuable

### Q51 — Une information rendue publique peut-elle ensuite disparaître ?
**R.** Non dans le fonctionnement normal. Logique inspirée d'une blockchain : registre append-only. On peut corriger, compléter ou remplacer une information, mais pas réécrire le passé. Les obligations légales de retrait/masquage restent une exception.

### Q52 — Les anciens scores restent-ils consultables ?
**R.** Oui. Comme un historique temporel, on peut consulter les anciens états, audits, scores, incidents, travaux et corrections d'un lieu.

### Q53 — Comment traiter une dégradation temporaire ?
**R.** Distinguer **score global/de référence** issu du dernier audit complet et **score actuel** lorsqu'une dégradation vérifiée modifie réellement l'expérience. Si la dégradation est constatée, le score actuel apparaît.

### Q54 — Que montre la page « Général » ?
**R.** Un résumé de **toute information pertinente maintenant** : score de référence, score/état actuel, incidents, parcours affectés, dernier audit, projets en cours, participation, financement public éventuel, actions utiles.

### Q55 — Faut-il proposer « Puis-je actuellement effectuer mon trajet ? » ?
**R.** Oui uniquement si tous les trajets nécessaires sont renseignés avec une couverture suffisante. Sinon O:A ne doit pas extrapoler ce qu'il n'a pas mesuré.

## H — Cartographie et industrialisation

### Q56 — Comment déterminer à terme que tous les parcours ont été cartographiés ?
**R.** Par une cartographie technique du bâtiment ; à grande échelle, l'idée envisagée est notamment le **drone indoor**.

### Q57 — Le drone intervient-il à l'intérieur ?
**R.** Oui. Il pourrait relever géométrie, couloirs, distances, portes, niveaux, rampes, escaliers, ascenseurs et intersections, puis l'audit humain complète les dimensions non déductibles du scan.

### Q58 — Le scan 3D intérieur est-il une fonctionnalité publique de V1 ?
**R.** Non. Une visite/jumeau numérique public relève plutôt de V2/V3.

### Q59 — Le drone est-il indispensable au premier MVP/V1 ?
**R.** Non. Le drone est une **solution d'industrialisation**. Les premiers pilotes peuvent être cartographiés manuellement afin de valider d'abord ce qu'il faut mesurer.

### Q60 — Quels profils de lieux pilotes choisir ?
**R.** Des lieux volontairement hétérogènes, par exemple un cabinet médical, un bâtiment public et un grand établissement recevant du public, afin de tester la robustesse du référentiel.

## I — MVP du samedi 19 septembre 2026

### Q61 — Quelle est l'action principale du MVP ?
**R.** **Signer / soutenir ONE:ACCESS.** L'objectif est de voir si l'initiative est comprise et soutenue, afin de décider si elle mérite de devenir un vrai projet, un collectif/une association ou une proposition structurée présentée aux pouvoirs publics / au ministère chargé du handicap.

### Q62 — Faut-il recueillir un retour qualitatif ?
**R.** Oui, avec une seule question facultative, par exemple : **« Qu'est-ce que ONE:ACCESS changerait pour vous ? »**

### Q63 — Quelles informations demander pour un soutien sérieux ?
**R.** Un soutien identifiable mais léger : prénom, nom, e-mail et consentement explicite au soutien. Le témoignage reste facultatif. L'objectif est d'obtenir un signal plus sérieux qu'un simple compteur de clics, sans créer de paperasse.

### Q64 — Comment présenter ONE:ACCESS samedi ?
**R.** Comme **« un projet de futur standard pour mesurer l'accessibilité réelle »**, tout en disant explicitement qu'il est encore expérimental. « Initiative citoyenne » seule serait trop réducteur ; « standard officiel » serait prématuré.

### Q65 — Que signifie exactement soutenir le MVP ?
**R.** Soutenir le **principe central et son expérimentation**, pas approuver à l'avance chaque détail réglementaire ou méthodologique encore à tester. Formulation de travail : « Je soutiens l'expérimentation de ONE:ACCESS et la poursuite de cette initiative en vue d'en faire une proposition structurée auprès des pouvoirs publics. »

---

## Questions volontairement laissées ouvertes

- Formule mathématique et pondération exacte des cinq dimensions.
- Validation scientifique des seuils 1.0 / 1.6 / 2.0 / 3.0 / ∞.
- Mesure exacte des attentes variables/probabilistes.
- Formule du score d'implication et unité réellement notée : établissement, projet, acteurs, combinaison.
- Détails juridiques de la certification et du « serment » des auditeurs.
- Modalités réglementaires précises d'une institutionnalisation.
- Technologies exactes de scan indoor / drone et navigation publique V2+.
