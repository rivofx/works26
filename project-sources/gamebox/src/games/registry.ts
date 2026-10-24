export type PlayMode = 'Offline' | 'Online' | 'Both';
export type GameDefinition = { id: string; name: string; description: string; mode: PlayMode; category: string; icon: string; color: string; featured?: boolean };
export const games: GameDefinition[] = [
  { id:'tic-tac-toe', name:'Tic-Tac-Toe', description:'A tiny classic. A big brain required.', mode:'Both', category:'Strategy', icon:'✳', color:'mint', featured:true },
  { id:'connect-four', name:'Connect Four', description:'Four in a row. Keep your cool.', mode:'Both', category:'Strategy', icon:'◉', color:'coral', featured:true },
  { id:'uno', name:'Color Clash', description:'Wild colors. One card left. Pass the device.', mode:'Both', category:'Cards', icon:'▤', color:'gold' },
  { id:'trivia', name:'Trivia', description:'Quick questions. Bragging rights.', mode:'Both', category:'Party', icon:'?', color:'lilac' },
  { id:'draw-guess', name:'Draw & Guess', description:'Draw the clue. Guess the word.', mode:'Online', category:'Party', icon:'✎', color:'sky' },
  { id:'snake', name:'Snake Arena', description:'Eat, grow, and don’t meet yourself.', mode:'Both', category:'Arcade', icon:'〰', color:'lime', featured:true },
];
