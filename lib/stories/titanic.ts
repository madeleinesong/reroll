// ---------------------------------------------------------------------------
// reroll — Titanic story data
//
// One canonical spine of 12 events (t0..t11) plus three authored counterfactual
// branches, each rooted in a single changed premise. Metrics are hand-tuned for
// internal consistency: probabilities track how inevitable each beat is (the
// chance hinges — the poker win, the held speed, the late sighting — sit near a
// coin-flip), valence tracks the arc from elation to catastrophe, uncertainty
// stays low on canon, and downstreamImpact marks the true leverage points of
// the disaster.
// ---------------------------------------------------------------------------

import type { Branch, Story, StoryEvent } from "@/lib/types";

// --- Canonical spine -------------------------------------------------------

const canonicalEvents: StoryEvent[] = [
  {
    id: "t0",
    title: "Jack Wins a Third-Class Ticket at Poker",
    description:
      "In a smoky Southampton pub, minutes before the gangways lift, Jack Dawson stakes everything on a single hand of poker and wins two steerage tickets for the Titanic. He and Fabrizio sprint down the dock and leap aboard as the lines are cast off. His whole future turns on the last card of the deal.",
    phase: "Departure · Southampton",
    timeIndex: 0,
    parentId: null,
    branchId: "canonical",
    canonical: true,
    probability: 0.58,
    emotionalValence: 0.75,
    uncertainty: 0.1,
    downstreamImpact: 82,
    charactersInvolved: ["Jack", "Fabrizio"],
    whyItMatters:
      "The chance hinge that puts Jack aboard at all — without this hand there is no meeting, no love, and no one for Rose to be saved by.",
    worldState: [
      { key: "SHIP", value: "the RMS Titanic, boarding at Southampton, hailed unsinkable" },
      { key: "JACK", value: "a penniless artist, aboard by a stroke of luck at cards" },
      { key: "ROSE", value: "a first-class passenger, engaged to Cal, dreading the match" },
      { key: "CLASS", value: "a rigid gulf between steerage and the first-class decks" },
    ],
    worldStateDiff: {
      added: [
        { key: "SHIP", value: "the RMS Titanic, boarding at Southampton, hailed unsinkable" },
        { key: "JACK", value: "a penniless artist, aboard by a stroke of luck at cards" },
        { key: "ROSE", value: "a first-class passenger, engaged to Cal, dreading the match" },
        { key: "CLASS", value: "a rigid gulf between steerage and the first-class decks" },
      ],
    },
    perturbations: [
      {
        label: "Jack loses the hand",
        premise: "The winning card falls to a rival at the table and Jack never boards the Titanic at all.",
      },
      {
        label: "He sells the ticket",
        premise: "Broke and hungry, Jack sells his steerage ticket on the dock instead of sailing.",
      },
      {
        label: "He boards first class",
        premise: "Jack wins a first-class ticket instead, and meets Rose as a social equal.",
      },
    ],
  },
  {
    id: "t1",
    title: "Titanic Departs Southampton",
    description:
      "The great liner slips her moorings to cheering crowds and steams out into the Channel, 'the ship of dreams'. Below decks Jack revels in the open sea; above them, Rose stares at the same horizon and feels the walls of her engagement closing in. Two lives are now carried by the same hull toward the same night.",
    phase: "Departure · At Sea",
    timeIndex: 1,
    parentId: "t0",
    branchId: "canonical",
    canonical: true,
    probability: 0.95,
    emotionalValence: 0.55,
    uncertainty: 0.04,
    downstreamImpact: 38,
    charactersInvolved: ["Jack", "Rose", "Cal", "Fabrizio"],
    whyItMatters:
      "Sets the voyage in motion and frames its central tension — Jack's freedom against Rose's gilded captivity.",
    worldState: [
      { key: "SHIP", value: "underway from Southampton, 'the ship of dreams'" },
      { key: "JACK", value: "in steerage, exhilarated to be at sea" },
      { key: "ROSE", value: "in first class, quietly suffocating in her engagement" },
      { key: "CLASS", value: "a rigid gulf between steerage and the first-class decks" },
    ],
    worldStateDiff: {
      changed: [
        { key: "SHIP", value: "underway from Southampton, 'the ship of dreams'" },
        { key: "JACK", value: "in steerage, exhilarated to be at sea" },
        { key: "ROSE", value: "in first class, quietly suffocating in her engagement" },
      ],
    },
    perturbations: [
      {
        label: "The coal fire delays her",
        premise: "The smouldering bunker fire forces the maiden voyage to be postponed a week.",
      },
      {
        label: "Rose disembarks at Cherbourg",
        premise: "Rose breaks her engagement at the first port and leaves the ship before it reaches open sea.",
      },
      {
        label: "A storm reroutes the crossing",
        premise: "Heavy weather pushes the Titanic onto a southerly track well clear of the ice field.",
      },
    ],
  },
  {
    id: "t2",
    title: "Jack Talks Rose Back from the Stern Rail",
    description:
      "Driven to the edge by despair, Rose climbs the stern rail above the churning propellers, ready to let go. Jack talks to her softly, insistently — about cold water and second chances — until she takes his hand and climbs back. A debt and a fascination are born in the same instant.",
    phase: "Act I · The Meeting",
    timeIndex: 2,
    parentId: "t1",
    branchId: "canonical",
    canonical: true,
    probability: 0.68,
    emotionalValence: 0.25,
    uncertainty: 0.1,
    downstreamImpact: 80,
    charactersInvolved: ["Jack", "Rose"],
    whyItMatters:
      "The human hinge of the love story — the moment two people from opposite ends of the ship are bound together.",
    worldState: [
      { key: "SHIP", value: "underway across the North Atlantic" },
      { key: "JACK", value: "the stranger who talked Rose down from the rail" },
      { key: "ROSE", value: "pulled back from the brink, shaken and curious" },
      { key: "CLASS", value: "a rigid gulf between steerage and the first-class decks" },
      { key: "LOVE", value: "a fragile debt-turned-fascination between them" },
    ],
    worldStateDiff: {
      changed: [
        { key: "SHIP", value: "underway across the North Atlantic" },
        { key: "JACK", value: "the stranger who talked Rose down from the rail" },
        { key: "ROSE", value: "pulled back from the brink, shaken and curious" },
      ],
      added: [{ key: "LOVE", value: "a fragile debt-turned-fascination between them" }],
    },
    perturbations: [
      {
        label: "He arrives too late",
        premise: "Jack reaches the stern a moment after Rose has already let go.",
      },
      {
        label: "She never climbs the rail",
        premise: "Rose keeps to her stateroom that night and the two never speak.",
      },
      {
        label: "An officer intervenes first",
        premise: "A crewman pulls Rose back before Jack can, and no bond is ever formed between them.",
      },
    ],
  },
  {
    id: "t3",
    title: "Rose and Jack Fall in Love",
    description:
      "Away from Cal's watchful circle, Rose seeks Jack out. She poses for the drawing that lets her be, for once, entirely herself, and afterward they flee below decks to dance and to hide. By the time they are done, what was gratitude has become a love that neither the engagement nor the class line can contain.",
    phase: "Act I · Below Decks",
    timeIndex: 3,
    parentId: "t2",
    branchId: "canonical",
    canonical: true,
    probability: 0.84,
    emotionalValence: 0.8,
    uncertainty: 0.07,
    downstreamImpact: 56,
    charactersInvolved: ["Jack", "Rose", "Cal"],
    whyItMatters:
      "Raises the stakes of everything to come — Rose now has a reason to defy Cal, and a life she is unwilling to lose.",
    worldState: [
      { key: "SHIP", value: "underway across the North Atlantic" },
      { key: "JACK", value: "in love with Rose, drawing and dancing with her below decks" },
      { key: "ROSE", value: "in love with Jack, alive to herself for the first time" },
      { key: "CLASS", value: "openly defied by the lovers, though the gulf remains" },
      { key: "LOVE", value: "a consummated love set against her engagement to Cal" },
    ],
    worldStateDiff: {
      changed: [
        { key: "JACK", value: "in love with Rose, drawing and dancing with her below decks" },
        { key: "ROSE", value: "in love with Jack, alive to herself for the first time" },
        { key: "CLASS", value: "openly defied by the lovers, though the gulf remains" },
        { key: "LOVE", value: "a consummated love set against her engagement to Cal" },
      ],
    },
    perturbations: [
      {
        label: "Cal discovers them first",
        premise: "Cal catches Rose with Jack before the drawing and confines her to her rooms for the voyage.",
      },
      {
        label: "Rose refuses the sitting",
        premise: "Rose decides the flirtation is too dangerous and sends Jack away.",
      },
      {
        label: "They plan to run in New York",
        premise: "The lovers resolve to elope the moment the ship docks, and spend the crossing plotting it.",
      },
    ],
  },
  {
    id: "t4",
    title: "Iceberg Warnings Ignored; Full Speed Held",
    description:
      "Wireless ice warnings pile up on the bridge through the day, but the Titanic holds her speed to make a fast, headline-making crossing. The operators are busy with passengers' telegrams; the messages that matter go half-read. Confidence in an unsinkable ship becomes the first cause of her sinking.",
    phase: "Act II · The Warnings",
    timeIndex: 4,
    parentId: "t3",
    branchId: "canonical",
    canonical: true,
    probability: 0.55,
    emotionalValence: -0.3,
    uncertainty: 0.1,
    downstreamImpact: 95,
    charactersInvolved: ["Captain Smith", "Murdoch"],
    whyItMatters:
      "The highest-leverage decision of the disaster — the one choice that, reversed, saves the ship and everyone aboard.",
    worldState: [
      { key: "SHIP", value: "steaming near full speed toward a known ice field" },
      { key: "JACK", value: "in love with Rose, unaware of the danger ahead" },
      { key: "ROSE", value: "in love with Jack, unaware of the danger ahead" },
      { key: "CLASS", value: "openly defied by the lovers, though the gulf remains" },
      { key: "LOVE", value: "a consummated love set against her engagement to Cal" },
      { key: "ICE", value: "wireless ice warnings received but not acted upon" },
      { key: "SPEED", value: "held near full to make a fast crossing" },
    ],
    worldStateDiff: {
      changed: [{ key: "SHIP", value: "steaming near full speed toward a known ice field" }],
      added: [
        { key: "ICE", value: "wireless ice warnings received but not acted upon" },
        { key: "SPEED", value: "held near full to make a fast crossing" },
      ],
    },
    perturbations: [
      {
        label: "The bridge slows the ship",
        premise: "Captain Smith orders the engines eased and posts extra lookouts for ice.",
      },
      {
        label: "The warnings reach the captain",
        premise: "The wireless operators pass every ice message to the bridge instead of prioritising passenger telegrams.",
      },
      {
        label: "They divert south",
        premise: "Smith alters course well south of the reported ice field to be safe.",
      },
    ],
  },
  {
    id: "t5",
    title: "The Lookouts Spot the Berg Too Late",
    description:
      "High in the crow's nest and without binoculars — the locker key never made it aboard — Fleet and Lee peer into a dead-calm, moonless dark. When the black shape resolves out of the night it is already almost upon them. The warning bell rings with only seconds left to turn.",
    phase: "Act II · The Sighting",
    timeIndex: 5,
    parentId: "t4",
    branchId: "canonical",
    canonical: true,
    probability: 0.5,
    emotionalValence: -0.5,
    uncertainty: 0.12,
    downstreamImpact: 96,
    charactersInvolved: ["Fleet", "Lee", "Murdoch"],
    whyItMatters:
      "A knife-edge of chance and equipment: a minute's more warning, or a pair of binoculars, and the berg is cleared.",
    worldState: [
      { key: "SHIP", value: "swinging hard to port, too fast to answer in time" },
      { key: "JACK", value: "in love with Rose, unaware of the danger ahead" },
      { key: "ROSE", value: "in love with Jack, unaware of the danger ahead" },
      { key: "CLASS", value: "openly defied by the lovers, though the gulf remains" },
      { key: "LOVE", value: "a consummated love set against her engagement to Cal" },
      { key: "ICE", value: "an iceberg dead ahead, sighted with seconds to spare" },
      { key: "SPEED", value: "too high to stop or turn clear in time" },
    ],
    worldStateDiff: {
      changed: [
        { key: "SHIP", value: "swinging hard to port, too fast to answer in time" },
        { key: "ICE", value: "an iceberg dead ahead, sighted with seconds to spare" },
        { key: "SPEED", value: "too high to stop or turn clear in time" },
      ],
    },
    perturbations: [
      {
        label: "The lookouts have binoculars",
        premise: "The locker key is found and Fleet and Lee scan the dark water with glasses.",
      },
      {
        label: "A flat calm betrays the berg",
        premise: "A faint swell breaks white at the ice's base and the lookouts see it a full minute sooner.",
      },
      {
        label: "They ram it head-on",
        premise: "Murdoch drives straight into the berg instead of turning, crushing the bow but sparing the compartments.",
      },
    ],
  },
  {
    id: "t6",
    title: "The Starboard Collision",
    description:
      "The turn comes an instant too late. The berg grinds down the starboard side, popping rivets and buckling the plates below the waterline along six compartments. There is barely a shudder felt in the staterooms — but the sea is already pouring into a ship designed to survive only four flooded compartments.",
    phase: "Act II · The Collision",
    timeIndex: 6,
    parentId: "t5",
    branchId: "canonical",
    canonical: true,
    probability: 0.9,
    emotionalValence: -0.6,
    uncertainty: 0.06,
    downstreamImpact: 85,
    charactersInvolved: ["Murdoch", "Captain Smith", "Andrews"],
    whyItMatters:
      "The point of no return — from here the ship's loss is arithmetic, and the only question is who reaches a boat.",
    worldState: [
      { key: "SHIP", value: "struck below the waterline, doomed within hours" },
      { key: "JACK", value: "in love with Rose, the danger not yet understood" },
      { key: "ROSE", value: "in love with Jack, the danger not yet understood" },
      { key: "CLASS", value: "openly defied by the lovers, though the gulf remains" },
      { key: "LOVE", value: "a consummated love set against her engagement to Cal" },
      { key: "HULL", value: "six compartments open to the sea, beyond the design limit" },
    ],
    worldStateDiff: {
      removed: ["ICE", "SPEED"],
      changed: [{ key: "SHIP", value: "struck below the waterline, doomed within hours" }],
      added: [{ key: "HULL", value: "six compartments open to the sea, beyond the design limit" }],
    },
    perturbations: [
      {
        label: "The turn clears it",
        premise: "The Titanic's swing to port carries the hull just past the ice with only a scrape.",
      },
      {
        label: "Fewer compartments flood",
        premise: "The berg opens only three compartments, within the ship's design limit, and she stays afloat.",
      },
      {
        label: "The watertight doors hold",
        premise: "The bulkheads are built a full deck higher and contain the flooding.",
      },
    ],
  },
  {
    id: "t7",
    title: "Too Few Lifeboats; 'Women and Children First'",
    description:
      "Andrews delivers the arithmetic of the sinking: the Titanic carries lifeboats for barely half the souls aboard. The order goes out — women and children first — and in the confusion boats are lowered half-empty while steerage passengers are held behind gates below. The disaster's death toll is decided here, on the boat deck.",
    phase: "Act III · The Boats",
    timeIndex: 7,
    parentId: "t6",
    branchId: "canonical",
    canonical: true,
    probability: 0.88,
    emotionalValence: -0.7,
    uncertainty: 0.07,
    downstreamImpact: 90,
    charactersInvolved: ["Andrews", "Captain Smith", "Molly Brown", "Cal"],
    whyItMatters:
      "The structural failure that turns a shipwreck into a mass drowning — the shortage of boats, not the ice, is what kills most.",
    worldState: [
      { key: "SHIP", value: "settling by the bow, hours from foundering" },
      { key: "JACK", value: "in love with Rose, now fighting to keep her alive" },
      { key: "ROSE", value: "in love with Jack, refusing to be parted from him" },
      { key: "CLASS", value: "made lethal — steerage held behind gates below" },
      { key: "LOVE", value: "a love now tested against survival itself" },
      { key: "HULL", value: "flooding forward, the bow going down" },
      { key: "BOATS", value: "lifeboats for barely half aboard, lowered half-empty" },
    ],
    worldStateDiff: {
      changed: [
        { key: "SHIP", value: "settling by the bow, hours from foundering" },
        { key: "JACK", value: "in love with Rose, now fighting to keep her alive" },
        { key: "ROSE", value: "in love with Jack, refusing to be parted from him" },
        { key: "CLASS", value: "made lethal — steerage held behind gates below" },
        { key: "LOVE", value: "a love now tested against survival itself" },
        { key: "HULL", value: "flooding forward, the bow going down" },
      ],
      added: [{ key: "BOATS", value: "lifeboats for barely half aboard, lowered half-empty" }],
    },
    perturbations: [
      {
        label: "'Women and children only' is relaxed",
        premise: "Officers fill each boat to capacity with anyone at hand rather than launching them half-empty.",
      },
      {
        label: "Steerage gates are opened",
        premise: "The crew unlocks the third-class passages early and guides everyone to the boat deck.",
      },
      {
        label: "A ship answers close by",
        premise: "The nearby Californian's wireless is manned and she steams to the rescue within the hour.",
      },
    ],
  },
  {
    id: "t8",
    title: "Rose Steps Off the Lifeboat to Stay with Jack",
    description:
      "Lowered away toward safety in a half-filled boat, Rose looks up at Jack shrinking above her and cannot bear it. At the last moment she leaps back onto the sinking ship and runs into his arms. She has chosen a doomed few hours with him over a lifetime without.",
    phase: "Act III · The Choice",
    timeIndex: 8,
    parentId: "t7",
    branchId: "canonical",
    canonical: true,
    probability: 0.6,
    emotionalValence: -0.2,
    uncertainty: 0.12,
    downstreamImpact: 60,
    charactersInvolved: ["Rose", "Jack", "Cal"],
    whyItMatters:
      "Rose's defining act of will — trading guaranteed survival for love, and setting up the sacrifice that ends the story.",
    worldState: [
      { key: "SHIP", value: "settling fast, decks tilting toward the sea" },
      { key: "JACK", value: "reunited with Rose aboard the sinking ship" },
      { key: "ROSE", value: "back aboard with Jack, having refused the boat" },
      { key: "CLASS", value: "made lethal — steerage held behind gates below" },
      { key: "LOVE", value: "chosen over survival, whatever the cost" },
      { key: "HULL", value: "flooding aft, the bow nearly under" },
      { key: "BOATS", value: "nearly all away; the last are lowering" },
    ],
    worldStateDiff: {
      changed: [
        { key: "SHIP", value: "settling fast, decks tilting toward the sea" },
        { key: "JACK", value: "reunited with Rose aboard the sinking ship" },
        { key: "ROSE", value: "back aboard with Jack, having refused the boat" },
        { key: "LOVE", value: "chosen over survival, whatever the cost" },
        { key: "HULL", value: "flooding aft, the bow nearly under" },
        { key: "BOATS", value: "nearly all away; the last are lowering" },
      ],
    },
    perturbations: [
      {
        label: "Rose stays in the boat",
        premise: "Rose lets herself be lowered away and watches Jack from the water, alive but apart.",
      },
      {
        label: "Jack boards with her",
        premise: "An officer waves Jack into the same boat and they are lowered together.",
      },
      {
        label: "Cal drags her back",
        premise: "Cal forces Rose into the boat by force and she never returns to Jack.",
      },
    ],
  },
  {
    id: "t9",
    title: "The Ship Breaks in Two and Founders",
    description:
      "The bow slides under and the stern heaves up until the strain tears the great hull in two with a shriek of rending steel. Jack and Rose cling to the rising rail as the stern swings vertical, hangs a moment against the stars, then plunges. The Titanic drags a thousand souls down with her.",
    phase: "Act IV · The Foundering",
    timeIndex: 9,
    parentId: "t8",
    branchId: "canonical",
    canonical: true,
    probability: 0.9,
    emotionalValence: -0.8,
    uncertainty: 0.05,
    downstreamImpact: 55,
    charactersInvolved: ["Jack", "Rose"],
    whyItMatters:
      "The catastrophe made total — the ship gone, the sea now the only thing between the lovers and death.",
    worldState: [
      { key: "SHIP", value: "broken in two and gone beneath the surface" },
      { key: "JACK", value: "in the freezing water, keeping hold of Rose" },
      { key: "ROSE", value: "in the freezing water, keeping hold of Jack" },
      { key: "CLASS", value: "erased — the sea makes no distinction now" },
      { key: "LOVE", value: "all that is left to hold onto in the dark" },
      { key: "BOATS", value: "rowing away, most refusing to return for swimmers" },
    ],
    worldStateDiff: {
      removed: ["HULL"],
      changed: [
        { key: "SHIP", value: "broken in two and gone beneath the surface" },
        { key: "JACK", value: "in the freezing water, keeping hold of Rose" },
        { key: "ROSE", value: "in the freezing water, keeping hold of Jack" },
        { key: "CLASS", value: "erased — the sea makes no distinction now" },
        { key: "LOVE", value: "all that is left to hold onto in the dark" },
        { key: "BOATS", value: "rowing away, most refusing to return for swimmers" },
      ],
    },
    perturbations: [
      {
        label: "She founders whole",
        premise: "The hull holds together and slides under intact, changing who is thrown clear.",
      },
      {
        label: "The stern settles slowly",
        premise: "The break comes gently enough for dozens more to reach the floating debris.",
      },
      {
        label: "A boat returns in time",
        premise: "One lifeboat rows back before the suction takes the swimmers.",
      },
    ],
  },
  {
    id: "t10",
    title: "Jack in the Freezing Water",
    description:
      "Jack finds a floating panel of debris and pushes Rose up onto it, insisting there is only room for one. He holds her hand from the water as the cold works into him, making her promise to survive, to grow old, to never let go. The North Atlantic at twenty-eight degrees gives him barely more than an hour.",
    phase: "Act IV · The Water",
    timeIndex: 10,
    parentId: "t9",
    branchId: "canonical",
    canonical: true,
    probability: 0.6,
    emotionalValence: -0.9,
    uncertainty: 0.12,
    downstreamImpact: 88,
    charactersInvolved: ["Jack", "Rose"],
    whyItMatters:
      "The final leverage point — whether Jack too can be kept out of the water decides whether the story ends in one death or none.",
    worldState: [
      { key: "SHIP", value: "gone; only debris and swimmers remain" },
      { key: "JACK", value: "in the sea beside the panel, freezing, holding Rose above the water" },
      { key: "ROSE", value: "on the floating panel, kept clear of the water by Jack" },
      { key: "LOVE", value: "a promise extracted in the dark: survive, and never let go" },
      { key: "FATE", value: "one panel, two people, and water too cold to survive" },
    ],
    worldStateDiff: {
      removed: ["CLASS", "BOATS"],
      changed: [
        { key: "SHIP", value: "gone; only debris and swimmers remain" },
        { key: "JACK", value: "in the sea beside the panel, freezing, holding Rose above the water" },
        { key: "ROSE", value: "on the floating panel, kept clear of the water by Jack" },
        { key: "LOVE", value: "a promise extracted in the dark: survive, and never let go" },
      ],
      added: [{ key: "FATE", value: "one panel, two people, and water too cold to survive" }],
    },
    perturbations: [
      {
        label: "The panel holds both",
        premise: "The floating door is wide enough to bear Jack and Rose together.",
      },
      {
        label: "They find a raft",
        premise: "The two lash themselves to an overturned collapsible with other survivors.",
      },
      {
        label: "A boat hears their whistle",
        premise: "Rose's whistle carries to a returning boat while Jack still has warmth in him.",
      },
    ],
  },
  {
    id: "t11",
    title: "Rose Is Rescued by the Carpathia; Jack Is Lost",
    description:
      "When a lone boat rows back through the field of frozen dead, Jack is already gone. Rose pries her hand from his and lets him slip into the deep, keeping her promise to live. At dawn the Carpathia lifts her aboard, one of some seven hundred saved out of more than two thousand — alive, and forever marked by the night.",
    phase: "Act V · The Rescue",
    timeIndex: 11,
    parentId: "t10",
    branchId: "canonical",
    canonical: true,
    probability: 0.85,
    emotionalValence: -0.6,
    uncertainty: 0.06,
    downstreamImpact: 45,
    charactersInvolved: ["Rose", "Jack", "Molly Brown"],
    whyItMatters:
      "The tragic terminus: Jack's sacrifice buys Rose's survival, and 'never let go' becomes the vow that shapes the rest of her life.",
    worldState: [
      { key: "SHIP", value: "lost beneath the North Atlantic with over 1,500 aboard" },
      { key: "JACK", value: "dead of exposure, released into the deep" },
      { key: "ROSE", value: "rescued by the Carpathia, alive and carrying his memory" },
      { key: "LOVE", value: "a promise kept — she lets go of his hand, not of him" },
      { key: "FATE", value: "some 700 saved of more than 2,200; Rose among them" },
    ],
    worldStateDiff: {
      changed: [
        { key: "SHIP", value: "lost beneath the North Atlantic with over 1,500 aboard" },
        { key: "JACK", value: "dead of exposure, released into the deep" },
        { key: "ROSE", value: "rescued by the Carpathia, alive and carrying his memory" },
        { key: "LOVE", value: "a promise kept — she lets go of his hand, not of him" },
        { key: "FATE", value: "some 700 saved of more than 2,200; Rose among them" },
      ],
    },
    terminal: true,
    perturbations: [
      {
        label: "Jack is pulled aboard too",
        premise: "The returning boat reaches Jack before the cold finishes him and both survive.",
      },
      {
        label: "Rose returns to Cal",
        premise: "Grief-stricken, Rose keeps her engagement and buries the memory of Jack for good.",
      },
      {
        label: "She tells the truth at the inquiry",
        premise: "Rose testifies openly about the ice warnings and the locked gates, and the scandal reshapes maritime law.",
      },
    ],
  },
];

