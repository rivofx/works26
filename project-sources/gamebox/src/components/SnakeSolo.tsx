'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

type Point={x:number;y:number};
const initialSnake:Point[]=[{x:8,y:8},{x:7,y:8},{x:6,y:8}];
const directions=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'] as const;
type Direction=typeof directions[number];
const delta:Record<Direction,Point>={'ArrowUp':{x:0,y:-1},'ArrowDown':{x:0,y:1},'ArrowLeft':{x:-1,y:0},'ArrowRight':{x:1,y:0}};
const reverse:Record<Direction,Direction>={'ArrowUp':'ArrowDown','ArrowDown':'ArrowUp','ArrowLeft':'ArrowRight','ArrowRight':'ArrowLeft'};
const randomFood=(snake:Point[]):Point=>{const empty:Array<Point>=[];for(let y=0;y<16;y++)for(let x=0;x<24;x++)if(!snake.some(p=>p.x===x&&p.y===y))empty.push({x,y});return empty[Math.floor(Math.random()*empty.length)]||{x:0,y:0}};

export default function SnakeSolo(){
 const [running,setRunning]=useState(false),[over,setOver]=useState(false),[score,setScore]=useState(0),[high,setHigh]=useState(0),[dir,setDir]=useState<Direction>('ArrowRight'),[snake,setSnake]=useState<Point[]>(initialSnake),[food,setFood]=useState<Point>({x:14,y:8});
 const canvas=useRef<HTMLCanvasElement>(null),swipe=useRef<Point|null>(null),directionRef=useRef<Direction>('ArrowRight');
 useEffect(()=>{try{setHigh(Number(localStorage.getItem('gamebox-snake-best')||0))}catch{}},[]);
 useEffect(()=>{if(score>high)setHigh(score)},[score,high]);
 useEffect(()=>{if(high>0)try{localStorage.setItem('gamebox-snake-best',String(high))}catch{}},[high]);
 const steer=useCallback((next:Direction)=>{if(reverse[directionRef.current]===next)return;directionRef.current=next;setDir(next);if(!over)setRunning(true)},[over]);
 useEffect(()=>{const fn=(e:KeyboardEvent)=>{if(!directions.includes(e.key as Direction))return;if((e.target as HTMLElement)?.matches('input,textarea,select,button'))return;e.preventDefault();steer(e.key as Direction)};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[steer]);
 useEffect(()=>{if(!running||over)return;const timer=setInterval(()=>{setSnake(old=>{const d=delta[dir],next={x:old[0].x+d.x,y:old[0].y+d.y},eat=next.x===food.x&&next.y===food.y,body=old.slice(0,eat?undefined:-1);if(next.x<0||next.y<0||next.x>=24||next.y>=16||body.some(p=>p.x===next.x&&p.y===next.y)){setOver(true);setRunning(false);return old}if(eat){setScore(v=>v+10);setFood(randomFood([next,...old]))}return[next,...body]})},Math.max(65,130-Math.floor(score/50)*8));return()=>clearInterval(timer)},[running,over,dir,food,score]);
 useEffect(()=>{const c=canvas.current,ctx=c?.getContext('2d');if(!c||!ctx)return;ctx.fillStyle='#1a201b';ctx.fillRect(0,0,c.width,c.height);snake.forEach((p,i)=>{ctx.fillStyle=i?'#78b44d':'#c7ff8e';ctx.beginPath();ctx.roundRect(p.x*24+2,p.y*24+2,20,20,6);ctx.fill()});ctx.fillStyle='#fb8066';ctx.beginPath();ctx.arc(food.x*24+12,food.y*24+12,8,0,Math.PI*2);ctx.fill()},[snake,food]);
 const reset=()=>{directionRef.current='ArrowRight';setSnake(initialSnake);setFood({x:14,y:8});setScore(0);setDir('ArrowRight');setOver(false);setRunning(true)};
 const swipeEnd=(e:React.PointerEvent<HTMLCanvasElement>)=>{if(!swipe.current)return;const dx=e.clientX-swipe.current.x,dy=e.clientY-swipe.current.y;swipe.current=null;if(Math.max(Math.abs(dx),Math.abs(dy))<16)return;steer(Math.abs(dx)>Math.abs(dy)?dx>0?'ArrowRight':'ArrowLeft':dy>0?'ArrowDown':'ArrowUp')};
 return <div className="snake-game"><div className="snake-top"><span>◉ SOLO ARENA</span><span>SCORE <b>{score}</b></span><span>BEST <b>{high}</b></span></div><canvas ref={canvas} width={576} height={384} aria-label="Snake playfield. Swipe or use arrow keys to steer." onPointerDown={e=>{swipe.current={x:e.clientX,y:e.clientY}}} onPointerUp={swipeEnd}/><p className="game-status">{over?'Game over — hit the wall or yourself.':`Score ${score} · Arrow keys, swipe, or touch controls`}</p><div className="snake-controls"><button className="button primary" onClick={()=>over?reset():setRunning(!running)}>{over?'Rematch':running?'Pause':'Play snake'}</button><div className="dpad" aria-label="Touch controls"><button aria-label="Up" onClick={()=>steer('ArrowUp')}>↑</button><div><button aria-label="Left" onClick={()=>steer('ArrowLeft')}>←</button><button aria-label="Down" onClick={()=>steer('ArrowDown')}>↓</button><button aria-label="Right" onClick={()=>steer('ArrowRight')}>→</button></div></div></div></div>
}
