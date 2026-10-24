import test from 'node:test';
import assert from 'node:assert/strict';
import { RoomEngine } from '../src/server/room-engine.mjs';
import { triviaBank, validateTriviaBank } from '../src/games/trivia-bank.mjs';

const roomFor=(game,players=2)=>({game,status:'lobby',players:Array.from({length:players},(_,i)=>({id:`p${i}`,score:0})),settings:{questions:10,category:'Mixed / Random',difficulty:'Mixed',quizMode:'random'}});

test('bundled trivia bank validates 100 levels with ten questions each',()=>{
  assert.equal(validateTriviaBank(),true);
  assert.equal(triviaBank.length,1000);
  for(let level=1;level<=100;level++)assert.equal(triviaBank.filter(q=>q.level===level).length,10);
});

test('room codes cannot be joined through another game',()=>{
  const engine=new RoomEngine(false);const room=roomFor('tic-tac-toe',1);room.code='AB234';engine.rooms.set(room.code,room);
  assert.throws(()=>engine.handle({}, {type:'join',code:room.code,game:'trivia'}),/not this game/);engine.close();
});

test('Tic-Tac-Toe rejects out-of-turn and occupied moves, then resolves a win',()=>{
  const engine=new RoomEngine(false),room=roomFor('tic-tac-toe');engine.start(room);
  assert.throws(()=>engine.act(room,room.players[1],{index:0}),/Wait for your turn/);
  for(const [p,index] of [[0,0],[1,3],[0,1],[1,4],[0,2]])engine.act(room,room.players[p],{index});
  assert.equal(room.state.winner,0);assert.equal(room.status,'finished');engine.close();
});

test('Connect Four accepts legal gravity drops and resolves a horizontal four',()=>{
  const engine=new RoomEngine(false),room=roomFor('connect-four');engine.start(room);
  for(const [p,column] of [[0,0],[1,6],[0,1],[1,6],[0,2],[1,5],[0,3]])engine.act(room,room.players[p],{column});
  assert.equal(room.state.winner,0);assert.equal(room.status,'finished');assert.equal(room.state.board[5].slice(0,4).every(x=>x===0),true);engine.close();
});

test('Trivia hides the answer until both players submit',()=>{
  const engine=new RoomEngine(false),room=roomFor('trivia');engine.start(room);const q=engine.currentQuestion(room);
  assert.equal(engine.privateState(room,'p0').correct,null);
  engine.act(room,room.players[0],{type:'answer',index:q.correctIndex});
  assert.equal(engine.privateState(room,'p0').revealed,false);
  engine.act(room,room.players[1],{type:'answer',index:(q.correctIndex+1)%4});
  assert.equal(engine.privateState(room,'p1').correct,q.correctIndex);assert.equal(room.players[0].score>0,true);engine.close();
});

test('Draw & Guess keeps the clue private and limits undo to the drawer',()=>{
  const engine=new RoomEngine(false),room=roomFor('draw-guess');engine.start(room);const secret=room.secret,drawer=engine.privateState(room,'p0'),guesser=engine.privateState(room,'p1');
  assert.equal(drawer.word,secret);assert.equal(guesser.word,null);room.state.strokes=[{points:[],color:'#ffffff',size:3}];engine.act(room,room.players[0],{type:'undo'});assert.equal(room.state.strokes.length,0);assert.throws(()=>engine.act(room,room.players[1],{type:'undo'}),/Only the drawer/);engine.close();
});

test('Color Clash room views include only a player’s own hand',()=>{
  const engine=new RoomEngine(false),room=roomFor('uno');room.status='playing';room.state={hands:[[{color:'red',value:'5'}],[{color:'blue',value:'7'}]],pile:[{color:'green',value:'2'}],draw:[{color:'yellow',value:'9'}],turn:0};
  const view=engine.privateState(room,'p0');assert.deepEqual(view.hands[0],[{color:'red',value:'5'}]);assert.deepEqual(view.hands[1],[{count:1}]);assert.equal(JSON.stringify(view).includes('blue'),false);assert.equal(JSON.stringify(view).includes('yellow'),false);engine.close();
});

test('Color Clash enforces the missed-UNO penalty on the authoritative server',()=>{
  const engine=new RoomEngine(false),room=roomFor('uno');room.status='playing';room.state={hands:[[{color:'red',value:'5'},{color:'blue',value:'6'}],[{color:'green',value:'3'}]],pile:[{color:'red',value:'2'}],draw:[{color:'yellow',value:'4'},{color:'yellow',value:'8'}],turn:0,direction:1,pendingUno:null,calledUno:false,winner:null};
  engine.act(room,room.players[0],{type:'play',index:0});assert.equal(room.state.pendingUno,0);engine.act(room,room.players[1],{type:'catchUno'});assert.equal(room.state.hands[0].length,3);assert.equal(room.state.pendingUno,null);engine.close();
});

test('Snake movement is advanced by the authoritative room engine',()=>{
  const engine=new RoomEngine(false),room=roomFor('snake');engine.start(room);const before=room.state.snakes[0].body[0];engine.moveSnakes(room);const after=room.state.snakes[0].body[0];assert.notDeepEqual(after,before);assert.equal(room.state.snakes.every(s=>s.alive),true);engine.close();
});

test('Snake arena eliminates a snake when it hits another snake body',()=>{
  const e=new RoomEngine(false),room=roomFor('snake');e.start(room);const[first,second]=room.state.snakes;
  first.body=[{x:5,y:5},{x:5,y:6},{x:4,y:6}];first.dir={x:0,y:1};
  second.body=[{x:5,y:6},{x:6,y:6},{x:7,y:6}];second.dir={x:1,y:0};room.state.food={x:12,y:8};
  e.moveSnakes(room);assert.equal(room.state.snakes[0].alive,false);e.close();
});