// --- Branch A: "The Iceberg Is Sighted in Time" (source t4, lane -1) --------

const branchSpottedEvents: StoryEvent[] = [
  {
    id: "tis0",
    title: "The Bridge Heeds the Warning",
    description:
      "This time the ice messages are carried straight to Captain Smith, and he does the unglamorous thing: he rings down for a sharp reduction in speed and doubles the lookouts. The record crossing is abandoned. The Titanic picks her way through the night at a crawl, her wake gone quiet.",
    phase: "Alt · The Warnings",
    timeIndex: 5,
    parentId: "t4",
    branchId: "ti-spotted",
    canonical: false,
    probability: 0.62,
    emotionalValence: 0.1,
    uncertainty: 0.28,
    downstreamImpact: 84,
    charactersInvolved: ["Captain Smith", "Murdoch"],
    whyItMatters:
      "Removes the single decision that doomed the ship — at slow speed she can see and avoid what lies ahead.",
    worldState: [
      { key: "SHIP", value: "slowed to a careful crawl through the ice field" },
      { key: "JACK", value: "in love with Rose, oblivious to the danger passed" },
      { key: "ROSE", value: "in love with Jack, oblivious to the danger passed" },
      { key: "CLASS", value: "openly defied by the lovers, though the gulf remains" },
      { key: "LOVE", value: "a consummated love set against her engagement to Cal" },
      { key: "ICE", value: "warnings heeded; the ship on guard for ice" },
      { key: "SPEED", value: "eased right down to give the lookouts time" },
    ],
    worldStateDiff: {
      changed: [
        { key: "SHIP", value: "slowed to a careful crawl through the ice field" },
        { key: "ICE", value: "warnings heeded; the ship on guard for ice" },
        { key: "SPEED", value: "eased right down to give the lookouts time" },
      ],
    },
  },
  {
    id: "tis1",
    title: "The Berg Is Cleared",
    description:
      "When the black mass rises out of the dark, there is time — time to see it, time to order the turn, time for the ship to answer. The iceberg slides by to starboard, close enough to brush frost from the rigging, and is swallowed again by the night. A few passengers stir; almost no one ever knows how near it came.",
    phase: "Alt · The Near Miss",
    timeIndex: 6,
    parentId: "tis0",
    branchId: "ti-spotted",
    canonical: false,
    probability: 0.6,
    emotionalValence: 0.35,
    uncertainty: 0.3,
    downstreamImpact: 66,
    charactersInvolved: ["Fleet", "Lee", "Murdoch"],
    whyItMatters:
      "The disaster is averted outright — with the ship intact, the whole tragic cascade never begins.",
    worldState: [
      { key: "SHIP", value: "intact, steaming on with the ice astern" },
      { key: "JACK", value: "in love with Rose, the crossing uneventful" },
      { key: "ROSE", value: "in love with Jack, the crossing uneventful" },
      { key: "CLASS", value: "openly defied by the lovers, though the gulf remains" },
      { key: "LOVE", value: "a consummated love set against her engagement to Cal" },
      { key: "ICE", value: "an iceberg passed safely to starboard in the dark" },
    ],
    worldStateDiff: {
      removed: ["SPEED"],
      changed: [
        { key: "SHIP", value: "intact, steaming on with the ice astern" },
        { key: "ICE", value: "an iceberg passed safely to starboard in the dark" },
      ],
    },
  },
  {
    id: "tis2",
    title: "A Triumphant Arrival in New York",
    description:
      "The Titanic steams past the Statue of Liberty to a roaring welcome, her maiden voyage a triumph rather than a byword for disaster. Reporters crowd the pier; the line's stock soars. In the crush of arrival, first-class and steerage funnel down separate gangways, back into their separate worlds.",
    phase: "Alt · Arrival",
    timeIndex: 7,
    parentId: "tis1",
    branchId: "ti-spotted",
    canonical: false,
    probability: 0.66,
    emotionalValence: 0.4,
    uncertainty: 0.32,
    downstreamImpact: 52,
    charactersInvolved: ["Captain Smith", "Jack", "Rose", "Cal"],
    whyItMatters:
      "Survival returns the lovers to the ordinary world — where the obstacle is no longer the sea but society.",
    worldState: [
      { key: "SHIP", value: "arrived in New York on time, her voyage a triumph" },
      { key: "JACK", value: "disembarking into steerage's separate world" },
      { key: "ROSE", value: "disembarking on Cal's arm into first-class New York" },
      { key: "CLASS", value: "reasserting itself the moment the gangways drop" },
      { key: "LOVE", value: "intact but suddenly without a shared world to live in" },
    ],
    worldStateDiff: {
      removed: ["ICE"],
      changed: [
        { key: "SHIP", value: "arrived in New York on time, her voyage a triumph" },
        { key: "JACK", value: "disembarking into steerage's separate world" },
        { key: "ROSE", value: "disembarking on Cal's arm into first-class New York" },
        { key: "CLASS", value: "reasserting itself the moment the gangways drop" },
        { key: "LOVE", value: "intact but suddenly without a shared world to live in" },
      ],
    },
  },
  {
    id: "tis3",
    title: "The Colder Obstacle",
    description:
      "No sinking dissolves the distance between them now. Cal's money, Rose's mother, the whole machinery of her class close ranks against a penniless artist with nothing to offer but himself. Whether Rose can find the courage to walk away in daylight — with no catastrophe to make the choice for her — is a harder question than any iceberg. The gulf that the disaster would have erased simply endures.",
    phase: "Alt · Epilogue",
    timeIndex: 8,
    parentId: "tis2",
    branchId: "ti-spotted",
    canonical: false,
    probability: 0.48,
    emotionalValence: -0.05,
    uncertainty: 0.45,
    downstreamImpact: 34,
    charactersInvolved: ["Rose", "Jack", "Cal", "Ruth"],
    whyItMatters:
      "A bittersweet inversion: survival spares their lives but hands them the very obstacle the tragedy would have burned away.",
    worldState: [
      { key: "SHIP", value: "a triumph, already half-forgotten" },
      { key: "JACK", value: "alive, penniless, waiting at the edge of Rose's world" },
      { key: "ROSE", value: "alive, pressed back toward the match with Cal" },
      { key: "CLASS", value: "the unbridged gulf, now the only thing keeping them apart" },
      { key: "LOVE", value: "a love with no disaster to excuse it, tested by daylight and money" },
    ],
    worldStateDiff: {
      changed: [
        { key: "SHIP", value: "a triumph, already half-forgotten" },
        { key: "JACK", value: "alive, penniless, waiting at the edge of Rose's world" },
        { key: "ROSE", value: "alive, pressed back toward the match with Cal" },
        { key: "CLASS", value: "the unbridged gulf, now the only thing keeping them apart" },
        { key: "LOVE", value: "a love with no disaster to excuse it, tested by daylight and money" },
      ],
    },
    terminal: true,
  },
];

