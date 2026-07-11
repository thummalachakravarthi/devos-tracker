// Daily rotating quote — deterministic (same day → same quote for everyone).
// Focused on study, discipline, growth, engineering.

export const QUOTES = [
  { q: "The expert in anything was once a beginner.", a: "Helen Hayes" },
  { q: "Discipline is choosing between what you want now and what you want most.", a: "Abraham Lincoln" },
  { q: "It always seems impossible until it\'s done.", a: "Nelson Mandela" },
  { q: "Success is the sum of small efforts, repeated day in and day out.", a: "Robert Collier" },
  { q: "Don\'t watch the clock; do what it does. Keep going.", a: "Sam Levenson" },
  { q: "A year from now you may wish you had started today.", a: "Karen Lamb" },
  { q: "Hard work beats talent when talent doesn\'t work hard.", a: "Tim Notke" },
  { q: "Amateurs sit and wait for inspiration. The rest of us just get up and go to work.", a: "Stephen King" },
  { q: "You don\'t rise to the level of your goals. You fall to the level of your systems.", a: "James Clear" },
  { q: "Motivation gets you going. Discipline keeps you growing.", a: "John C. Maxwell" },
  { q: "Continuous improvement is better than delayed perfection.", a: "Mark Twain" },
  { q: "The best way to predict the future is to invent it.", a: "Alan Kay" },
  { q: "Programs must be written for people to read, and only incidentally for machines to execute.", a: "Harold Abelson" },
  { q: "First, solve the problem. Then, write the code.", a: "John Johnson" },
  { q: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", a: "Martin Fowler" },
  { q: "Simplicity is the soul of efficiency.", a: "Austin Freeman" },
  { q: "The scariest moment is always just before you start.", a: "Stephen King" },
  { q: "You do not rise to the occasion; you fall to the level of your preparation.", a: "Archilochus" },
  { q: "Compound interest is the eighth wonder of the world. He who understands it, earns it.", a: "Albert Einstein" },
  { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
  { q: "What you do every day matters more than what you do once in a while.", a: "Gretchen Rubin" },
  { q: "The magic you\'re looking for is in the work you\'re avoiding.", a: "Unknown" },
  { q: "Fall in love with the process and the results will come.", a: "Eric Thomas" },
  { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
  { q: "Small daily improvements are the key to staggering long-term results.", a: "Robin Sharma" },
  { q: "You are what you repeatedly do. Excellence is not an act but a habit.", a: "Aristotle" },
  { q: "The two most powerful warriors are patience and time.", a: "Leo Tolstoy" },
  { q: "The best time to plant a tree was 20 years ago. The second best time is now.", a: "Chinese Proverb" },
  { q: "If you don\'t sacrifice for what you want, what you want becomes the sacrifice.", a: "Unknown" },
  { q: "Nothing worth having comes easy.", a: "Theodore Roosevelt" },
  { q: "Focus on being productive, not busy.", a: "Tim Ferriss" },
  { q: "Study while others are sleeping; work while others are loafing.", a: "William Arthur Ward" },
  { q: "One percent better every day. That\'s the whole game.", a: "James Clear" },
  { q: "Don\'t count the days. Make the days count.", a: "Muhammad Ali" },
  { q: "Persistence is not a long race; it is many short races one after another.", a: "Walter Elliot" },
  { q: "The pain of discipline is far less than the pain of regret.", a: "Sarah Bombell" },
  { q: "Everything you\'ve ever wanted is on the other side of fear.", a: "George Addair" },
  { q: "Great things are done by a series of small things brought together.", a: "Vincent Van Gogh" },
  { q: "The only person you are destined to become is the person you decide to be.", a: "Ralph Waldo Emerson" },
  { q: "Wake up with determination. Go to bed with satisfaction.", a: "George Lorimer" },
  { q: "Learning never exhausts the mind.", a: "Leonardo da Vinci" },
  { q: "There are no shortcuts to any place worth going.", a: "Beverly Sills" },
  { q: "If you can\'t explain it simply, you don\'t understand it well enough.", a: "Richard Feynman" },
  { q: "First learn, then remove.", a: "Ancient wisdom" },
  { q: "You miss 100% of the shots you don\'t take.", a: "Wayne Gretzky" },
  { q: "Direction is more important than speed.", a: "Richard L. Evans" },
]

export function quoteForToday(iso) {
  // deterministic per day
  const d = iso || new Date().toISOString().slice(0, 10)
  let h = 0
  for (let i = 0; i < d.length; i++) h = (h * 31 + d.charCodeAt(i)) >>> 0
  return QUOTES[h % QUOTES.length]
}
