// ---------------------------------------------------------------------------
// reroll — Romeo & Juliet story data
//
// One canonical spine of 12 events (c0..c11) plus three authored counterfactual
// branches, each rooted in a single changed premise. All metrics are hand-tuned
// for internal consistency: probabilities track causal inevitability, valence
// tracks the emotional arc, uncertainty stays low on canon, and downstreamImpact
// marks the true leverage points of the tragedy.
// ---------------------------------------------------------------------------

import type { Branch, Story, StoryEvent } from "@/lib/types";

// --- Canonical spine -------------------------------------------------------

const canonicalEvents: StoryEvent[] = [
  {
    id: "c0",
    title: "Servants Fight in Verona",
    description:
      "A quarrel between the serving men of the Montagues and Capulets erupts into open swordplay in the public square. Prince Escalus intervenes and declares that the next man to disturb the peace will pay with his life. The ancient grudge, though officially checked, is left smouldering beneath the surface of the city.",
    phase: "Act I · Scene 1",
    timeIndex: 0,
    parentId: null,
    branchId: "canonical",
    canonical: true,
    probability: 0.95,
    emotionalValence: -0.55,
    uncertainty: 0.04,
    downstreamImpact: 62,
    charactersInvolved: ["Escalus", "Benvolio", "Tybalt"],
    whyItMatters:
      "Establishes the feud as the ambient danger that will later turn a private love into a public catastrophe.",
    worldState: [
      { key: "feud", value: "open violence in the streets, checked only by the Prince's threat" },
      { key: "romeo", value: "lovesick and withdrawn, pining for Rosaline" },
      { key: "juliet", value: "unwed, unaware of Romeo" },
    ],
    worldStateDiff: {
      added: [
        { key: "feud", value: "open violence in the streets, checked only by the Prince's threat" },
        { key: "romeo", value: "lovesick and withdrawn, pining for Rosaline" },
        { key: "juliet", value: "unwed, unaware of Romeo" },
      ],
    },
  },
  {
    id: "c1",
    title: "Romeo Attends the Capulet Feast",
    description:
      "Persuaded by Benvolio that other beauties will cure his infatuation with Rosaline, Romeo slips masked into his enemy's banquet. Old Capulet, in a generous humour, refuses to let Tybalt eject the intruder. The single reckless decision to cross an enemy's threshold sets everything in motion.",
    phase: "Act I · Scene 5",
    timeIndex: 1,
    parentId: "c0",
    branchId: "canonical",
    canonical: true,
    probability: 0.82,
    emotionalValence: 0.5,
    uncertainty: 0.09,
    downstreamImpact: 85,
    charactersInvolved: ["Romeo", "Benvolio", "Tybalt", "Capulet"],
    whyItMatters:
      "The hinge on which the whole tragedy swings: without this trespass the lovers never meet.",
    worldState: [
      { key: "feud", value: "smouldering beneath a fragile public peace" },
      { key: "romeo", value: "at the Capulet feast, masked and uninvited" },
      { key: "juliet", value: "present at her father's feast" },
      { key: "tybalt", value: "enraged at Romeo's intrusion, restrained by Capulet" },
    ],
    worldStateDiff: {
      changed: [
        { key: "romeo", value: "at the Capulet feast, masked and uninvited" },
        { key: "juliet", value: "present at her father's feast" },
      ],
      added: [{ key: "tybalt", value: "enraged at Romeo's intrusion, restrained by Capulet" }],
    },
  },
  {
    id: "c2",
    title: "Romeo Meets Juliet",
    description:
      "Across the crowded hall Romeo and Juliet find each other, and in a shared sonnet of pilgrims and saints they kiss before either learns the other's name. When the truth arrives — she a Capulet, he a Montague — the delight has already hardened into something that cannot be undone. Love and family have become the same wound.",
    phase: "Act I · Scene 5",
    timeIndex: 2,
    parentId: "c1",
    branchId: "canonical",
    canonical: true,
    probability: 0.8,
    emotionalValence: 0.75,
    uncertainty: 0.08,
    downstreamImpact: 80,
    charactersInvolved: ["Romeo", "Juliet", "Nurse"],
    whyItMatters:
      "Converts the abstract feud into a personal collision — the lovers now belong to enemy houses.",
    worldState: [
      { key: "feud", value: "smouldering beneath a fragile public peace" },
      { key: "romeo", value: "in love with Juliet, having forgotten Rosaline" },
      { key: "juliet", value: "in love with Romeo, aware he is a Montague" },
      { key: "tybalt", value: "nursing a grudge against Romeo" },
    ],
    worldStateDiff: {
      changed: [
        { key: "romeo", value: "in love with Juliet, having forgotten Rosaline" },
        { key: "juliet", value: "in love with Romeo, aware he is a Montague" },
        { key: "tybalt", value: "nursing a grudge against Romeo" },
      ],
    },
  },
  {
    id: "c3",
    title: "Balcony Scene",
    description:
      "Unable to leave, Romeo scales the orchard wall and overhears Juliet confessing her love to the night. What might have been a boy's fancy becomes a mutual vow, and by dawn they have resolved to marry in secret. The private world they build in that garden is set directly against the public world that forbids it.",
    phase: "Act II · Scene 2",
    timeIndex: 3,
    parentId: "c2",
    branchId: "canonical",
    canonical: true,
    probability: 0.85,
    emotionalValence: 0.8,
    uncertainty: 0.07,
    downstreamImpact: 66,
    charactersInvolved: ["Romeo", "Juliet"],
    whyItMatters:
      "Commits both lovers to a course of secrecy that will require deception, allies, and dangerous timing.",
    worldState: [
      { key: "feud", value: "smouldering beneath a fragile public peace" },
      { key: "romeo", value: "vowed to marry Juliet in secret" },
      { key: "juliet", value: "vowed to marry Romeo in secret" },
      { key: "marriage", value: "planned, to be arranged through Friar Laurence" },
    ],
    worldStateDiff: {
      changed: [
        { key: "romeo", value: "vowed to marry Juliet in secret" },
        { key: "juliet", value: "vowed to marry Romeo in secret" },
      ],
      added: [{ key: "marriage", value: "planned, to be arranged through Friar Laurence" }],
    },
  },
  {
    id: "c4",
    title: "Romeo and Juliet Secretly Marry",
    description:
      "Friar Laurence weds the two in his cell, hoping the union might at last turn the households' rancour to love. The sacrament binds the lovers beyond retreat and knots their fate to a plan no one else fully controls. What was reckless is now sacred, and irreversible.",
    phase: "Act II · Scene 6",
    timeIndex: 4,
    parentId: "c3",
    branchId: "canonical",
    canonical: true,
    probability: 0.88,
    emotionalValence: 0.6,
    uncertainty: 0.06,
    downstreamImpact: 58,
    charactersInvolved: ["Romeo", "Juliet", "Friar Laurence"],
    whyItMatters:
      "Makes the relationship binding and secret at once — every later crisis must now be managed by hidden channels.",
    worldState: [
      { key: "feud", value: "smouldering beneath a fragile public peace" },
      { key: "romeo", value: "secretly husband to a Capulet" },
      { key: "juliet", value: "secretly wife to a Montague" },
      { key: "marriage", value: "solemnised in secret by Friar Laurence" },
    ],
    worldStateDiff: {
      changed: [
        { key: "romeo", value: "secretly husband to a Capulet" },
        { key: "juliet", value: "secretly wife to a Montague" },
        { key: "marriage", value: "solemnised in secret by Friar Laurence" },
      ],
    },
  },
  {
    id: "c5",
    title: "Tybalt Kills Mercutio",
    description:
      "Tybalt, still smarting from the feast, seeks Romeo in the street; Romeo, now secretly his kinsman, refuses the quarrel. Mercutio, disgusted by such 'calm, dishonourable, vile submission', draws in Romeo's place and is stabbed under his friend's arm. 'A plague o' both your houses' turns the feud lethal once more.",
    phase: "Act III · Scene 1",
    timeIndex: 5,
    parentId: "c4",
    branchId: "canonical",
    canonical: true,
    probability: 0.78,
    emotionalValence: -0.8,
    uncertainty: 0.1,
    downstreamImpact: 78,
    charactersInvolved: ["Mercutio", "Tybalt", "Romeo", "Benvolio"],
    whyItMatters:
      "Breaks the peace irreparably and forces Romeo to choose between his new marriage and his oldest loyalty.",
    worldState: [
      { key: "feud", value: "reignited into lethal violence" },
      { key: "romeo", value: "grief-stricken and enraged by Mercutio's death" },
      { key: "juliet", value: "unaware of the street fight" },
      { key: "marriage", value: "solemnised in secret by Friar Laurence" },
      { key: "mercutio", value: "slain by Tybalt" },
    ],
    worldStateDiff: {
      changed: [
        { key: "feud", value: "reignited into lethal violence" },
        { key: "romeo", value: "grief-stricken and enraged by Mercutio's death" },
      ],
      added: [{ key: "mercutio", value: "slain by Tybalt" }],
    },
  },
  {
    id: "c6",
    title: "Romeo Kills Tybalt",
    description:
      "Blind with grief, Romeo abandons his restraint and cuts Tybalt down in revenge, then flees crying that he is 'fortune's fool'. In a single stroke the peacemaker becomes a killer and his marriage becomes a secret he can no longer protect. The Prince's edict now hangs directly over his head.",
    phase: "Act III · Scene 1",
    timeIndex: 6,
    parentId: "c5",
    branchId: "canonical",
    canonical: true,
    probability: 0.8,
    emotionalValence: -0.75,
    uncertainty: 0.09,
    downstreamImpact: 60,
    charactersInvolved: ["Romeo", "Tybalt", "Benvolio"],
    whyItMatters:
      "Triggers the banishment that physically separates the lovers and makes the desperate potion scheme necessary.",
    worldState: [
      { key: "feud", value: "at its bloodiest, two dead in one afternoon" },
      { key: "romeo", value: "a killer, fled from the scene" },
      { key: "juliet", value: "about to learn her cousin is dead by her husband's hand" },
      { key: "marriage", value: "solemnised in secret by Friar Laurence" },
      { key: "tybalt", value: "slain by Romeo in revenge" },
    ],
    worldStateDiff: {
      changed: [
        { key: "feud", value: "at its bloodiest, two dead in one afternoon" },
        { key: "romeo", value: "a killer, fled from the scene" },
      ],
      added: [{ key: "tybalt", value: "slain by Romeo in revenge" }],
    },
  },
  {
    id: "c7",
    title: "Romeo Is Banished",
    description:
      "Prince Escalus, weighing Mercutio's death against Tybalt's, spares Romeo's life but exiles him from Verona on pain of death. To the newly-wed Romeo, banishment is a fate crueller than execution — a living death away from Juliet. The marriage is now separated by a city wall and a royal decree.",
    phase: "Act III · Scene 1",
    timeIndex: 7,
    parentId: "c6",
    branchId: "canonical",
    canonical: true,
    probability: 0.9,
    emotionalValence: -0.7,
    uncertainty: 0.05,
    downstreamImpact: 70,
    charactersInvolved: ["Escalus", "Romeo", "Friar Laurence"],
    whyItMatters:
      "Removes Romeo from Verona, so that all further coordination must run through fragile, failable messages.",
    worldState: [
      { key: "feud", value: "at its bloodiest, two dead in one afternoon" },
      { key: "romeo", value: "banished to Mantua on pain of death" },
      { key: "juliet", value: "grieving Tybalt and dreading her husband's exile" },
      { key: "marriage", value: "intact but sundered by exile" },
      { key: "banishment", value: "Romeo exiled from Verona by the Prince" },
    ],
    worldStateDiff: {
      changed: [
        { key: "romeo", value: "banished to Mantua on pain of death" },
        { key: "juliet", value: "grieving Tybalt and dreading her husband's exile" },
        { key: "marriage", value: "intact but sundered by exile" },
      ],
      added: [{ key: "banishment", value: "Romeo exiled from Verona by the Prince" }],
    },
  },
  {
    id: "c8",
    title: "Juliet Takes the Potion",
    description:
      "Pressed by her father to marry Paris within days, Juliet turns to Friar Laurence, who gives her a draught to counterfeit death for forty-two hours. She is to be laid in the Capulet tomb and rescued there by Romeo, forewarned by letter. Terrified but resolute, she drinks alone, staking everything on a scheme of exact timing.",
    phase: "Act IV · Scene 3",
    timeIndex: 8,
    parentId: "c7",
    branchId: "canonical",
    canonical: true,
    probability: 0.82,
    emotionalValence: -0.5,
    uncertainty: 0.11,
    downstreamImpact: 88,
    charactersInvolved: ["Juliet", "Friar Laurence"],
    whyItMatters:
      "Introduces a plan whose success depends entirely on one message arriving on time — the story's most fragile dependency.",
    worldState: [
      { key: "feud", value: "quieted by mourning, unresolved" },
      { key: "romeo", value: "in exile at Mantua, uninformed of the plan" },
      { key: "juliet", value: "in a death-like trance, presumed dead" },
      { key: "marriage", value: "intact but sundered by exile" },
      { key: "potion", value: "sleeping draught taken; Juliet to wake in the tomb" },
      { key: "message", value: "Friar's letter dispatched to warn Romeo" },
    ],
    worldStateDiff: {
      changed: [{ key: "juliet", value: "in a death-like trance, presumed dead" }],
      added: [
        { key: "potion", value: "sleeping draught taken; Juliet to wake in the tomb" },
        { key: "message", value: "Friar's letter dispatched to warn Romeo" },
      ],
    },
  },
  {
    id: "c9",
    title: "The Message Fails to Reach Romeo",
    description:
      "Friar John, entrusted with the crucial letter, is quarantined in a plague-shut house and never rides to Mantua. The one thread on which the whole scheme hangs is cut by pure accident, and Romeo remains ignorant that Juliet's death is a fiction. Chance, not malice, seals the tragedy.",
    phase: "Act V · Scene 2",
    timeIndex: 9,
    parentId: "c8",
    branchId: "canonical",
    canonical: true,
    probability: 0.55,
    emotionalValence: -0.65,
    uncertainty: 0.12,
    downstreamImpact: 92,
    charactersInvolved: ["Friar John", "Friar Laurence"],
    whyItMatters:
      "The pivotal accident of the play: a low-probability failure with the highest downstream leverage of any event.",
    worldState: [
      { key: "feud", value: "quieted by mourning, unresolved" },
      { key: "romeo", value: "in exile, still believing nothing of the plan" },
      { key: "juliet", value: "in a death-like trance, presumed dead" },
      { key: "marriage", value: "intact but sundered by exile" },
      { key: "potion", value: "in effect; Juliet lies entombed alive" },
      { key: "message", value: "undelivered — Friar John quarantined by plague" },
    ],
    worldStateDiff: {
      changed: [{ key: "message", value: "undelivered — Friar John quarantined by plague" }],
    },
  },
  {
    id: "c10",
    title: "Romeo Believes Juliet Is Dead",
    description:
      "News of Juliet's death reaches Romeo through Balthasar before the Friar's truth ever can. Refusing to outlive her, Romeo buys poison from a starving apothecary and rides through the night to die at her side. He acts on perfect information that is perfectly wrong.",
    phase: "Act V · Scene 1",
    timeIndex: 10,
    parentId: "c9",
    branchId: "canonical",
    canonical: true,
    probability: 0.83,
    emotionalValence: -0.85,
    uncertainty: 0.08,
    downstreamImpact: 64,
    charactersInvolved: ["Romeo", "Balthasar", "Apothecary"],
    whyItMatters:
      "Romeo commits irrevocably to death based on false news, closing off any remaining window for rescue.",
    worldState: [
      { key: "feud", value: "quieted by mourning, unresolved" },
      { key: "romeo", value: "riding to the tomb with poison, believing Juliet dead" },
      { key: "juliet", value: "still entranced, hours from waking" },
      { key: "marriage", value: "intact but sundered by exile" },
      { key: "potion", value: "still in effect; Juliet not yet woken" },
      { key: "message", value: "undelivered — Friar John quarantined by plague" },
    ],
    worldStateDiff: {
      changed: [
        { key: "romeo", value: "riding to the tomb with poison, believing Juliet dead" },
      ],
    },
  },
  {
    id: "c11",
    title: "Both Lovers Die",
    description:
      "At the tomb Romeo drinks his poison moments before Juliet wakes to find him dead; she kisses his lips for a lingering trace of it, then takes his dagger to herself. Only over their bodies do Montague and Capulet, aghast, at last clasp hands. The reconciliation the feast could have begun in joy is bought instead with two young lives.",
    phase: "Act V · Scene 3",
    timeIndex: 11,
    parentId: "c10",
    branchId: "canonical",
    canonical: true,
    probability: 0.9,
    emotionalValence: -0.95,
    uncertainty: 0.05,
    downstreamImpact: 50,
    charactersInvolved: ["Romeo", "Juliet", "Friar Laurence", "Capulet", "Montague", "Escalus"],
    whyItMatters:
      "The tragic terminus: the deaths finally end the feud, at the exact cost the whole play warned against.",
    worldState: [
      { key: "feud", value: "ended at last over the lovers' graves" },
      { key: "romeo", value: "dead by poison in the Capulet tomb" },
      { key: "juliet", value: "dead by Romeo's dagger beside him" },
      { key: "marriage", value: "ended by the deaths of both spouses" },
      { key: "potion", value: "worn off too late" },
      { key: "message", value: "undelivered — its failure now revealed" },
    ],
    worldStateDiff: {
      changed: [
        { key: "feud", value: "ended at last over the lovers' graves" },
        { key: "romeo", value: "dead by poison in the Capulet tomb" },
        { key: "juliet", value: "dead by Romeo's dagger beside him" },
        { key: "marriage", value: "ended by the deaths of both spouses" },
      ],
    },
    terminal: true,
  },
];