// --- Branch B: "Enough Lifeboats for All" (source t6, lane 1) ---------------

const branchBoatsEvents: StoryEvent[] = [
  {
    id: "tib0",
    title: "Boats Enough for All",
    description:
      "In this crossing the Titanic sails with a full complement of lifeboats — davits doubled up, collapsibles stacked and ready — enough for every soul aboard. When Andrews works out the sinking, the arithmetic is merciful for once: there is a seat for everyone, if only order can be kept.",
    phase: "Alt · The Boats",
    timeIndex: 7,
    parentId: "t6",
    branchId: "ti-boats",
    canonical: false,
    probability: 0.55,
    emotionalValence: -0.3,
    uncertainty: 0.3,
    downstreamImpact: 82,
    charactersInvolved: ["Andrews", "Captain Smith", "Murdoch"],
    whyItMatters:
      "Repairs the structural flaw that made the sinking a mass drowning — capacity, not ice, was the true killer.",
    worldState: [
      { key: "SHIP", value: "struck below the waterline, doomed within hours" },
      { key: "JACK", value: "in love with Rose, helping herd passengers to the boats" },
      { key: "ROSE", value: "in love with Jack, refusing to be parted from him" },
      { key: "CLASS", value: "still sharp, but no longer a death sentence" },
      { key: "LOVE", value: "a love now tested against a survivable disaster" },
      { key: "HULL", value: "flooding forward, the bow going down" },
      { key: "BOATS", value: "lifeboats for every soul aboard, swung out and ready" },
    ],
    worldStateDiff: {
      changed: [
        { key: "JACK", value: "in love with Rose, helping herd passengers to the boats" },
        { key: "CLASS", value: "still sharp, but no longer a death sentence" },
        { key: "LOVE", value: "a love now tested against a survivable disaster" },
      ],
      added: [{ key: "BOATS", value: "lifeboats for every soul aboard, swung out and ready" }],
    },
  },
  {
    id: "tib1",
    title: "The Orderly Evacuation",
    description:
      "With boats to spare there is no need for the ruthless triage of canon. The gates to steerage are thrown open, families are kept together, and the officers load in calm, deliberate rounds. The ship still dies — but she dies emptying, not drowning her passengers by the hundred.",
    phase: "Alt · The Evacuation",
    timeIndex: 8,
    parentId: "tib0",
    branchId: "ti-boats",
    canonical: false,
    probability: 0.58,
    emotionalValence: -0.05,
    uncertainty: 0.32,
    downstreamImpact: 64,
    charactersInvolved: ["Murdoch", "Molly Brown", "Andrews"],
    whyItMatters:
      "Turns the boat deck from a scene of abandonment into one of rescue — nearly everyone lives.",
    worldState: [
      { key: "SHIP", value: "sinking slowly, her decks emptying in order" },
      { key: "JACK", value: "in love with Rose, moving toward a boat with her" },
      { key: "ROSE", value: "in love with Jack, staying at his side through the loading" },
      { key: "CLASS", value: "set aside — steerage led up and loaded alongside the rest" },
      { key: "LOVE", value: "a love that no longer has to choose against survival" },
      { key: "HULL", value: "flooding steadily, but hours of grace remain" },
      { key: "BOATS", value: "loading in calm rounds, nearly all aboard being saved" },
    ],
    worldStateDiff: {
      changed: [
        { key: "SHIP", value: "sinking slowly, her decks emptying in order" },
        { key: "ROSE", value: "in love with Jack, staying at his side through the loading" },
        { key: "CLASS", value: "set aside — steerage led up and loaded alongside the rest" },
        { key: "LOVE", value: "a love that no longer has to choose against survival" },
        { key: "HULL", value: "flooding steadily, but hours of grace remain" },
        { key: "BOATS", value: "loading in calm rounds, nearly all aboard being saved" },
      ],
    },
  },
  {
    id: "tib2",
    title: "Jack and Rose Board Together",
    description:
      "There is no need for Rose to leap back onto a dying ship, no need for Jack to give up a seat he does not have. An officer waves them both into a boat and it is lowered away, the falls paying out smoothly toward the black water. They watch the Titanic go down from the safety of the same thwart, hands locked together.",
    phase: "Alt · The Boat",
    timeIndex: 9,
    parentId: "tib1",
    branchId: "ti-boats",
    canonical: false,
    probability: 0.62,
    emotionalValence: 0.3,
    uncertainty: 0.3,
    downstreamImpact: 50,
    charactersInvolved: ["Jack", "Rose", "Cal"],
    whyItMatters:
      "The exact inversion of the canonical parting — the shortage that separated the lovers no longer exists.",
    worldState: [
      { key: "SHIP", value: "foundering, watched from the boats below" },
      { key: "JACK", value: "safe in a lifeboat beside Rose" },
      { key: "ROSE", value: "safe in a lifeboat beside Jack" },
      { key: "CLASS", value: "receding — the sea and the boats level everyone" },
      { key: "LOVE", value: "intact and, for once, unthreatened by the disaster" },
      { key: "BOATS", value: "away and full, riding the swell toward rescue" },
    ],
    worldStateDiff: {
      removed: ["HULL"],
      changed: [
        { key: "SHIP", value: "foundering, watched from the boats below" },
        { key: "JACK", value: "safe in a lifeboat beside Rose" },
        { key: "ROSE", value: "safe in a lifeboat beside Jack" },
        { key: "CLASS", value: "receding — the sea and the boats level everyone" },
        { key: "LOVE", value: "intact and, for once, unthreatened by the disaster" },
        { key: "BOATS", value: "away and full, riding the swell toward rescue" },
      ],
    },
  },
  {
    id: "tib3",
    title: "Onto the Carpathia, Together",
    description:
      "At dawn the Carpathia lifts them from the boats, two among the many hundreds saved. Jack and Rose stand at her rail wrapped in the same blanket, alive and shivering and free, with New York somewhere ahead and nothing behind but open water. What waits for a penniless artist and a runaway heiress is uncertain — but it is theirs, and it is living.",
    phase: "Alt · Epilogue",
    timeIndex: 10,
    parentId: "tib2",
    branchId: "ti-boats",
    canonical: false,
    probability: 0.55,
    emotionalValence: 0.55,
    uncertainty: 0.35,
    downstreamImpact: 36,
    charactersInvolved: ["Jack", "Rose"],
    whyItMatters:
      "A survivable disaster delivers the ending canon withheld — both lovers alive, facing the future together.",
    worldState: [
      { key: "SHIP", value: "lost, but with most of her people saved" },
      { key: "JACK", value: "alive on the Carpathia, bound for New York with Rose" },
      { key: "ROSE", value: "alive on the Carpathia, free of Cal and beside Jack" },
      { key: "CLASS", value: "left behind on the sinking ship, at least for now" },
      { key: "LOVE", value: "a love facing an uncertain but living future" },
    ],
    worldStateDiff: {
      removed: ["BOATS"],
      changed: [
        { key: "SHIP", value: "lost, but with most of her people saved" },
        { key: "JACK", value: "alive on the Carpathia, bound for New York with Rose" },
        { key: "ROSE", value: "alive on the Carpathia, free of Cal and beside Jack" },
        { key: "CLASS", value: "left behind on the sinking ship, at least for now" },
        { key: "LOVE", value: "a love facing an uncertain but living future" },
      ],
    },
    terminal: true,
  },
];

