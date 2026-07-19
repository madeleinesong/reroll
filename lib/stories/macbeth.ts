// ---------------------------------------------------------------------------
// reroll — Macbeth story data
//
// One canonical spine of 12 events (m0..m11) plus three authored counterfactual
// branches, each rooted in a single changed premise. Metrics are hand-tuned for
// internal consistency: probability tracks causal inevitability, valence tracks
// the darkening mood, uncertainty stays low on canon, and downstreamImpact marks
// the true leverage points — the prophecy on the heath and Fleance's escape.
// ---------------------------------------------------------------------------

import type { Branch, Story, StoryEvent } from "@/lib/types";

// --- Canonical spine -------------------------------------------------------

const canonicalEvents: StoryEvent[] = [
  {
    id: "m0",
    title: "The Witches Hail Macbeth",
    description:
      "Returning bloodied from victory, Macbeth and Banquo meet three weird sisters on the blasted heath. They hail Macbeth as Thane of Cawdor and king hereafter, and promise Banquo a line of kings though he shall wear no crown. The words are gone on the wind before either man can seize them, but the poison is already in the blood.",
    phase: "Act I · Scene 3",
    timeIndex: 0,
    parentId: null,
    branchId: "canonical",
    canonical: true,
    probability: 0.55,
    emotionalValence: -0.2,
    uncertainty: 0.09,
    downstreamImpact: 92,
    charactersInvolved: ["Macbeth", "Banquo", "The Weird Sisters"],
    whyItMatters:
      "The single seed of the whole tragedy: a chance meeting that plants ambition where before there was only loyalty.",
    worldState: [
      { key: "PROPHECY", value: "witches foretell Macbeth king hereafter, and Banquo the father of kings" },
      { key: "THRONE", value: "held securely by King Duncan of Scotland" },
      { key: "MACBETH", value: "victorious general, his ambition freshly kindled" },
      { key: "BANQUO", value: "fellow captain, told his heirs and not himself shall reign" },
    ],
    worldStateDiff: {
      added: [
        { key: "PROPHECY", value: "witches foretell Macbeth king hereafter, and Banquo the father of kings" },
        { key: "THRONE", value: "held securely by King Duncan of Scotland" },
        { key: "MACBETH", value: "victorious general, his ambition freshly kindled" },
        { key: "BANQUO", value: "fellow captain, told his heirs and not himself shall reign" },
      ],
    },
    perturbations: [
      { label: "The witches stay silent", premise: "Macbeth and Banquo cross the heath and meet no one; no prophecy is ever spoken." },
      { label: "Banquo hears his fate first", premise: "The witches hail Banquo as father of kings before they name Macbeth, and it is Banquo whom ambition seizes." },
      { label: "Macbeth demands the method", premise: "Macbeth forces the sisters to say how he will be king, and they name the murder outright." },
    ],
  },
  {
    id: "m1",
    title: "Duncan Names Malcolm as Heir",
    description:
      "Grateful for the day's victory, King Duncan proclaims his son Malcolm the Prince of Cumberland, next in line to the throne. Macbeth, freshly made Thane of Cawdor exactly as the witches foretold, now sees a boy set squarely across his path. The prophecy has begun to come true, and its remainder suddenly demands a crime.",
    phase: "Act I · Scene 4",
    timeIndex: 1,
    parentId: "m0",
    branchId: "canonical",
    canonical: true,
    probability: 0.9,
    emotionalValence: -0.3,
    uncertainty: 0.05,
    downstreamImpact: 72,
    charactersInvolved: ["Duncan", "Malcolm", "Macbeth"],
    whyItMatters:
      "Turns a vague promise into a concrete obstacle — the crown will not simply fall to Macbeth; a person now stands between.",
    worldState: [
      { key: "PROPHECY", value: "witches foretell Macbeth king hereafter, and Banquo the father of kings" },
      { key: "THRONE", value: "Duncan reigns; Malcolm now named Prince of Cumberland and heir" },
      { key: "MACBETH", value: "eyes the crown, the named heir now an obstacle in his path" },
      { key: "BANQUO", value: "fellow captain, told his heirs and not himself shall reign" },
    ],
    worldStateDiff: {
      changed: [
        { key: "THRONE", value: "Duncan reigns; Malcolm now named Prince of Cumberland and heir" },
        { key: "MACBETH", value: "eyes the crown, the named heir now an obstacle in his path" },
      ],
    },
    perturbations: [
      { label: "Duncan names Macbeth heir", premise: "Grateful for the victory, Duncan proclaims Macbeth Prince of Cumberland instead of Malcolm." },
      { label: "Malcolm declines the honour", premise: "Malcolm, uneasy with power, asks his father to pass the succession to a seasoned soldier." },
      { label: "Duncan names no heir", premise: "Duncan leaves the succession open, and no single obstacle stands between Macbeth and the crown." },
    ],
  },
  {
    id: "m2",
    title: "Lady Macbeth Reads the Letter",
    description:
      "Macbeth's letter reaches his wife before he does, and in it the whole of the prophecy. She fears his nature is too full of the milk of human kindness to catch the nearest way, and calls on spirits to unsex her and fill her with cruelty. By the time she folds the page, the murder is already decided in her heart.",
    phase: "Act I · Scene 5",
    timeIndex: 2,
    parentId: "m1",
    branchId: "canonical",
    canonical: true,
    probability: 0.86,
    emotionalValence: -0.45,
    uncertainty: 0.07,
    downstreamImpact: 80,
    charactersInvolved: ["Lady Macbeth", "Macbeth"],
    whyItMatters:
      "Supplies the resolve Macbeth lacks; the crime becomes possible only because her will is harder than his.",
    worldState: [
      { key: "PROPHECY", value: "witches foretell Macbeth king hereafter, and Banquo the father of kings" },
      { key: "THRONE", value: "Duncan reigns; Malcolm now named Prince of Cumberland and heir" },
      { key: "MACBETH", value: "expected home, his wife already plotting in his name" },
      { key: "BANQUO", value: "fellow captain, told his heirs and not himself shall reign" },
      { key: "LADY", value: "reads the letter, calls on spirits to unsex her, resolved to kill Duncan" },
    ],
    worldStateDiff: {
      changed: [
        { key: "MACBETH", value: "expected home, his wife already plotting in his name" },
      ],
      added: [
        { key: "LADY", value: "reads the letter, calls on spirits to unsex her, resolved to kill Duncan" },
      ],
    },
    perturbations: [
      { label: "Lady Macbeth burns the letter", premise: "Fearing what it will wake in them both, Lady Macbeth throws the letter on the fire and says nothing." },
      { label: "The letter never arrives", premise: "Macbeth's letter is lost on the road, and his wife learns of the prophecy only after he comes home changed." },
      { label: "She resolves to warn the King", premise: "Reading the prophecy as a warning, Lady Macbeth resolves to guard Duncan rather than kill him." },
    ],
  },
  {
    id: "m3",
    title: "Macbeth Wavers; Lady Macbeth Prevails",
    description:
      "On the night of the murder Macbeth balks — 'we will proceed no further in this business' — weighed down by duty, kinship, and dread of the deed. His wife rounds on him, shaming his manhood and swearing she would dash out her own infant's brains sooner than break such a vow. He bends. She screws his courage to the sticking-place, and the plan is laid.",
    phase: "Act I · Scene 7",
    timeIndex: 3,
    parentId: "m2",
    branchId: "canonical",
    canonical: true,
    probability: 0.7,
    emotionalValence: -0.5,
    uncertainty: 0.1,
    downstreamImpact: 88,
    charactersInvolved: ["Macbeth", "Lady Macbeth"],
    whyItMatters:
      "The last true fork before blood is shed — a single conversation decides whether the murder happens at all.",
    worldState: [
      { key: "PROPHECY", value: "witches foretell Macbeth king hereafter, and Banquo the father of kings" },
      { key: "THRONE", value: "Duncan reigns; Malcolm now named Prince of Cumberland and heir" },
      { key: "MACBETH", value: "wavering doubts overborne, steeled at last to the deed" },
      { key: "BANQUO", value: "fellow captain, told his heirs and not himself shall reign" },
      { key: "LADY", value: "has screwed his courage to the sticking-place; the plan is laid" },
    ],
    worldStateDiff: {
      changed: [
        { key: "MACBETH", value: "wavering doubts overborne, steeled at last to the deed" },
        { key: "LADY", value: "has screwed his courage to the sticking-place; the plan is laid" },
      ],
    },
    perturbations: [
      { label: "Lady Macbeth relents", premise: "When Macbeth says 'we will proceed no further', his wife agrees and lets the matter drop." },
      { label: "Duncan leaves early", premise: "The King departs Inverness at nightfall, and the chance to kill him under Macbeth's roof simply passes." },
      { label: "Macbeth confesses to Banquo", premise: "Torn by doubt, Macbeth tells Banquo what he is tempted to do and begs him to hold him to his honour." },
    ],
  },
  {
    id: "m4",
    title: "The Murder of King Duncan",
    description:
      "In the dead of night Macbeth steals into the guest chamber and stabs the sleeping king, then stumbles back appalled, hands drenched, unable to say 'Amen'. He hears a voice cry that Macbeth has murdered sleep and will sleep no more. His wife takes the daggers from his shaking hands to smear the grooms, certain a little water will clear them of the deed.",
    phase: "Act II · Scene 2",
    timeIndex: 4,
    parentId: "m3",
    branchId: "canonical",
    canonical: true,
    probability: 0.85,
    emotionalValence: -0.85,
    uncertainty: 0.06,
    downstreamImpact: 90,
    charactersInvolved: ["Macbeth", "Lady Macbeth", "Duncan"],
    whyItMatters:
      "The irreversible act — every later horror is a consequence of the moment the knife goes in.",
    worldState: [
      { key: "PROPHECY", value: "witches foretell Macbeth king hereafter, and Banquo the father of kings" },
      { key: "THRONE", value: "Duncan murdered in his bed at Inverness" },
      { key: "MACBETH", value: "a regicide, hands bloodied, hearing voices cry 'sleep no more'" },
      { key: "BANQUO", value: "fellow captain, told his heirs and not himself shall reign" },
      { key: "LADY", value: "returned the daggers, sure 'a little water clears us of this deed'" },
      { key: "GUILT", value: "blood that will not wash — 'Macbeth does murder sleep'" },
    ],
    worldStateDiff: {
      changed: [
        { key: "THRONE", value: "Duncan murdered in his bed at Inverness" },
        { key: "MACBETH", value: "a regicide, hands bloodied, hearing voices cry 'sleep no more'" },
        { key: "LADY", value: "returned the daggers, sure 'a little water clears us of this deed'" },
      ],
      added: [
        { key: "GUILT", value: "blood that will not wash — 'Macbeth does murder sleep'" },
      ],
    },
    perturbations: [
      { label: "The grooms wake", premise: "The drugged guards stir as Macbeth enters, and he flees the chamber with the deed undone." },
      { label: "Macbeth cannot strike", premise: "Standing over the sleeping king, Macbeth finds he cannot bring the dagger down and creeps away." },
      { label: "Lady Macbeth does it herself", premise: "Duncan no longer resembles her father; Lady Macbeth takes the daggers and kills the King with her own hand." },
    ],
  },
  {
    id: "m5",
    title: "The Princes Flee; Macbeth Is Crowned",
    description:
      "When the murder is discovered, Malcolm and Donalbain fear the same knife and flee to England and Ireland — a flight that lets suspicion fall on them instead. With the heirs gone and the grooms conveniently slain, Macbeth is hailed king and invested at Scone. The first half of the prophecy is fulfilled; the crown sits on a murderer's head.",
    phase: "Act II · Scene 4",
    timeIndex: 5,
    parentId: "m4",
    branchId: "canonical",
    canonical: true,
    probability: 0.88,
    emotionalValence: -0.4,
    uncertainty: 0.06,
    downstreamImpact: 58,
    charactersInvolved: ["Macbeth", "Malcolm", "Donalbain", "Macduff"],
    whyItMatters:
      "The prize is won, and with it the fear of losing it — the reign begins already poisoned by suspicion.",
    worldState: [
      { key: "PROPHECY", value: "first saw fulfilled — Macbeth is king; Banquo's promised line still looms" },
      { key: "THRONE", value: "seized — Macbeth crowned at Scone; Malcolm and Donalbain fled" },
      { key: "MACBETH", value: "king in name, hollow and already afraid" },
      { key: "BANQUO", value: "fellow captain, told his heirs and not himself shall reign" },
      { key: "LADY", value: "returned the daggers, sure 'a little water clears us of this deed'" },
      { key: "GUILT", value: "blood that will not wash — 'Macbeth does murder sleep'" },
    ],
    worldStateDiff: {
      changed: [
        { key: "PROPHECY", value: "first saw fulfilled — Macbeth is king; Banquo's promised line still looms" },
        { key: "THRONE", value: "seized — Macbeth crowned at Scone; Malcolm and Donalbain fled" },
        { key: "MACBETH", value: "king in name, hollow and already afraid" },
      ],
    },
    perturbations: [
      { label: "The princes stay and accuse", premise: "Malcolm and Donalbain remain in Scotland and openly accuse Macbeth, splitting the thanes into factions." },
      { label: "The thanes reject Macbeth", premise: "Suspicious of the swift crowning, the nobles refuse Macbeth and call for an inquiry into Duncan's death." },
      { label: "Macbeth refuses the crown", premise: "Sickened by what he has done, Macbeth declines the throne and it passes to a distant kinsman." },
    ],
  },
  {
    id: "m6",
    title: "Macbeth Has Banquo Murdered",
    description:
      "Haunted by the promise that Banquo's sons will reign, Macbeth hires assassins to cut down his old friend and the boy Fleance on the road to a royal feast. The men fall on them in the dark and Banquo dies bidding his son to fly and revenge — and Fleance flies. The one thing Macbeth most needed to kill escapes into the night.",
    phase: "Act III · Scene 3",
    timeIndex: 6,
    parentId: "m5",
    branchId: "canonical",
    canonical: true,
    probability: 0.5,
    emotionalValence: -0.7,
    uncertainty: 0.12,
    downstreamImpact: 84,
    charactersInvolved: ["Macbeth", "Banquo", "Fleance", "The Murderers"],
    whyItMatters:
      "The reign's second hinge: Fleance's escape means Banquo's line survives, and the prophecy against Macbeth remains alive.",
    worldState: [
      { key: "PROPHECY", value: "first saw fulfilled — Macbeth is king; Banquo's promised line still looms" },
      { key: "THRONE", value: "seized — Macbeth crowned at Scone; Malcolm and Donalbain fled" },
      { key: "MACBETH", value: "paranoid, safe in nothing while Banquo's blood survives" },
      { key: "BANQUO", value: "murdered by Macbeth's hired men on the road to the feast" },
      { key: "LADY", value: "returned the daggers, sure 'a little water clears us of this deed'" },
      { key: "GUILT", value: "blood that will not wash — 'Macbeth does murder sleep'" },
      { key: "FLEANCE", value: "Banquo's son, escaped into the dark — the line survives" },
    ],
    worldStateDiff: {
      changed: [
        { key: "MACBETH", value: "paranoid, safe in nothing while Banquo's blood survives" },
        { key: "BANQUO", value: "murdered by Macbeth's hired men on the road to the feast" },
      ],
      added: [
        { key: "FLEANCE", value: "Banquo's son, escaped into the dark — the line survives" },
      ],
    },
    perturbations: [
      { label: "Macbeth spares Banquo", premise: "Macbeth cannot bring himself to murder his friend and lets Banquo and Fleance ride on unharmed." },
      { label: "Banquo fights free", premise: "Banquo cuts down the hired murderers and rides back to Forres to denounce the King." },
      { label: "Fleance is captured", premise: "The murderers take Fleance alive and bring him to Macbeth as a hostage against the prophecy." },
    ],
  },
  {
    id: "m7",
    title: "Banquo's Ghost at the Banquet",
    description:
      "At his own coronation feast Macbeth finds his seat taken by the blood-boltered ghost of Banquo, visible to him alone. He raves and cowers before the empty stool while the thanes look on in alarm, and Lady Macbeth strains to explain away his fit. The king's guilt has broken through the surface in front of the whole court.",
    phase: "Act III · Scene 4",
    timeIndex: 7,
    parentId: "m6",
    branchId: "canonical",
    canonical: true,
    probability: 0.8,
    emotionalValence: -0.75,
    uncertainty: 0.09,
    downstreamImpact: 55,
    charactersInvolved: ["Macbeth", "Lady Macbeth", "Banquo", "The Thanes"],
    whyItMatters:
      "Macbeth's public unravelling seeds the thanes' distrust, beginning the slow turn of Scotland against him.",
    worldState: [
      { key: "PROPHECY", value: "first saw fulfilled — Macbeth is king; Banquo's promised line still looms" },
      { key: "THRONE", value: "seized — Macbeth crowned at Scone; Malcolm and Donalbain fled" },
      { key: "MACBETH", value: "unmanned before his court by a ghost only he can see" },
      { key: "BANQUO", value: "returned as a gory ghost to Macbeth's banquet" },
      { key: "LADY", value: "covering for her unravelling husband before the frightened thanes" },
      { key: "GUILT", value: "blood that will not wash — 'Macbeth does murder sleep'" },
      { key: "SUSPICION", value: "the thanes murmur; Macbeth's grip on them visibly slipping" },
    ],
    worldStateDiff: {
      changed: [
        { key: "MACBETH", value: "unmanned before his court by a ghost only he can see" },
        { key: "BANQUO", value: "returned as a gory ghost to Macbeth's banquet" },
        { key: "LADY", value: "covering for her unravelling husband before the frightened thanes" },
      ],
      added: [
        { key: "SUSPICION", value: "the thanes murmur; Macbeth's grip on them visibly slipping" },
      ],
      removed: ["FLEANCE"],
    },
    perturbations: [
      { label: "No ghost appears", premise: "Banquo's ghost never comes to the feast, and Macbeth holds his composure before the thanes." },
      { label: "Macbeth confesses at the table", premise: "Undone by the apparition, Macbeth cries out his guilt aloud before all the assembled lords." },
      { label: "The whole hall sees it", premise: "The ghost is visible to every guest, and the thanes turn on Macbeth as a murderer on the spot." },
    ],
  },
  {
    id: "m8",
    title: "The Apparitions' Second Prophecy",
    description:
      "Macbeth returns to the witches and is shown three apparitions: beware Macduff; none of woman born shall harm him; he is safe until Birnam Wood comes to Dunsinane. He reads the last two as promises of invincibility and the first as reason to strike. Comforted by riddles he does not understand, he grows reckless and cruel.",
    phase: "Act IV · Scene 1",
    timeIndex: 8,
    parentId: "m7",
    branchId: "canonical",
    canonical: true,
    probability: 0.85,
    emotionalValence: -0.5,
    uncertainty: 0.08,
    downstreamImpact: 76,
    charactersInvolved: ["Macbeth", "The Weird Sisters", "Macduff"],
    whyItMatters:
      "The false security of the riddles is what drives Macbeth to the atrocity that creates his nemesis.",
    worldState: [
      { key: "PROPHECY", value: "second riddle: fear none of woman born; safe till Birnam Wood climbs Dunsinane" },
      { key: "THRONE", value: "seized — Macbeth crowned at Scone; Malcolm and Donalbain fled" },
      { key: "MACBETH", value: "falsely emboldened, reckless with borrowed certainty" },
      { key: "LADY", value: "covering for her unravelling husband before the frightened thanes" },
      { key: "GUILT", value: "blood that will not wash — 'Macbeth does murder sleep'" },
      { key: "MACDUFF", value: "named by the apparitions; already fled to England to raise Malcolm" },
    ],
    worldStateDiff: {
      changed: [
        { key: "PROPHECY", value: "second riddle: fear none of woman born; safe till Birnam Wood climbs Dunsinane" },
        { key: "MACBETH", value: "falsely emboldened, reckless with borrowed certainty" },
      ],
      added: [
        { key: "MACDUFF", value: "named by the apparitions; already fled to England to raise Malcolm" },
      ],
      removed: ["BANQUO", "SUSPICION"],
    },
    perturbations: [
      { label: "Macbeth ignores the visions", premise: "Macbeth dismisses the apparitions as fever-dreams and takes none of their false comfort." },
      { label: "The witches warn him plainly", premise: "Instead of riddles, the apparitions tell Macbeth outright that Macduff will be his death." },
      { label: "Macbeth sues for peace", premise: "Rattled, Macbeth sends envoys to negotiate with Malcolm rather than trusting the prophecy." },
    ],
  },
  {
    id: "m9",
    title: "The Slaughter of Macduff's Family",
    description:
      "Learning that Macduff has fled to England, Macbeth vents his rage on those left behind and sends murderers to Fife. Lady Macduff and her children are butchered in their own home for a crime that is merely a father's absence. The act gains Macbeth nothing but a nemesis with nothing left to lose.",
    phase: "Act IV · Scene 2",
    timeIndex: 9,
    parentId: "m8",
    branchId: "canonical",
    canonical: true,
    probability: 0.82,
    emotionalValence: -0.9,
    uncertainty: 0.07,
    downstreamImpact: 66,
    charactersInvolved: ["Macbeth", "Lady Macduff", "The Murderers", "Macduff"],
    whyItMatters:
      "Converts Macduff from an exile into an avenger — the man fated to kill Macbeth is given his reason.",
    worldState: [
      { key: "PROPHECY", value: "second riddle: fear none of woman born; safe till Birnam Wood climbs Dunsinane" },
      { key: "THRONE", value: "held by terror; thanes cowed or in flight" },
      { key: "MACBETH", value: "a tyrant absolute, butchering innocents to feel secure" },
      { key: "LADY", value: "covering for her unravelling husband before the frightened thanes" },
      { key: "GUILT", value: "blood that will not wash — 'Macbeth does murder sleep'" },
      { key: "MACDUFF", value: "his wife and babes butchered at Fife; now Macbeth's sworn nemesis" },
      { key: "REVOLT", value: "thanes desert to Malcolm; an English army marches north" },
    ],
    worldStateDiff: {
      changed: [
        { key: "THRONE", value: "held by terror; thanes cowed or in flight" },
        { key: "MACBETH", value: "a tyrant absolute, butchering innocents to feel secure" },
        { key: "MACDUFF", value: "his wife and babes butchered at Fife; now Macbeth's sworn nemesis" },
      ],
      added: [
        { key: "REVOLT", value: "thanes desert to Malcolm; an English army marches north" },
      ],
    },
    perturbations: [
      { label: "Macbeth spares the family", premise: "Macbeth stays his hand at Fife, and Lady Macduff and her children are left unharmed." },
      { label: "Macduff's family escapes", premise: "Warned in time, Lady Macduff flees to England with her children before the murderers arrive." },
      { label: "Macduff turns back", premise: "Macduff abandons the English cause to defend his home, and confronts Macbeth's men at Fife." },
    ],
  },
  {
    id: "m10",
    title: "Lady Macbeth's Sleepwalking and Death",
    description:
      "The wife who once scorned her husband's weakness now walks the castle in her sleep, scrubbing at a spot of blood that will not come off and murmuring of the murders she helped commit. A doctor and gentlewoman watch, appalled, unable to help a disease beyond their art. Soon after, word comes that the queen is dead, likely by her own hand.",
    phase: "Act V · Scenes 1 & 5",
    timeIndex: 10,
    parentId: "m9",
    branchId: "canonical",
    canonical: true,
    probability: 0.88,
    emotionalValence: -0.85,
    uncertainty: 0.06,
    downstreamImpact: 52,
    charactersInvolved: ["Lady Macbeth", "The Doctor", "The Gentlewoman", "Macbeth"],
    whyItMatters:
      "Guilt claims the stronger partner first, hollowing Macbeth of the one bond he had left before the final siege.",
    worldState: [
      { key: "PROPHECY", value: "second riddle: fear none of woman born; safe till Birnam Wood climbs Dunsinane" },
      { key: "THRONE", value: "held by terror; thanes cowed or in flight" },
      { key: "MACBETH", value: "numbed past feeling — 'she should have died hereafter'" },
      { key: "LADY", value: "mad with guilt, washing phantom blood, then dead by her own despair" },
      { key: "GUILT", value: "consumes Lady Macbeth utterly; the stain outlasts the crown" },
      { key: "MACDUFF", value: "his wife and babes butchered at Fife; now Macbeth's sworn nemesis" },
      { key: "REVOLT", value: "thanes desert to Malcolm; an English army marches north" },
    ],
    worldStateDiff: {
      changed: [
        { key: "MACBETH", value: "numbed past feeling — 'she should have died hereafter'" },
        { key: "LADY", value: "mad with guilt, washing phantom blood, then dead by her own despair" },
        { key: "GUILT", value: "consumes Lady Macbeth utterly; the stain outlasts the crown" },
      ],
    },
    perturbations: [
      { label: "Lady Macbeth recovers", premise: "The physician's care steadies Lady Macbeth, and she lives to face the siege at her husband's side." },
      { label: "She confesses the murders", premise: "In her sleepwalking Lady Macbeth names the killings before witnesses who carry the tale to Malcolm." },
      { label: "Macbeth keeps vigil", premise: "Macbeth watches through her madness, and her death breaks what little resolve he has left." },
    ],
  },
  {
    id: "m11",
    title: "Birnam Wood Comes to Dunsinane",
    description:
      "Malcolm's army cuts boughs from Birnam Wood for camouflage, and to Macbeth's horror the forest seems to march on his stronghold. On the field Macduff reveals he was 'from his mother's womb untimely ripped' — not of woman born — and the last riddle turns against its keeper. Macduff strikes Macbeth down and hails Malcolm king, and the equivocation of the fiends is complete.",
    phase: "Act V · Scenes 5–8",
    timeIndex: 11,
    parentId: "m10",
    branchId: "canonical",
    canonical: true,
    probability: 0.9,
    emotionalValence: -0.8,
    uncertainty: 0.05,
    downstreamImpact: 48,
    charactersInvolved: ["Macbeth", "Macduff", "Malcolm"],
    whyItMatters:
      "The tragic terminus: the prophecies that seemed to promise safety are the very instruments of Macbeth's ruin.",
    worldState: [
      { key: "PROPHECY", value: "every word made good — the equivocation lays Macbeth low" },
      { key: "THRONE", value: "restored — Malcolm hailed King of Scotland" },
      { key: "MACBETH", value: "slain by Macduff, his head struck from his shoulders" },
      { key: "MACDUFF", value: "'not of woman born', he avenges his house and kills the tyrant" },
      { key: "FATE", value: "the witches' words fulfilled entire — Banquo's line still destined to reign" },
    ],
    worldStateDiff: {
      changed: [
        { key: "PROPHECY", value: "every word made good — the equivocation lays Macbeth low" },
        { key: "THRONE", value: "restored — Malcolm hailed King of Scotland" },
        { key: "MACBETH", value: "slain by Macduff, his head struck from his shoulders" },
        { key: "MACDUFF", value: "'not of woman born', he avenges his house and kills the tyrant" },
      ],
      added: [
        { key: "FATE", value: "the witches' words fulfilled entire — Banquo's line still destined to reign" },
      ],
      removed: ["LADY", "GUILT", "REVOLT"],
    },
    terminal: true,
    perturbations: [
      { label: "Macbeth kills Macduff", premise: "Macbeth learns of Macduff's birth too late to matter and cuts him down, prophecy be damned." },
      { label: "Macbeth surrenders", premise: "Seeing Birnam Wood move, Macbeth lays down his sword rather than 'play the Roman fool'." },
      { label: "Macbeth escapes Dunsinane", premise: "Macbeth slips past the besiegers and vanishes into the north, an uncrowned fugitive." },
    ],
  },
];

