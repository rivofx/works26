'use client';

import { useEffect, useRef, useState } from 'react';

const tracks = [
  { name: 'GameBox Chill', file: 'gamebox-chill' },
  { name: 'Pixel Adventure', file: 'pixel-adventure' },
  { name: 'Neon Drive', file: 'neon-drive' },
  { name: 'Cozy Arcade', file: 'cozy-arcade' },
  { name: 'Midnight Game', file: 'midnight-game' },
];

export default function MusicPlayer() {
  const [track, setTrack] = useState(0), [volume, setVolume] = useState(.18), [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => { try { const saved=JSON.parse(localStorage.getItem('gamebox-music')||'{}'); if(Number.isInteger(saved.track)&&saved.track>=0&&saved.track<tracks.length)setTrack(saved.track);if(Number.isFinite(saved.volume))setVolume(Math.max(0,Math.min(1,saved.volume))); } catch {} }, []);
  useEffect(() => { localStorage.setItem('gamebox-music',JSON.stringify({track,volume}));if(audio.current)audio.current.volume=volume; },[track,volume]);
  useEffect(() => { const player=audio.current;if(!player)return;if(playing){void player.play().catch(()=>setPlaying(false))}else player.pause(); },[playing,track]);
  const move=(by:number)=>setTrack(i=>(i+by+tracks.length)%tracks.length);
  return <aside className="music-player" aria-label="GameBox music player"><audio ref={audio} src={`/music/${tracks[track].file}.wav`} preload="none" loop onEnded={()=>move(1)}/><button className="music-toggle" onClick={()=>setPlaying(v=>!v)} aria-label={playing?'Pause music':'Play music'}>{playing?'Ⅱ':'▶'}</button><div className="music-info"><span>NOW PLAYING</span><b>{tracks[track].name}</b></div><button className="music-skip" onClick={()=>move(-1)} aria-label="Previous track">‹</button><button className="music-skip" onClick={()=>move(1)} aria-label="Next track">›</button><label className="music-volume" aria-label="Music volume"><span>♪</span><input type="range" min="0" max="1" step=".01" value={volume} onChange={e=>setVolume(+e.target.value)}/></label><select aria-label="Choose music track" value={track} onChange={e=>setTrack(+e.target.value)}>{tracks.map((t,i)=><option value={i} key={t.name}>{t.name}</option>)}</select></aside>;
}
