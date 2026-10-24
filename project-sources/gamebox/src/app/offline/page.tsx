import Link from 'next/link';

export default function OfflinePage(){return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#10110f',color:'#f3f1e9',fontFamily:'sans-serif',textAlign:'center',padding:24}}><div><p style={{fontSize:42,color:'#b4f379'}}>✳</p><h1>You’re offline.</h1><p style={{color:'#aaa'}}>Open a game you’ve visited before, or reconnect to browse GameBox.</p><Link href="/" style={{display:'inline-block',marginTop:15,color:'#151812',background:'#b4f379',padding:'12px 18px',borderRadius:7,textDecoration:'none'}}>Back to GameBox</Link></div></main>}
