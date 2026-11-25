export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  detail: string;
}

export interface ConfigurableField {
  label: string;
  value: string;
  pending: boolean;
  note?: string;
}

export interface JourneyChapter {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  assetKey: 'journeyGiBelt' | 'journeyStanceMats' | 'journeyDojoAtmosphere';
  entrance: 'left' | 'right' | 'center';
}

export interface CompetitionSlide {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  assetKey: 'competitorJacketBack' | 'journeyStanceMats' | 'journeyGiBelt' | 'championMedal';
  badge: string;
}

export interface SiteConfiguration {
  /**
   * Toggle demo mode:
   * - true: displays clearly labelled sample statistics, demo testimonials, and pending placeholders.
   * - false: hides unverified demo statistics, fictional testimonials, and incomplete contact placeholders.
   */
  demoMode: boolean;
  brand: {
    wordmark: string;
    narrative: string;
    heroHeadline: string[];
    heroSubline: string;
    heroPromptTitle: string;
    heroPromptCopy: string;
  };
  navigation: NavItem[];
  about: {
    chapterLabel: string;
    headingLines: string[];
    lead: string;
    paragraphs: string[];
    pillars: { title: string; text: string }[];
  };
  journey: {
    chapterLabel: string;
    headingLines: string[];
    subheadings: string[];
    chapters: JourneyChapter[];
  };
  competitor: {
    chapterLabel: string;
    headingLines: string[];
    subtitle: string;
    jacketNotice: string;
    slides: CompetitionSlide[];
  };
  champion: {
    chapterLabel: string;
    headingLines: string[];
    lead: string;
    fields: ConfigurableField[];
  };
  training: {
    chapterLabel: string;
    headingLines: string[];
    lead: string;
    benefits: { title: string; description: string }[];
    programFields: ConfigurableField[];
  };
  stats: {
    chapterLabel: string;
    heading: string;
    demoBadge: string;
    items: StatItem[];
  };
  contact: {
    chapterLabel: string;
    headingLines: string[];
    lead: string;
    channels: {
      label: string;
      value: string;
      href: string | null;
      pending: boolean;
    }[];
  };
}