// --- Branch A: "Romeo Never Attends the Feast" (source c0, lane -1) ---------

const branchNoFeastEvents: StoryEvent[] = [
  {
    id: "bnf0",
    title: "Romeo Broods at Home",
    description:
      "Benvolio's coaxing fails, and Romeo keeps to the sycamore grove, nursing his hopeless passion for Rosaline. The mask stays on its peg; the enemy's threshold goes uncrossed. His melancholy, left to itself, curdles into a long and private sulk.",
    phase: "Alt · Act I",
    timeIndex: 1,
    parentId: "c0",
    branchId: "b-no-feast",
    canonical: false,
    probability: 0.6,
    emotionalValence: -0.3,
    uncertainty: 0.25,
    downstreamImpact: 55,
    charactersInvolved: ["Romeo", "Benvolio"],
    whyItMatters:
      "Removes the single decision that ever brought the lovers into the same room.",
    worldState: [
      { key: "feud", value: "smouldering beneath a fragile public peace" },
      { key: "romeo", value: "at home, still pining for Rosaline" },
      { key: "juliet", value: "unwed, unaware Romeo exists" },
    ],
    worldStateDiff: {
      changed: [{ key: "romeo", value: "at home, still pining for Rosaline" }],
    },
  },
  {
    id: "bnf1",
    title: "The Lovers Never Meet",
    description:
      "Juliet is quietly courted toward the match with Paris while Romeo drifts through Verona unchanged. No sonnet is traded, no vow is made; the two most consequential strangers in the city stay strangers. The great collision simply never occurs.",
    phase: "Alt · Act I–II",
    timeIndex: 2,
    parentId: "bnf0",
    branchId: "b-no-feast",
    canonical: false,
    probability: 0.68,
    emotionalValence: -0.2,
    uncertainty: 0.3,
    downstreamImpact: 48,
    charactersInvolved: ["Romeo", "Juliet", "Paris"],
    whyItMatters:
      "Confirms the counterfactual: with no meeting there is no marriage and no chain of desperate schemes.",
    worldState: [
      { key: "feud", value: "smouldering beneath a fragile public peace" },
      { key: "romeo", value: "unattached, restless, aimless" },
      { key: "juliet", value: "being courted toward a match with Paris" },
      { key: "marriage", value: "none between Romeo and Juliet" },
    ],
    worldStateDiff: {
      changed: [
        { key: "romeo", value: "unattached, restless, aimless" },
        { key: "juliet", value: "being courted toward a match with Paris" },
      ],
      added: [{ key: "marriage", value: "none between Romeo and Juliet" }],
    },
  },
  {
    id: "bnf2",
    title: "The Feud Grinds On",
    description:
      "Without the shock of a shared tragedy to shame them, the Montagues and Capulets return to their habitual sniping and street scuffles. The Prince's edict holds off outright murder, but the grudge deepens year by year. Verona settles into a cold, chronic hostility.",
    phase: "Alt · Act III",
    timeIndex: 3,
    parentId: "bnf1",
    branchId: "b-no-feast",
    canonical: false,
    probability: 0.62,
    emotionalValence: -0.4,
    uncertainty: 0.35,
    downstreamImpact: 44,
    charactersInvolved: ["Montague", "Capulet", "Tybalt", "Escalus"],
    whyItMatters:
      "Shows that the feud's resolution in the canon was purchased only by the lovers' deaths — absent them, nothing heals.",
    worldState: [
      { key: "feud", value: "chronic and unresolved, hardening with time" },
      { key: "romeo", value: "unattached, drifting" },
      { key: "juliet", value: "resigned toward the Paris match" },
      { key: "marriage", value: "none between Romeo and Juliet" },
    ],
    worldStateDiff: {
      changed: [{ key: "feud", value: "chronic and unresolved, hardening with time" }],
    },
  },
  {
    id: "bnf3",
    title: "A Colder, Loveless Verona",
    description:
      "The years pass without catastrophe and without reconciliation. Juliet marries where she is told and Romeo forgets one face for another, while the two houses keep their distance and their disdain. No one dies for love here — but no peace is won by it either.",
    phase: "Alt · Epilogue",
    timeIndex: 4,
    parentId: "bnf2",
    branchId: "b-no-feast",
    canonical: false,
    probability: 0.58,
    emotionalValence: -0.35,
    uncertainty: 0.4,
    downstreamImpact: 30,
    charactersInvolved: ["Romeo", "Juliet", "Paris"],
    whyItMatters:
      "A quiet, bleak ending that trades tragedy for stagnation — survival without transformation.",
    worldState: [
      { key: "feud", value: "permanently frozen, never reconciled" },
      { key: "romeo", value: "alive, unremarkable, still unsettled" },
      { key: "juliet", value: "alive, married to Paris without love" },
      { key: "marriage", value: "Juliet wed to Paris; Romeo never her husband" },
    ],
    worldStateDiff: {
      changed: [
        { key: "feud", value: "permanently frozen, never reconciled" },
        { key: "romeo", value: "alive, unremarkable, still unsettled" },
        { key: "juliet", value: "alive, married to Paris without love" },
        { key: "marriage", value: "Juliet wed to Paris; Romeo never her husband" },
      ],
    },
    terminal: true,
  },
];