// --- Branch A: "Macbeth Heeds the Warning, Not the Witches" (source m0) ------

const branchLoyalEvents: StoryEvent[] = [
  {
    id: "mbl0",
    title: "Macbeth Reports the Witches",
    description:
      "Rather than nurse the prophecy in secret, Macbeth rides to Duncan and lays the whole strange encounter before him as a soldier's honest report. He names it madness on the heath, not a promise to be kept. Where another man saw a ladder to the throne, Duncan sees only a loyal thane unburdening his conscience.",
    phase: "Alt · Act I",
    timeIndex: 1,
    parentId: "m0",
    branchId: "mb-loyal",
    canonical: false,
    probability: 0.6,
    emotionalValence: 0.1,
    uncertainty: 0.3,
    downstreamImpact: 60,
    charactersInvolved: ["Macbeth", "Duncan", "Banquo"],
    whyItMatters:
      "Speaking the temptation aloud robs it of its power — the crime can never grow in the light.",
    worldState: [
      { key: "PROPHECY", value: "reported to Duncan as a soldier's strange tale, its power confessed away" },
      { key: "THRONE", value: "Duncan reigns, his trust in Macbeth deepened by the candour" },
      { key: "MACBETH", value: "loyal, his ambition named aloud and disarmed" },
      { key: "BANQUO", value: "fellow witness, glad the matter is brought to light" },
    ],
    worldStateDiff: {
      changed: [
        { key: "PROPHECY", value: "reported to Duncan as a soldier's strange tale, its power confessed away" },
        { key: "THRONE", value: "Duncan reigns, his trust in Macbeth deepened by the candour" },
        { key: "MACBETH", value: "loyal, his ambition named aloud and disarmed" },
        { key: "BANQUO", value: "fellow witness, glad the matter is brought to light" },
      ],
    },
  },
  {
    id: "mbl1",
    title: "Duncan Rewards His Loyalty",
    description:
      "Moved by such openness, Duncan heaps lands and honours on Macbeth and binds him ever closer to the crown. The thane who might have been a murderer becomes instead the throne's most trusted sword. The prophecy dwindles to a curiosity told at feasts.",
    phase: "Alt · Act I–II",
    timeIndex: 2,
    parentId: "mbl0",
    branchId: "mb-loyal",
    canonical: false,
    probability: 0.62,
    emotionalValence: 0.35,
    uncertainty: 0.3,
    downstreamImpact: 50,
    charactersInvolved: ["Duncan", "Macbeth"],
    whyItMatters:
      "Reward for honesty replaces the fear of exposure that drove the canonical Macbeth to keep killing.",
    worldState: [
      { key: "PROPHECY", value: "a closed matter, spoken of only as a court curiosity" },
      { key: "THRONE", value: "Duncan reigns, Macbeth now his most honoured thane" },
      { key: "MACBETH", value: "rewarded with lands and titles for his candour" },
      { key: "BANQUO", value: "fellow witness, glad the matter is brought to light" },
    ],
    worldStateDiff: {
      changed: [
        { key: "PROPHECY", value: "a closed matter, spoken of only as a court curiosity" },
        { key: "THRONE", value: "Duncan reigns, Macbeth now his most honoured thane" },
        { key: "MACBETH", value: "rewarded with lands and titles for his candour" },
      ],
    },
  },
  {
    id: "mbl2",
    title: "Ambition Cools to Contentment",
    description:
      "With nothing to hide and nothing to seize, the dark thoughts starve for want of feeding. Lady Macbeth, given no letter to inflame her, grows old beside a husband at peace with himself. Macbeth settles into the steady work of an elder statesman.",
    phase: "Alt · Act III–IV",
    timeIndex: 3,
    parentId: "mbl1",
    branchId: "mb-loyal",
    canonical: false,
    probability: 0.6,
    emotionalValence: 0.5,
    uncertainty: 0.35,
    downstreamImpact: 40,
    charactersInvolved: ["Macbeth", "Lady Macbeth"],
    whyItMatters:
      "Shows the counterfactual holding: without the crime, the ambition simply has nowhere to go.",
    worldState: [
      { key: "PROPHECY", value: "long dismissed, never once fulfilled" },
      { key: "THRONE", value: "stable, defended by Macbeth's steadfast loyalty" },
      { key: "MACBETH", value: "a contented elder statesman, ambition long starved" },
      { key: "BANQUO", value: "old friend and comrade in Duncan's service" },
    ],
    worldStateDiff: {
      changed: [
        { key: "PROPHECY", value: "long dismissed, never once fulfilled" },
        { key: "THRONE", value: "stable, defended by Macbeth's steadfast loyalty" },
        { key: "MACBETH", value: "a contented elder statesman, ambition long starved" },
      ],
    },
  },
  {
    id: "mbl3",
    title: "The Thane Who Died Honoured",
    description:
      "Macbeth dies old in his own bed, mourned as the staunchest defender the realm ever had. No ghost troubles his sleep and no blood stains his name. He leaves behind a kingdom that never bled for his crown.",
    phase: "Alt · Epilogue",
    timeIndex: 4,
    parentId: "mbl2",
    branchId: "mb-loyal",
    canonical: false,
    probability: 0.58,
    emotionalValence: 0.65,
    uncertainty: 0.4,
    downstreamImpact: 30,
    charactersInvolved: ["Macbeth"],
    whyItMatters:
      "A quiet triumph that measures exactly what the ambition cost — everything, for nothing it could not have kept.",
    worldState: [
      { key: "PROPHECY", value: "never came to pass — a kingdom that never bled" },
      { key: "THRONE", value: "passed on peaceably in its due season" },
      { key: "MACBETH", value: "dead old in his bed, mourned as the realm's shield" },
    ],
    worldStateDiff: {
      changed: [
        { key: "PROPHECY", value: "never came to pass — a kingdom that never bled" },
        { key: "THRONE", value: "passed on peaceably in its due season" },
        { key: "MACBETH", value: "dead old in his bed, mourned as the realm's shield" },
      ],
      removed: ["BANQUO"],
    },
    terminal: true,
  },
];