// --- Branch C: "Jack Climbs Onto the Door" (source t10, lane 2) -------------

const branchDoorEvents: StoryEvent[] = [
  {
    id: "tid0",
    title: "Both Balance onto the Panel",
    description:
      "This time they work it out together — shifting their weight, spreading their arms, trimming the floating panel like a raft until it bears them both clear of the water. It is precarious and it is freezing, but neither of them is in the sea. For the first time since the ship went down, there is a way this ends alive.",
    phase: "Alt · The Water",
    timeIndex: 11,
    parentId: "t10",
    branchId: "ti-door",
    canonical: false,
    probability: 0.42,
    emotionalValence: -0.4,
    uncertainty: 0.4,
    downstreamImpact: 78,
    charactersInvolved: ["Jack", "Rose"],
    whyItMatters:
      "Overturns the story's most argued-over moment — with Jack out of the water, his death is no longer inevitable.",
    worldState: [
      { key: "SHIP", value: "gone; only debris and swimmers remain" },
      { key: "JACK", value: "balanced on the panel beside Rose, out of the water" },
      { key: "ROSE", value: "balanced on the panel beside Jack, out of the water" },
      { key: "LOVE", value: "a shared refusal to let the cold take either of them" },
      { key: "FATE", value: "both on the panel, racing the cold until a boat returns" },
    ],
    worldStateDiff: {
      changed: [
        { key: "JACK", value: "balanced on the panel beside Rose, out of the water" },
        { key: "ROSE", value: "balanced on the panel beside Jack, out of the water" },
        { key: "LOVE", value: "a shared refusal to let the cold take either of them" },
        { key: "FATE", value: "both on the panel, racing the cold until a boat returns" },
      ],
    },
  },
  {
    id: "tid1",
    title: "Surviving the Night",
    description:
      "They keep each other awake through the worst hours, talking, arguing, singing scraps of songs, doing anything to fend off the numbing pull of sleep. The stars wheel overhead and the cries around them thin and fall silent one by one. When the lantern of a returning boat finally swings across the water, both of them are still answering it.",
    phase: "Alt · The Long Cold",
    timeIndex: 12,
    parentId: "tid0",
    branchId: "ti-door",
    canonical: false,
    probability: 0.45,
    emotionalValence: -0.2,
    uncertainty: 0.42,
    downstreamImpact: 60,
    charactersInvolved: ["Jack", "Rose"],
    whyItMatters:
      "Endurance replaces sacrifice — the night is survived by two instead of paid for by one.",
    worldState: [
      { key: "SHIP", value: "gone; the sea gone quiet with the dead" },
      { key: "JACK", value: "shivering on the panel, kept awake by Rose" },
      { key: "ROSE", value: "shivering on the panel, kept awake by Jack" },
      { key: "LOVE", value: "the only warmth left, and enough to last the night" },
      { key: "FATE", value: "a returning boat's lantern swinging toward them" },
    ],
    worldStateDiff: {
      changed: [
        { key: "SHIP", value: "gone; the sea gone quiet with the dead" },
        { key: "JACK", value: "shivering on the panel, kept awake by Rose" },
        { key: "ROSE", value: "shivering on the panel, kept awake by Jack" },
        { key: "LOVE", value: "the only warmth left, and enough to last the night" },
        { key: "FATE", value: "a returning boat's lantern swinging toward them" },
      ],
    },
  },
  {
    id: "tid2",
    title: "Pulled Aboard the Carpathia",
    description:
      "The boat reaches them while there is still life in both, and hands haul them out of the cold and under blankets. At dawn the Carpathia takes them up together, two frozen survivors clinging to one another on her deck. The panel that in canon carried one of them home now carries them both.",
    phase: "Alt · The Rescue",
    timeIndex: 13,
    parentId: "tid1",
    branchId: "ti-door",
    canonical: false,
    probability: 0.5,
    emotionalValence: 0.4,
    uncertainty: 0.4,
    downstreamImpact: 52,
    charactersInvolved: ["Jack", "Rose", "Molly Brown"],
    whyItMatters:
      "The wild premise pays off — both lovers survive the night that canon reserved for Jack's death.",
    worldState: [
      { key: "SHIP", value: "lost beneath the North Atlantic" },
      { key: "JACK", value: "alive aboard the Carpathia, frostbitten but living" },
      { key: "ROSE", value: "alive aboard the Carpathia, still holding on to Jack" },
      { key: "LOVE", value: "a love that outlasted the freezing water" },
      { key: "FATE", value: "both among the saved, against every odd" },
    ],
    worldStateDiff: {
      changed: [
        { key: "SHIP", value: "lost beneath the North Atlantic" },
        { key: "JACK", value: "alive aboard the Carpathia, frostbitten but living" },
        { key: "ROSE", value: "alive aboard the Carpathia, still holding on to Jack" },
        { key: "LOVE", value: "a love that outlasted the freezing water" },
        { key: "FATE", value: "both among the saved, against every odd" },
      ],
    },
  },
  {
    id: "tid3",
    title: "Daylight and Poverty",
    description:
      "The Carpathia lands them in a rain-soaked New York with nothing but each other and the clothes they were pulled from the sea in. Rose gives a false name to the officials and turns her back on Cal's world for good. Now the love that canon froze into a perfect tragedy has to do the hard, unglamorous work of surviving in the daylight, on no money at all.",
    phase: "Alt · The Aftermath",
    timeIndex: 14,
    parentId: "tid2",
    branchId: "ti-door",
    canonical: false,
    probability: 0.46,
    emotionalValence: 0.2,
    uncertainty: 0.45,
    downstreamImpact: 40,
    charactersInvolved: ["Jack", "Rose", "Cal"],
    whyItMatters:
      "Survival hands the lovers a new and harder test — poverty and ordinary life, which no shipwreck can romanticise.",
    worldState: [
      { key: "JACK", value: "alive and penniless in New York, with only Rose" },
      { key: "ROSE", value: "alive under a false name, cut off from Cal's money" },
      { key: "LOVE", value: "tested now by daylight, poverty and time" },
      { key: "FATE", value: "two survivors starting over with nothing" },
      { key: "LIFE", value: "a rented room, odd jobs, and everything still to prove" },
    ],
    worldStateDiff: {
      removed: ["SHIP"],
      changed: [
        { key: "JACK", value: "alive and penniless in New York, with only Rose" },
        { key: "ROSE", value: "alive under a false name, cut off from Cal's money" },
        { key: "LOVE", value: "tested now by daylight, poverty and time" },
        { key: "FATE", value: "two survivors starting over with nothing" },
      ],
      added: [{ key: "LIFE", value: "a rented room, odd jobs, and everything still to prove" }],
    },
  },
  {
    id: "tid4",
    title: "Years Later",
    description:
      "The years are neither the tragedy of canon nor a fairy tale. There are lean winters and quarrels, a few of Jack's drawings sold, a small life built plank by plank far from the world Rose was born to. Whether the love that a single freezing night made immortal can also be made ordinary and endure — that is the wild branch's real question, and it has no tidy answer, only a lived one.",
    phase: "Alt · Epilogue",
    timeIndex: 15,
    parentId: "tid3",
    branchId: "ti-door",
    canonical: false,
    probability: 0.4,
    emotionalValence: 0.35,
    uncertainty: 0.5,
    downstreamImpact: 30,
    charactersInvolved: ["Jack", "Rose"],
    whyItMatters:
      "A frankly speculative coda: the love canon preserved by ending it must now prove it can survive being lived.",
    worldState: [
      { key: "JACK", value: "an ageing artist, his best-known sketch drawn on a sinking ship" },
      { key: "ROSE", value: "grown old with Jack, the heiress she was long left behind" },
      { key: "LOVE", value: "no longer immortal by tragedy, but by the length of a life" },
      { key: "FATE", value: "a survival canon never allowed — endured, imperfect, real" },
      { key: "LIFE", value: "an ordinary, hard-won life the shipwreck could not script" },
    ],
    worldStateDiff: {
      changed: [
        { key: "JACK", value: "an ageing artist, his best-known sketch drawn on a sinking ship" },
        { key: "ROSE", value: "grown old with Jack, the heiress she was long left behind" },
        { key: "LOVE", value: "no longer immortal by tragedy, but by the length of a life" },
        { key: "FATE", value: "a survival canon never allowed — endured, imperfect, real" },
        { key: "LIFE", value: "an ordinary, hard-won life the shipwreck could not script" },
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
    premise: "",
    plausibility: "faithful",
    lane: 0,
    createdOrder: -1,
  },
  {
    id: "ti-spotted",
    label: "The Iceberg Is Sighted in Time",
    canonical: false,
    sourceNodeId: "t4",
    premise: "The bridge heeds the ice warnings and slows the ship",
    plausibility: "balanced",
    lane: -1,
    createdOrder: 0,
  },
  {
    id: "ti-boats",
    label: "Enough Lifeboats for All",
    canonical: false,
    sourceNodeId: "t6",
    premise: "The ship carries lifeboats for everyone aboard",
    plausibility: "faithful",
    lane: 1,
    createdOrder: 1,
  },
  {
    id: "ti-door",
    label: "Jack Climbs Onto the Door",
    canonical: false,
    sourceNodeId: "t10",
    premise: "Both of them balance onto the floating panel and survive the night",
    plausibility: "wild",
    lane: 2,
    createdOrder: 2,
  },
];

// --- Assembled story -------------------------------------------------------

export const titanic: Story = {
  id: "titanic",
  title: "Titanic",
  author: "James Cameron",
  blurb:
    "A love kindled in steerage and a ship steered into the ice: the fragile chain of luck, hubris, and split-second chance that carries the unsinkable Titanic — and the two who loved aboard her — to the bottom of the North Atlantic. Reroll any event to simulate the crossing that might have been.",
  events: [
    ...canonicalEvents,
    ...branchSpottedEvents,
    ...branchBoatsEvents,
    ...branchDoorEvents,
  ],
  branches: seededBranches,
};