// --- Branch B: "Mercutio Survives" (source c5, lane 1) ----------------------

const branchMercutioEvents: StoryEvent[] = [
  {
    id: "bmc0",
    title: "Benvolio Breaks the Duel",
    description:
      "As Tybalt's blade darts beneath Romeo's arm, Benvolio and the Watch wrench the brawlers apart a heartbeat too soon for a killing thrust. Mercutio takes a shallow wound to the shoulder and a deeper one to his pride, but he lives. The street clears with no corpse upon it.",
    phase: "Alt · Act III",
    timeIndex: 6,
    parentId: "c5",
    branchId: "b-mercutio",
    canonical: false,
    probability: 0.55,
    emotionalValence: -0.1,
    uncertainty: 0.35,
    downstreamImpact: 72,
    charactersInvolved: ["Benvolio", "Mercutio", "Tybalt", "Romeo"],
    whyItMatters:
      "Removes the death that in canon forced Romeo to kill and be banished — the whole downstream cascade is defused.",
    worldState: [
      { key: "feud", value: "flared but bloodless, barely contained" },
      { key: "romeo", value: "shaken but restrained, still in Verona" },
      { key: "juliet", value: "unaware of the near-disaster" },
      { key: "marriage", value: "solemnised in secret by Friar Laurence" },
      { key: "mercutio", value: "wounded but alive" },
    ],
    worldStateDiff: {
      changed: [
        { key: "feud", value: "flared but bloodless, barely contained" },
        { key: "romeo", value: "shaken but restrained, still in Verona" },
      ],
      added: [{ key: "mercutio", value: "wounded but alive" }],
    },
  },
  {
    id: "bmc1",
    title: "Tybalt Shamed, Not Slain",
    description:
      "Hauled before the Prince, Tybalt is bound over to keep the peace and publicly disgraced for drawing after the edict. Robbed of his duel and his dignity, he seethes but dares not strike again. Romeo, having spilled no blood, faces no charge.",
    phase: "Alt · Act III",
    timeIndex: 7,
    parentId: "bmc0",
    branchId: "b-mercutio",
    canonical: false,
    probability: 0.58,
    emotionalValence: 0.05,
    uncertainty: 0.4,
    downstreamImpact: 60,
    charactersInvolved: ["Tybalt", "Escalus", "Romeo"],
    whyItMatters:
      "Keeps Romeo innocent before the law, so no banishment ever separates the lovers.",
    worldState: [
      { key: "feud", value: "checked by the Prince, tense but quiet" },
      { key: "romeo", value: "at liberty, uncharged, still in Verona" },
      { key: "juliet", value: "secretly wed, her husband safe nearby" },
      { key: "marriage", value: "solemnised in secret by Friar Laurence" },
      { key: "mercutio", value: "recovering from his wound" },
      { key: "tybalt", value: "shamed and bound to keep the peace" },
    ],
    worldStateDiff: {
      changed: [
        { key: "feud", value: "checked by the Prince, tense but quiet" },
        { key: "romeo", value: "at liberty, uncharged, still in Verona" },
        { key: "mercutio", value: "recovering from his wound" },
      ],
      added: [{ key: "tybalt", value: "shamed and bound to keep the peace" }],
    },
  },
  {
    id: "bmc2",
    title: "No Banishment for Romeo",
    description:
      "With no killing to answer for, Romeo remains in Verona and at Juliet's side. The frantic machinery of the sleeping potion and the ill-fated letter never need be built. For the first time the lovers have what they most lacked: time.",
    phase: "Alt · Act IV",
    timeIndex: 8,
    parentId: "bmc1",
    branchId: "b-mercutio",
    canonical: false,
    probability: 0.6,
    emotionalValence: 0.3,
    uncertainty: 0.4,
    downstreamImpact: 54,
    charactersInvolved: ["Romeo", "Juliet", "Friar Laurence"],
    whyItMatters:
      "Time and proximity replace the desperate improvisations that doomed the canonical lovers.",
    worldState: [
      { key: "feud", value: "checked by the Prince, tense but quiet" },
      { key: "romeo", value: "in Verona, married and unpunished" },
      { key: "juliet", value: "secretly wed, her husband close at hand" },
      { key: "marriage", value: "secret but stable" },
      { key: "banishment", value: "none — Romeo never exiled" },
    ],
    worldStateDiff: {
      changed: [
        { key: "romeo", value: "in Verona, married and unpunished" },
        { key: "marriage", value: "secret but stable" },
      ],
      added: [{ key: "banishment", value: "none — Romeo never exiled" }],
    },
  },
  {
    id: "bmc3",
    title: "Romeo Brokers a Fragile Truce",
    description:
      "Using his secret bond to both houses, Romeo works quietly through Friar Laurence and Benvolio to cool the worst of the old grievances. Concessions are grudging and trust is thin, but the swords stay sheathed. A living peacemaker proves more useful than a martyr.",
    phase: "Alt · Act IV–V",
    timeIndex: 9,
    parentId: "bmc2",
    branchId: "b-mercutio",
    canonical: false,
    probability: 0.5,
    emotionalValence: 0.4,
    uncertainty: 0.45,
    downstreamImpact: 46,
    charactersInvolved: ["Romeo", "Friar Laurence", "Benvolio", "Capulet"],
    whyItMatters:
      "Turns the marriage into a bridge between the houses rather than a hidden fault line.",
    worldState: [
      { key: "feud", value: "cooling under a brokered, fragile truce" },
      { key: "romeo", value: "quiet intermediary between the houses" },
      { key: "juliet", value: "hopeful the marriage may be owned openly" },
      { key: "marriage", value: "secret, edging toward disclosure" },
    ],
    worldStateDiff: {
      changed: [
        { key: "feud", value: "cooling under a brokered, fragile truce" },
        { key: "romeo", value: "quiet intermediary between the houses" },
        { key: "juliet", value: "hopeful the marriage may be owned openly" },
        { key: "marriage", value: "secret, edging toward disclosure" },
      ],
    },
  },
  {
    id: "bmc4",
    title: "A Tense but Living Peace",
    description:
      "The marriage is revealed at last, and the households — spared the horror of their children's deaths — accept it with clenched teeth. The truce is uneasy and the old wounds ache, but Verona keeps its lovers and its heirs. Peace here is a hard, ongoing labour rather than a graveside epiphany.",
    phase: "Alt · Epilogue",
    timeIndex: 10,
    parentId: "bmc3",
    branchId: "b-mercutio",
    canonical: false,
    probability: 0.48,
    emotionalValence: 0.5,
    uncertainty: 0.5,
    downstreamImpact: 34,
    charactersInvolved: ["Romeo", "Juliet", "Capulet", "Montague", "Mercutio"],
    whyItMatters:
      "A bittersweet survival: reconciliation won by patience instead of catastrophe.",
    worldState: [
      { key: "feud", value: "suspended by an uneasy, living peace" },
      { key: "romeo", value: "alive, openly Juliet's husband" },
      { key: "juliet", value: "alive, openly Romeo's wife" },
      { key: "marriage", value: "acknowledged, if grudgingly, by both houses" },
      { key: "mercutio", value: "alive and healed" },
    ],
    worldStateDiff: {
      changed: [
        { key: "feud", value: "suspended by an uneasy, living peace" },
        { key: "romeo", value: "alive, openly Juliet's husband" },
        { key: "juliet", value: "alive, openly Romeo's wife" },
        { key: "marriage", value: "acknowledged, if grudgingly, by both houses" },
      ],
    },
    terminal: true,
  },
];