export const SITE_CONFIG: SiteConfiguration = {
  demoMode: true,
  brand: {
    wordmark: 'ADITYA',
    narrative: 'THE JUDGE. THE FIGHTER. THE COMPETITOR. THE CHAMPION. THE MENTOR.',
    heroHeadline: ['DISCIPLINE.', 'DEFINED.'],
    heroSubline: 'Karate. Character. Commitment.',
    heroPromptTitle: 'THE FIGHTER WITHIN',
    heroPromptCopy: 'Move your cursor to discover the fighter beneath the uniform.',
  },
  navigation: [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'journey', label: 'Journey', href: '#journey' },
    { id: 'achievements', label: 'Achievements', href: '#achievements' },
    { id: 'training', label: 'Training', href: '#training' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ],
  about: {
    chapterLabel: 'CHAPTER 02 — BEYOND THE UNIFORM',
    headingLines: ['MORE THAN', 'A FIGHTER.'],
    lead: 'Stepping onto the tatami demands two distinct disciplines: the impartiality of an official judge, and the relentless focus of a competitor.',
    paragraphs: [
      'Before any bout begins, Aditya stands in blazer and tie—reading posture, balance, timing, and spirit with measured precision. Yet the standards he enforces from the edge of the mat were forged inside the gi.',
      'Across competition, officiating, and instruction, his approach stays rooted in traditional karate values: quiet preparation, technical clarity, and accountability under pressure.',
    ],
    pillars: [
      {
        title: 'The Judge',
        text: 'Calm observation, rule-book clarity, and unbiased decision-making at the centre of the mat.',
      },
      {
        title: 'The Competitor',
        text: 'Years of conditioning, tactical composure, and stepping out under national team colours.',
      },
      {
        title: 'The Mentor',
        text: 'Passing down structured fundamentals so students build focus and character beyond belts.',
      },
    ],
  },
  journey: {
    chapterLabel: "CHAPTER 03 — THE FIGHTER'S JOURNEY",
    headingLines: ['BUILT THROUGH', 'DISCIPLINE.'],
    subheadings: ['THE JOURNEY', 'EVERY MOVEMENT HAS PURPOSE'],
    chapters: [
      {
        index: '03.1',
        title: 'THE KNOT & THE CODE',
        subtitle: 'Conceptual Visual Study',
        description:
          'Every session begins in silence—straightening the lapel, tying the belt, and leaving hesitation outside the dojo threshold.',
        assetKey: 'journeyGiBelt',
        entrance: 'left',
      },
      {
        index: '03.2',
        title: 'GROUNDED UNDER PRESSURE',
        subtitle: 'Conceptual Visual Study',
        description:
          'Balance precedes speed. Power begins in bare feet anchored against tournament mats long before a strike is thrown.',
        assetKey: 'journeyStanceMats',
        entrance: 'right',
      },
      {
        index: '03.3',
        title: 'STILLNESS BEFORE THE CALL',
        subtitle: 'Conceptual Visual Study',
        description:
          'Empty wooden floors at dawn, repetition without applause, and standards upheld whether anyone is watching or not.',
        assetKey: 'journeyDojoAtmosphere',
        entrance: 'center',
      },
    ],
  },
  competitor: {
    chapterLabel: 'CHAPTER 04 — THE COMPETITOR',
    headingLines: ['CARRYING', 'THE COLOURS.'],
    subtitle:
      'Wearing the white, blue, and black IASK-DO INDIA team jacket—representing years of commitment before stepping onto the competition floor.',
    jacketNotice:
      'Authentic IASK-DO INDIA team jacket details preserved without unverified competition claims.',
    slides: [
      {
        index: '01 / 04',
        eyebrow: 'AUTHENTIC TEAM APPAREL',
        title: 'IASK-DO INDIA',
        body: 'The jacket carries weight only because of the hours logged in training before the tournament draw is ever announced.',
        assetKey: 'competitorJacketBack',
        badge: 'Authentic Photograph Slot',
      },
      {
        index: '02 / 04',
        eyebrow: 'CONCEPTUAL STUDY',
        title: 'STANCE & TIMING',
        body: 'Distance control, sharp footwork, and reading an opponent’s rhythm within fractions of a second.',
        assetKey: 'journeyStanceMats',
        badge: 'Conceptual Photography',
      },
      {
        index: '03 / 04',
        eyebrow: 'CONCEPTUAL STUDY',
        title: 'UNIFORM DISCIPLINE',
        body: 'Crisp white cotton, structured posture, and technical habits refined through thousands of deliberate repetitions.',
        assetKey: 'journeyGiBelt',
        badge: 'Conceptual Photography',
      },
      {
        index: '04 / 04',
        eyebrow: 'EARNED ON THE MAT',
        title: 'THE PODIUM MOMENT',
        body: 'Every medal represents months of unglamorous preparation distilled into a few decisive minutes on the tatami.',
        assetKey: 'championMedal',
        badge: 'Authentic Photograph Slot',
      },
    ],
  },
  champion: {
    chapterLabel: 'CHAPTER 05 — THE CHAMPION',
    headingLines: ['EARNED.', 'NOT GIVEN.'],
    lead: 'Configurable record of verified championships, medals, certifications, and official judging credentials—awaiting confirmed documentation.',
    fields: [
      {
        label: 'Championships & Podium Finishes',
        value: 'Pending verified tournament records from Aditya',
        pending: true,
        note: 'Add verified tournament names, categories, and years here.',
      },
      {
        label: 'Medals & Awards',
        value: 'Authentic medal photograph reserved (awaiting event details)',
        pending: true,
        note: 'Confirm event title, division, and medal classification.',
      },
      {
        label: 'Competition Experience',
        value: 'IASK-DO INDIA team jacket representation — verified details pending',
        pending: true,
      },
      {
        label: 'Certifications & Judging Qualifications',
        value: 'Official Karate Judge uniform verified — credential codes pending',
        pending: true,
        note: 'Add association name, licence grade, and certification year.',
      },
    ],
  },
  training: {
    chapterLabel: 'CHAPTER 06 — THE MENTOR',
    headingLines: ['STRENGTH IS TAUGHT.', 'DISCIPLINE IS EARNED.'],
    lead: 'Karate training led with the precision of a judge and the standards of a competitor—focused on fundamentals, awareness, and steady personal growth.',
    benefits: [
      {
        title: 'Discipline & Etiquette',
        description: 'Structured dojo conduct that carries over into academics, work, and daily habits.',
      },
      {
        title: 'Confidence & Composure',
        description: 'Measured self-assurance built through progressive challenges rather than loud bravado.',
      },
      {
        title: 'Physical Conditioning',
        description: 'Balance, mobility, coordination, and functional strength rooted in traditional kata and kumite.',
      },
      {
        title: 'Focus & Respect',
        description: 'Sharp attention to instruction, respect for training partners, and consistency over intensity.',
      },
    ],
    programFields: [
      {
        label: 'Training Programmes',
        value: 'Traditional Karate Fundamentals, Kata & Kumite Conditioning (Full curriculum pending)',
        pending: true,
      },
      {
        label: 'Age Groups',
        value: 'Pending confirmation (Kids, Youth, and Adult batch breakdown)',
        pending: true,
      },
      {
        label: 'Beginner & Advanced Classes',
        value: 'Structured progression tracks — exact batch tiers pending',
        pending: true,
      },
      {
        label: 'Class Timings',
        value: 'Pending official weekly schedule from Aditya',
        pending: true,
      },
      {
        label: 'Training Locations',
        value: 'Pending confirmed dojo address and city details',
        pending: true,
      },
      {
        label: 'Enrolment Information',
        value: 'Trial session and registration procedure pending confirmation',
        pending: true,
      },
    ],
  },
  stats: {
    chapterLabel: 'CHAPTER 07 — THE IMPACT',
    heading: 'MEASURED IN CONSISTENCY',
    demoBadge: 'Sample Statistics — Pending Verification',
    items: [
      {
        id: 'students',
        value: 250,
        suffix: '+',
        label: 'Students Trained',
        detail: 'Sample metric pending official dojo records',
      },
      {
        id: 'experience',
        value: 10,
        suffix: '+',
        label: 'Years of Experience',
        detail: 'Sample metric pending verified timeline',
      },
      {
        id: 'satisfaction',
        value: 98,
        suffix: '%',
        label: 'Student Satisfaction',
        detail: 'Sample metric pending verified feedback survey',
      },
    ],
  },
  contact: {
    chapterLabel: 'CHAPTER 08 — THE NEXT CHAPTER',
    headingLines: ['THE JOURNEY', 'NEVER ENDS.'],
    lead: 'For class enquiries, personal coaching, seminars, or officiating invitations, connect once verified contact details are published.',
    channels: [
      {
        label: 'Instagram',
        value: 'Pending official handle',
        href: null,
        pending: true,
      },
      {
        label: 'WhatsApp',
        value: 'Pending verified number',
        href: null,
        pending: true,
      },
      {
        label: 'Email',
        value: 'Pending official email address',
        href: null,
        pending: true,
      },
      {
        label: 'Training Location',
        value: 'Pending confirmed dojo address',
        href: null,
        pending: true,
      },
    ],
  },
};
