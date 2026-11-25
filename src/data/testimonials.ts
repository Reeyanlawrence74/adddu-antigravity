export interface TestimonialItem {
  id: string;
  initials: string;
  authorLabel: string;
  perspective: 'Parent' | 'Beginner' | 'Student' | 'Competitor';
  rating: 5 | 4;
  timeframe: string;
  quote: string;
}

export const DEMO_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'demo-1',
    initials: 'R.K.',
    authorLabel: 'Parent of Junior Student',
    perspective: 'Parent',
    rating: 5,
    timeframe: 'Sample Entry',
    quote:
      'Within four months my son stopped rushing through every drill and started paying attention to posture, breathing, and listening. The calm discipline in class makes a genuine difference at home.',
  },
  {
    id: 'demo-2',
    initials: 'S.M.',
    authorLabel: 'Adult Beginner',
    perspective: 'Beginner',
    rating: 5,
    timeframe: 'Sample Entry',
    quote:
      'Joining karate in my late twenties felt intimidating at first, but Aditya breaks down stances and footwork clearly without ego. Every session pushes your stamina while keeping technique clean.',
  },
  {
    id: 'demo-3',
    initials: 'A.P.',
    authorLabel: 'Intermediate Student',
    perspective: 'Student',
    rating: 5,
    timeframe: 'Sample Entry',
    quote:
      'Because he officiates as a judge as well as competing, his feedback is exact. You learn why a guard drops or why a technique scores instead of just repeating punches blindly.',
  },
  {
    id: 'demo-4',
    initials: 'N.D.',
    authorLabel: 'Parent of Two Trainees',
    perspective: 'Parent',
    rating: 5,
    timeframe: 'Sample Entry',
    quote:
      'There is no chaos or shouting in the dojo—just high expectations, mutual respect, and steady encouragement. Both of my children look forward to training every week.',
  },
  {
    id: 'demo-5',
    initials: 'V.T.',
    authorLabel: 'Tournament Trainee',
    perspective: 'Competitor',
    rating: 5,
    timeframe: 'Sample Entry',
    quote:
      'Preparation before inter-dojo events changed how I handle nerves. Learning to reset breathing between exchanges helped me stay composed even when trailing on points.',
  },
  {
    id: 'demo-6',
    initials: 'K.S.',
    authorLabel: 'Evening Batch Student',
    perspective: 'Student',
    rating: 4,
    timeframe: 'Sample Entry',
    quote:
      'Warm-ups are demanding and fundamentals are corrected relentlessly, which is exactly why you see real progress in balance and focus after a few weeks.',
  },
  {
    id: 'demo-7',
    initials: 'M.B.',
    authorLabel: 'Parent of Teen Student',
    perspective: 'Parent',
    rating: 5,
    timeframe: 'Sample Entry',
    quote:
      'Confidence came quietly—not from flashy tricks, but from showing up consistently and earning every small correction. A grounded mentor for young students.',
  },
];