// --- Branch C: "The Message Reaches Romeo" (source c8, lane 2) --------------

const branchMessageEvents: StoryEvent[] = [
  {
    id: "bmg0",
    title: "The Letter Finds Romeo",
    description:
      "Friar John rides clear of the plague-shut houses and reaches Mantua in time; Romeo reads, in the Friar's own hand, that Juliet only sleeps. Grief turns to careful hope in an instant. Armed with the truth, he plans not a death but a rescue.",
    phase: "Alt · Act V",
    timeIndex: 9,
    parentId: "c8",
    branchId: "b-message",
    canonical: false,
    probability: 0.62,
    emotionalValence: 0.2,
    uncertainty: 0.28,
    downstreamImpact: 80,
    charactersInvolved: ["Romeo", "Friar John", "Friar Laurence"],
    whyItMatters:
      "Repairs the single accident that doomed the canon — Romeo now acts on true information.",
    worldState: [
      { key: "feud", value: "quieted by mourning, unresolved" },
      { key: "romeo", value: "in Mantua, warned that Juliet lives" },
      { key: "juliet", value: "in a death-like trance, soon to wake" },
      { key: "marriage", value: "intact but sundered by exile" },
      { key: "potion", value: "in effect; Juliet to wake in the tomb" },
      { key: "message", value: "delivered — Romeo knows the plan" },
    ],
    worldStateDiff: {
      changed: [
        { key: "romeo", value: "in Mantua, warned that Juliet lives" },
        { key: "message", value: "delivered — Romeo knows the plan" },
      ],
    },
  },
  {
    id: "bmg1",
    title: "Romeo Waits at the Tomb",
    description:
      "Instead of buying poison from an apothecary, Romeo steals back to Verona and keeps a quiet vigil at the Capulet vault. He counts the hours the Friar named, steadying himself against every impulse toward despair. Patience, not the dagger, becomes his instrument.",
    phase: "Alt · Act V",
    timeIndex: 10,
    parentId: "bmg0",
    branchId: "b-message",
    canonical: false,
    probability: 0.6,
    emotionalValence: 0.15,
    uncertainty: 0.3,
    downstreamImpact: 58,
    charactersInvolved: ["Romeo", "Friar Laurence"],
    whyItMatters:
      "Substitutes waiting for the fatal haste that killed the canonical Romeo.",
    worldState: [
      { key: "feud", value: "quieted by mourning, unresolved" },
      { key: "romeo", value: "keeping vigil at the tomb, alive and hopeful" },
      { key: "juliet", value: "entranced, hours from waking" },
      { key: "marriage", value: "intact, its rescue underway" },
      { key: "potion", value: "wearing off on schedule" },
      { key: "message", value: "delivered — Romeo knows the plan" },
    ],
    worldStateDiff: {
      changed: [
        { key: "romeo", value: "keeping vigil at the tomb, alive and hopeful" },
        { key: "marriage", value: "intact, its rescue underway" },
        { key: "potion", value: "wearing off on schedule" },
      ],
    },
  },
  {
    id: "bmg2",
    title: "Juliet Wakes to a Living Romeo",
    description:
      "The draught releases her at the appointed hour, and Juliet opens her eyes not to a corpse but to her husband's living face. The scheme has worked exactly as the Friar drew it. For one trembling moment, the tragedy is simply cancelled.",
    phase: "Alt · Act V",
    timeIndex: 11,
    parentId: "bmg1",
    branchId: "b-message",
    canonical: false,
    probability: 0.66,
    emotionalValence: 0.7,
    uncertainty: 0.25,
    downstreamImpact: 50,
    charactersInvolved: ["Romeo", "Juliet", "Friar Laurence"],
    whyItMatters:
      "The exact inversion of the canonical tomb scene — the timing that failed now succeeds.",
    worldState: [
      { key: "feud", value: "quieted by mourning, unresolved" },
      { key: "romeo", value: "alive, reunited with Juliet" },
      { key: "juliet", value: "awake and alive, reunited with Romeo" },
      { key: "marriage", value: "intact and both spouses living" },
      { key: "potion", value: "worn off safely, on time" },
      { key: "message", value: "delivered — the plan succeeded" },
    ],
    worldStateDiff: {
      changed: [
        { key: "romeo", value: "alive, reunited with Juliet" },
        { key: "juliet", value: "awake and alive, reunited with Romeo" },
        { key: "marriage", value: "intact and both spouses living" },
        { key: "potion", value: "worn off safely, on time" },
      ],
    },
  },
  {
    id: "bmg3",
    title: "An Uneasy Reconciliation",
    description:
      "The lovers reveal themselves to their families, who — confronted with how nearly they buried their own children — recoil from the feud at last. There is no grand embrace over graves, only two shaken houses choosing, warily, to try. It is a bittersweet survival, peace glimpsed through the shadow of the tragedy that almost was.",
    phase: "Alt · Epilogue",
    timeIndex: 12,
    parentId: "bmg2",
    branchId: "b-message",
    canonical: false,
    probability: 0.55,
    emotionalValence: 0.55,
    uncertainty: 0.32,
    downstreamImpact: 36,
    charactersInvolved: ["Romeo", "Juliet", "Capulet", "Montague", "Escalus", "Friar Laurence"],
    whyItMatters:
      "Achieves the play's longed-for reconciliation without the price of the lovers' lives.",
    worldState: [
      { key: "feud", value: "shocked toward an uneasy reconciliation" },
      { key: "romeo", value: "alive, openly Juliet's husband" },
      { key: "juliet", value: "alive, openly Romeo's wife" },
      { key: "marriage", value: "revealed and, warily, accepted" },
      { key: "potion", value: "a danger safely past" },
      { key: "message", value: "delivered — the tragedy averted" },
    ],
    worldStateDiff: {
      changed: [
        { key: "feud", value: "shocked toward an uneasy reconciliation" },
        { key: "romeo", value: "alive, openly Juliet's husband" },
        { key: "juliet", value: "alive, openly Romeo's wife" },
        { key: "marriage", value: "revealed and, warily, accepted" },
      ],
    },
    terminal: true,
  },
];

