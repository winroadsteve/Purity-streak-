import { Scripture } from "../types";

export const CURATED_SCRIPTURES: Scripture[] = [
  {
    id: "sc-01",
    reference: "1 Corinthians 6:18-20",
    text: "Flee sexual immorality. Every other sin a person commits is outside the body, but the sexually immoral person sins against his own body. Or do you not know that your body is a temple of the Holy Spirit within you, whom you have from God? You are not your own, for you were bought with a price. So glorify God in your body.",
    category: "fleeing_lust",
    insight: "This passage uses the Greek word 'Pheugote' which means to run away with extreme urgency. Paul advises us not to stay and debate with lust, but to physically and mentally flee. Your body is not a garbage disposal for dopamine triggers; it is a sacred temple hosting the Third Person of the Trinity."
  },
  {
    id: "sc-02",
    reference: "Job 31:1",
    text: "I have made a covenant with my eyes; how then could I gaze at a virgin?",
    category: "purity_of_mind",
    insight: "Job highlights the concept of 'custody of the eyes.' Temptation almost always enters through the visual gateway. Making a covenant with your eyes means making a proactive, non-negotiable decision to look away the exact fraction of a second you encounter a triggering image, before the second look turns into desire."
  },
  {
    id: "sc-03",
    reference: "Matthew 5:28-29",
    text: "But I say to you that everyone who looks at a woman with lustful intent has already committed adultery with her in his heart. If your right eye causes you to sin, tear it out and throw it away. For it is better that you lose one of your members than that your whole body be thrown into hell.",
    category: "fleeing_lust",
    insight: "Jesus shows us that lust isn't just an external act; it begins with the intent of the gaze. His instructions to 'tear out your eye' are hyperbolic but teach radical amputation: you must remove the triggers immediately. Delete the trigger apps, put limits on your phone, and establish absolute accountability."
  },
  {
    id: "sc-04",
    reference: "Galatians 5:16",
    text: "But I say, walk by the Spirit, and you will not gratify the desires of the flesh.",
    category: "self_control",
    insight: "Purity is not merely a battle of 'not doing' something—it is a proactive fill-up. If you walk by the Spirit (spending time in prayer, reading scripture, practicing gratitude), your soul becomes saturated with God's presence. There is less space for the empty, shallow promises of lust."
  },
  {
    id: "sc-05",
    reference: "James 4:7-8",
    text: "Submit yourselves therefore to God. Resist the devil, and he will flee from you. Draw near to God, and he will draw near to you. Cleanse your hands, you sinners, and purify your hearts, you double-minded.",
    category: "spiritual_warfare",
    insight: "Notice the order of action: first, submit to God. You cannot resist the enemy on your own human willpower. When you humble yourself and submit your eyes, your devices, and your thoughts to Christ, you receive divine authority to resist. Only then will the devil flee."
  },
  {
    id: "sc-06",
    reference: "1 Thessalonians 4:3-5",
    text: "For this is the will of God, your sanctification: that you abstain from sexual immorality; that each one of you know how to control his own body in holiness and honor, not in the passion of lust like the Gentiles who do not know God.",
    category: "self_control",
    insight: "Lust treats people as objects to be consumed for sensory pleasure. Holiness treats people with deep honor and respect. Sanctification is the process of training your nervous system to seek God's high-purity joy rather than cheap, simulated visual consumption."
  },
  {
    id: "sc-07",
    reference: "Philippians 4:8",
    text: "Finally, brothers, whatever is true, whatever is honorable, whatever is just, whatever is pure, whatever is lovely, whatever is commendable, if there is any excellence, if there is anything worthy of praise, think about these things.",
    category: "purity_of_mind",
    insight: "The mind cannot remain completely empty; it is a factory of thoughts. To displace lustful thoughts, you must crowd them out by deliberately feeding your mind with what is pure, noble, and excellent. Spend time in creative pursuits, physical training, and reading enriching books."
  },
  {
    id: "sc-08",
    reference: "Ephesians 6:13",
    text: "Therefore take up the whole armor of God, that you may be able to withstand in the evil day, and having done all, to stand firm.",
    category: "spiritual_warfare",
    insight: "The spiritual battle requires active armor. Truth, righteousness, the gospel of peace, faith, salvation, and the sword of the Spirit (the Word of God). When an urge attacks, do not sit passively. Draw the sword by quoting scripture aloud to break the mental atmosphere."
  },
  {
    id: "sc-09",
    reference: "Romans 5:20-21",
    text: "Now the law came in to increase the trespass, but where sin increased, grace abounded all the more, so that, as sin reigned in death, grace also might reign through righteousness leading to eternal life through Jesus Christ our Lord.",
    category: "grace_and_mercy",
    insight: "If you have slipped or relapsed, the enemy's favorite tactic is condemnation and shame, which actually drives you to hide and relapse *again*. God's response to your weakness is abundant grace. Repent immediately, receive His forgiveness, and step back onto the narrow path with your head held high."
  },
  {
    id: "sc-10",
    reference: "Psalm 119:9-11",
    text: "How can a young man keep his way pure? By guarding it according to your word. With my whole heart I seek you; let me not wander from your commandments! I have stored up your word in my heart, that I might not sin against you.",
    category: "purity_of_mind",
    insight: "Memorizing scripture is spiritual biohacking. When your brain is triggered, having these exact verses pre-loaded in your active memory allows your prefrontal cortex to quickly override the impulsive limbic system, restoring spiritual self-awareness."
  }
];
export type ScriptureCategory = "fleeing_lust" | "grace_and_mercy" | "self_control" | "purity_of_mind" | "spiritual_warfare";