// --- Branch B: "Lady Macbeth Cannot Move Him" (source m3) --------------------

const branchRefuseEvents: StoryEvent[] = [
  {
    id: "mbr0",
    title: "Macbeth Holds His Ground",
    description:
      "This time 'we will proceed no further in this business' is final. However his wife shames him, however she swears and goads, Macbeth will not be moved from his honour. The daggers stay sheathed and Duncan sleeps safe beneath his roof.",
    phase: "Alt · Act I",
    timeIndex: 4,
    parentId: "m3",
    branchId: "mb-refuse",
    canonical: false,
    probability: 0.6,
    emotionalValence: -0.2,
    uncertainty: 0.3,
    downstreamImpact: 60,
    charactersInvolved: ["Macbeth", "Lady Macbeth"],
    whyItMatters:
      "Removes the murder at its last possible fork — but not the ambition that already lives in the house.",
    worldState: [
      { key: "PROPHECY", value: "witches foretell Macbeth king hereafter, and Banquo the father of kings" },
      { key: "THRONE", value: "Duncan reigns; Malcolm now named Prince of Cumberland and heir" },
      { key: "MACBETH", value: "immovable this time — 'we will proceed no further'" },
      { key: "BANQUO", value: "fellow captain, told his heirs and not himself shall reign" },
      { key: "LADY", value: "thwarted, her goading spent against a wall" },
    ],
    worldStateDiff: {
      changed: [
        { key: "MACBETH", value: "immovable this time — 'we will proceed no further'" },
        { key: "LADY", value: "thwarted, her goading spent against a wall" },
      ],
    },
  },
  {
    id: "mbr1",
    title: "Duncan Departs Unharmed",
    description:
      "The King rides from Inverness alive and grateful, praising his host's hospitality all the way to the gate. The crown stays exactly where it was. But the prophecy hangs unfulfilled over the house like a held breath no one dares release.",
    phase: "Alt · Act II",
    timeIndex: 5,
    parentId: "mbr0",
    branchId: "mb-refuse",
    canonical: false,
    probability: 0.65,
    emotionalValence: -0.1,
    uncertainty: 0.32,
    downstreamImpact: 45,
    charactersInvolved: ["Duncan", "Macbeth", "Lady Macbeth"],
    whyItMatters:
      "Survival without resolution: the temptation is refused but never dispelled.",
    worldState: [
      { key: "PROPHECY", value: "hanging unfulfilled over the house like a held breath" },
      { key: "THRONE", value: "unshaken — Duncan rides from Inverness alive and grateful" },
      { key: "MACBETH", value: "a host who kept faith, the fatal moment let pass" },
      { key: "BANQUO", value: "fellow captain, told his heirs and not himself shall reign" },
      { key: "LADY", value: "thwarted, her goading spent against a wall" },
    ],
    worldStateDiff: {
      changed: [
        { key: "PROPHECY", value: "hanging unfulfilled over the house like a held breath" },
        { key: "THRONE", value: "unshaken — Duncan rides from Inverness alive and grateful" },
        { key: "MACBETH", value: "a host who kept faith, the fatal moment let pass" },
      ],
    },
  },
  {
    id: "mbr2",
    title: "The Marriage Curdles",
    description:
      "Lady Macbeth cannot forgive the husband who flinched, and contempt seeps into every silence between them. The crown they might have had sits at their table like an unspoken accusation. The deed they only rehearsed proves as corrosive as one committed.",
    phase: "Alt · Act III–IV",
    timeIndex: 6,
    parentId: "mbr1",
    branchId: "mb-refuse",
    canonical: false,
    probability: 0.55,
    emotionalValence: -0.5,
    uncertainty: 0.4,
    downstreamImpact: 40,
    charactersInvolved: ["Macbeth", "Lady Macbeth"],
    whyItMatters:
      "The intimacy that plotted the murder cannot survive its refusal — the bond curdles either way.",
    worldState: [
      { key: "PROPHECY", value: "hanging unfulfilled over the house like a held breath" },
      { key: "THRONE", value: "unshaken — Duncan rides from Inverness alive and grateful" },
      { key: "MACBETH", value: "estranged from a wife who despises his restraint" },
      { key: "BANQUO", value: "fellow captain, told his heirs and not himself shall reign" },
      { key: "LADY", value: "unable to forgive the husband who flinched; contempt in every silence" },
      { key: "GUILT", value: "guilt for a deed never done — the rehearsed murder haunts them both" },
    ],
    worldStateDiff: {
      changed: [
        { key: "MACBETH", value: "estranged from a wife who despises his restraint" },
        { key: "LADY", value: "unable to forgive the husband who flinched; contempt in every silence" },
      ],
      added: [
        { key: "GUILT", value: "guilt for a deed never done — the rehearsed murder haunts them both" },
      ],
    },
  },
  {
    id: "mbr3",
    title: "A Slow Domestic Ruin",
    description:
      "No crown, no blood — only two people slowly poisoned by the murder they planned and never did. They grow old apart under the same roof, each haunted by a throne the other cost them. The tragedy plays out in miniature, without a single death.",
    phase: "Alt · Epilogue",
    timeIndex: 7,
    parentId: "mbr2",
    branchId: "mb-refuse",
    canonical: false,
    probability: 0.5,
    emotionalValence: -0.55,
    uncertainty: 0.45,
    downstreamImpact: 30,
    charactersInvolved: ["Macbeth", "Lady Macbeth"],
    whyItMatters:
      "A bleak survival: the ambition destroys the marriage even when the crime is refused.",
    worldState: [
      { key: "PROPHECY", value: "hanging unfulfilled over the house like a held breath" },
      { key: "THRONE", value: "unshaken — Duncan rides from Inverness alive and grateful" },
      { key: "MACBETH", value: "grown old estranged, haunted by a throne he never took" },
      { key: "BANQUO", value: "fellow captain, told his heirs and not himself shall reign" },
      { key: "LADY", value: "withered by contempt and regret, loveless to the last" },
      { key: "GUILT", value: "a slow domestic poison; no crown, no blood, only ruin" },
    ],
    worldStateDiff: {
      changed: [
        { key: "MACBETH", value: "grown old estranged, haunted by a throne he never took" },
        { key: "LADY", value: "withered by contempt and regret, loveless to the last" },
        { key: "GUILT", value: "a slow domestic poison; no crown, no blood, only ruin" },
      ],
    },
    terminal: true,
  },
];