// --- Branch metadata -------------------------------------------------------

const seededBranches: Branch[] = [
  {
    id: "canonical",
    label: "Canonical",
    canonical: true,
    sourceNodeId: null,
    premise: "The play as Shakespeare wrote it.",
    plausibility: "faithful",
    lane: 0,
    createdOrder: -1,
  },
  {
    id: "b-no-feast",
    label: "Romeo Never Attends the Feast",
    canonical: false,
    sourceNodeId: "c0",
    premise: "Romeo never attends the Capulet feast",
    plausibility: "balanced",
    lane: -1,
    createdOrder: 0,
  },
  {
    id: "b-mercutio",
    label: "Mercutio Survives",
    canonical: false,
    sourceNodeId: "c5",
    premise: "Mercutio survives the duel with Tybalt",
    plausibility: "balanced",
    lane: 1,
    createdOrder: 1,
  },
  {
    id: "b-message",
    label: "The Message Reaches Romeo",
    canonical: false,
    sourceNodeId: "c8",
    premise: "the Friar's message reaches Romeo in time",
    plausibility: "faithful",
    lane: 2,
    createdOrder: 2,
  },
];

// --- Assembled story -------------------------------------------------------

export const romeoAndJuliet: Story = {
  id: "romeo-and-juliet",
  title: "Romeo and Juliet",
  author: "William Shakespeare",
  blurb:
    "A tragedy of chance and haste: two young lovers from feuding houses of Verona, and the fragile chain of decisions and accidents that carries them to the tomb. Reroll any event to simulate the story that might have been.",
  events: [
    ...canonicalEvents,
    ...branchNoFeastEvents,
    ...branchMercutioEvents,
    ...branchMessageEvents,
  ],
  branches: seededBranches,
};

export const stories: Record<string, Story> = {
  "romeo-and-juliet": romeoAndJuliet,
};

export const storyList: { id: string; title: string; author: string }[] = [
  { id: "romeo-and-juliet", title: "Romeo and Juliet", author: "William Shakespeare" },
];
