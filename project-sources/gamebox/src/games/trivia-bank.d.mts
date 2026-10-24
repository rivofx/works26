export type TriviaDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type TriviaQuestion = { id:string; category:string; level:number; difficulty:TriviaDifficulty; question:string; answers:string[]; correctIndex:number; explanation:string };
export const categories:{name:string;icon:string}[];
export const triviaBank:TriviaQuestion[];
export function validateTriviaBank(bank?:TriviaQuestion[]):boolean;