// --- Branch C: "Fleance Dies Too" (source m6) -------------------------------

const branchFleanceEvents: StoryEvent[] = [
  {
    id: "mbf0",
    title: "Fleance Falls in the Dark",
    description:
      "The murderers run the boy down before he reaches the trees, and father and son lie dead together in the ditch. There is no cry of 'fly, good Fleance', no revenge to come. The branch of the prophecy that promised Banquo a line of kings is severed at the root.",
    phase: "Alt · Act III",
    timeIndex: 7,
    parentId: "m6",
    branchId: "mb-fleance",
    canonical: false,
    probability: 0.5,
    emotionalValence: -0.6,
    uncertainty: 0.35,
    downstreamImpact: 78,
    charactersInvolved: ["The Murderers", "Fleance", "Banquo"],
    whyItMatters:
      "Kills the one survivor whose escape kept the prophecy — and Macbeth's fear — alive.",
    worldState: [
      { key: "PROPHECY", value: "the branch promising Banquo kings is severed at the root" },
      { key: "THRONE", value: "seized — Macbeth crowned at Scone; Malcolm and Donalbain fled" },
      { key: "MACBETH", value: "paranoid, safe in nothing while Banquo's blood survives" },
      { key: "BANQUO", value: "murdered by Macbeth's hired men on the road to the feast" },
      { key: "LADY", value: "returned the daggers, sure 'a little water clears us of this deed'" },
      { key: "GUILT", value: "blood that will not wash — 'Macbeth does murder sleep'" },
      { key: "FLEANCE", value: "run down before the trees — Banquo's son lies dead in the ditch" },
    ],
    worldStateDiff: {
      changed: [
        { key: "PROPHECY", value: "the branch promising Banquo kings is severed at the root" },
        { key: "FLEANCE", value: "run down before the trees — Banquo's son lies dead in the ditch" },
      ],
    },
  },
  {
    id: "mbf1",
    title: "The Prophecy Voided",
    description:
      "Word reaches Macbeth that no heir of Banquo draws breath, and for the first time he believes the crown is wholly and only his. The promise made to another man on the heath is, he tells himself, undone. No ghost need trouble a feast where nothing survives to inherit.",
    phase: "Alt · Act III–IV",
    timeIndex: 8,
    parentId: "mbf0",
    branchId: "mb-fleance",
    canonical: false,
    probability: 0.55,
    emotionalValence: -0.4,
    uncertainty: 0.4,
    downstreamImpact: 66,
    charactersInvolved: ["Macbeth"],
    whyItMatters:
      "Removes the specific fear that drove the canonical Macbeth back to the witches — his terror loses its shape.",
    worldState: [
      { key: "PROPHECY", value: "the promise to Banquo's line held void — or so Macbeth trusts" },
      { key: "THRONE", value: "seized — Macbeth crowned at Scone; Malcolm and Donalbain fled" },
      { key: "MACBETH", value: "believing, for the first time, the crown is wholly and only his" },
      { key: "BANQUO", value: "murdered by Macbeth's hired men on the road to the feast" },
      { key: "LADY", value: "returned the daggers, sure 'a little water clears us of this deed'" },
      { key: "GUILT", value: "blood that will not wash — 'Macbeth does murder sleep'" },
      { key: "FLEANCE", value: "run down before the trees — Banquo's son lies dead in the ditch" },
    ],
    worldStateDiff: {
      changed: [
        { key: "PROPHECY", value: "the promise to Banquo's line held void — or so Macbeth trusts" },
        { key: "MACBETH", value: "believing, for the first time, the crown is wholly and only his" },
      ],
    },
  },
  {
    id: "mbf2",
    title: "A Brief, Terrible Calm",
    description:
      "For a season Macbeth's dreams quiet and his hand steadies; with no rival bloodline to dread, the paranoia loosens its grip. He mistakes the silence for safety and the absence of an heir for peace. It is the calm of a man who has run out of enemies to name.",
    phase: "Alt · Act IV",
    timeIndex: 9,
    parentId: "mbf1",
    branchId: "mb-fleance",
    canonical: false,
    probability: 0.55,
    emotionalValence: -0.3,
    uncertainty: 0.42,
    downstreamImpact: 50,
    charactersInvolved: ["Macbeth", "Lady Macbeth"],
    whyItMatters:
      "The eerie pause that shows what Macbeth actually wanted — and how little it satisfies.",
    worldState: [
      { key: "PROPHECY", value: "the promise to Banquo's line held void — or so Macbeth trusts" },
      { key: "THRONE", value: "seized — Macbeth crowned at Scone; Malcolm and Donalbain fled" },
      { key: "MACBETH", value: "his dreams quiet, his hand steady, mistaking silence for safety" },
      { key: "BANQUO", value: "murdered by Macbeth's hired men on the road to the feast" },
      { key: "LADY", value: "returned the daggers, sure 'a little water clears us of this deed'" },
      { key: "GUILT", value: "loosened its grip for a season, with no rival blood to dread" },
      { key: "FLEANCE", value: "run down before the trees — Banquo's son lies dead in the ditch" },
    ],
    worldStateDiff: {
      changed: [
        { key: "MACBETH", value: "his dreams quiet, his hand steady, mistaking silence for safety" },
        { key: "GUILT", value: "loosened its grip for a season, with no rival blood to dread" },
      ],
    },
  },
  {
    id: "mbf3",
    title: "Paranoia Curdles into Tyranny",
    description:
      "The calm cannot hold. With no prophecy left to fear, Macbeth invents new enemies and purges the thanes wholesale, thinning his own court by the axe. Freedom from one great dread only makes room for a hundred smaller ones, and each demands its blood.",
    phase: "Alt · Act IV–V",
    timeIndex: 10,
    parentId: "mbf2",
    branchId: "mb-fleance",
    canonical: false,
    probability: 0.5,
    emotionalValence: -0.7,
    uncertainty: 0.45,
    downstreamImpact: 55,
    charactersInvolved: ["Macbeth", "The Thanes"],
    whyItMatters:
      "Proves the tyranny was never about Banquo — without a rival to fear, Macbeth simply manufactures new ones.",
    worldState: [
      { key: "PROPHECY", value: "the promise to Banquo's line held void — or so Macbeth trusts" },
      { key: "THRONE", value: "held by terror, the court thinned by executions" },
      { key: "MACBETH", value: "inventing new enemies, purging the thanes wholesale" },
      { key: "BANQUO", value: "murdered by Macbeth's hired men on the road to the feast" },
      { key: "LADY", value: "returned the daggers, sure 'a little water clears us of this deed'" },
      { key: "GUILT", value: "returned redoubled; freedom from one dread breeds a hundred" },
      { key: "FLEANCE", value: "run down before the trees — Banquo's son lies dead in the ditch" },
    ],
    worldStateDiff: {
      changed: [
        { key: "THRONE", value: "held by terror, the court thinned by executions" },
        { key: "MACBETH", value: "inventing new enemies, purging the thanes wholesale" },
        { key: "GUILT", value: "returned redoubled; freedom from one dread breeds a hundred" },
      ],
    },
  },
  {
    id: "mbf4",
    title: "An Absolute, Loveless Reign",
    description:
      "Macbeth rules unchallenged and utterly alone, a king whose line will end with him and whose peace was bought with a child's murder in a ditch. The throne is secure and entirely hollow. He has won everything the witches promised and kept nothing worth the keeping.",
    phase: "Alt · Epilogue",
    timeIndex: 11,
    parentId: "mbf3",
    branchId: "mb-fleance",
    canonical: false,
    probability: 0.48,
    emotionalValence: -0.8,
    uncertainty: 0.5,
    downstreamImpact: 45,
    charactersInvolved: ["Macbeth"],
    whyItMatters:
      "The darkest terminus: absolute power, absolutely barren — a reign that outlasts every reason to want it.",
    worldState: [
      { key: "PROPHECY", value: "voided by murder — no heir of Banquo will ever reign" },
      { key: "THRONE", value: "secure, unchallenged, and utterly hollow" },
      { key: "MACBETH", value: "ruling alone, his line to end with him" },
      { key: "BANQUO", value: "dead, his line extinguished with his son" },
    ],
    worldStateDiff: {
      changed: [
        { key: "PROPHECY", value: "voided by murder — no heir of Banquo will ever reign" },
        { key: "THRONE", value: "secure, unchallenged, and utterly hollow" },
        { key: "MACBETH", value: "ruling alone, his line to end with him" },
        { key: "BANQUO", value: "dead, his line extinguished with his son" },
      ],
      removed: ["FLEANCE", "LADY", "GUILT"],
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
    premise: "",
    plausibility: "faithful",
    lane: 0,
    createdOrder: -1,
  },
  {
    id: "mb-loyal",
    label: "Macbeth Heeds the Warning, Not the Witches",
    canonical: false,
    sourceNodeId: "m0",
    premise: "Macbeth dismisses the prophecy and stays loyal to Duncan",
    plausibility: "balanced",
    lane: -1,
    createdOrder: 0,
  },
  {
    id: "mb-refuse",
    label: "Lady Macbeth Cannot Move Him",
    canonical: false,
    sourceNodeId: "m3",
    premise: "Macbeth refuses his wife and lets the moment pass",
    plausibility: "faithful",
    lane: 1,
    createdOrder: 1,
  },
  {
    id: "mb-fleance",
    label: "Fleance Dies Too",
    canonical: false,
    sourceNodeId: "m6",
    premise: "The murderers kill Fleance along with Banquo",
    plausibility: "wild",
    lane: 2,
    createdOrder: 2,
  },
];

// --- Assembled story -------------------------------------------------------

export const macbeth: Story = {
  id: "macbeth",
  title: "Macbeth",
  author: "William Shakespeare",
  blurb:
    "A tragedy of ambition and prophecy: a loyal soldier hears he will be king, and follows the shortest, bloodiest path to a crown that gives him no peace. Reroll any event to simulate the reign that might have been.",
  events: [
    ...canonicalEvents,
    ...branchLoyalEvents,
    ...branchRefuseEvents,
    ...branchFleanceEvents,
  ],
  branches: seededBranches,
};
