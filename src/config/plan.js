// ============================================================
// YOUR 240-DAY PLAN — edit freely, the app picks it up live.
// Phase days are 1-based offsets from your plan start date
// (start date itself is editable inside the app → Java HQ).
// ============================================================

export const PHASES = [
  {
    name: 'Phase 1 · Java Core + DSA Basics',
    from: 1,
    to: 30,
    focus: 'Arrays, strings, hashing, two pointers, sliding window · Collections internals, generics, streams',
  },
  {
    name: 'Phase 2 · Spring Depth + Linear DS',
    from: 31,
    to: 60,
    focus: 'Linked lists, stacks, queues, recursion, binary search · DI internals, @Transactional, Security + JWT',
  },
  {
    name: 'Phase 3 · Trees + Project Kickoff',
    from: 61,
    to: 90,
    focus: 'Trees, heaps, BFS/DFS, 1-D DP · Project backend starts · weekly mock interviews',
  },
  {
    name: 'Phase 4 · DP/Graphs + Project Finish',
    from: 91,
    to: 120,
    focus: '2-D DP, graphs deeper · Frontend done, Redis, Docker, deploy',
  },
  {
    name: 'Phase 5 · System Design (HLD)',
    from: 121,
    to: 150,
    focus: 'Scaling, caching, queues, DB design · design 2 systems end-to-end per week',
  },
  {
    name: 'Phase 6 · Revision + Mock Grind',
    from: 151,
    to: 180,
    focus: 'Weak-topic revision · 2-3 mocks per week · resume + LinkedIn polish',
  },
  {
    name: 'Phase 7 · Applications + Interviews',
    from: 181,
    to: 210,
    focus: 'Apply daily · company-specific prep · behavioral stories (STAR)',
  },
  {
    name: 'Phase 8 · Offer Season',
    from: 211,
    to: 240,
    focus: 'Interview loops · negotiate · keep DSA warm with 3 problems/day',
  },
]

// Cumulative DSA problem targets by plan day — tune to your pace.
export const DSA_MILESTONES = [
  { day: 30, target: 70 },
  { day: 60, target: 130 },
  { day: 90, target: 180 },
  { day: 120, target: 220 },
  { day: 150, target: 250 },
  { day: 180, target: 280 },
  { day: 210, target: 310 },
  { day: 240, target: 340 },
]

export const DSA_TOPICS = [
  'Arrays',
  'Strings',
  'Hashing',
  'Two Pointers',
  'Sliding Window',
  'Linked List',
  'Stack / Queue',
  'Binary Search',
  'Recursion / Backtracking',
  'Trees',
  'Heap',
  'Graphs',
  'DP',
  'Other',
]
