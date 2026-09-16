import type {ReactNode} from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

const C = {bg: '#000', text: '#f2f2f2', muted: '#71767b', border: '#2f3336', blue: '#1d9bf0', pink: '#f91880', green: '#00ba7c'};
const JUSTIN = staticFile('x-reference/avatars/thejustinwelsh.jpg');
const SAHIL = staticFile('x-reference/avatars/SahilBloom.jpg');
const UJJWAL = staticFile('x-reference/avatars/ujjwalmathur03.jpg');

type IconName = 'reply' | 'heart' | 'views' | 'repost' | 'bookmark' | 'bell' | 'profile' | 'message';
const Icon = ({name, size = 28, color = 'currentColor'}: {name: IconName; size?: number; color?: string}) => {
  const paths: Record<IconName, ReactNode> = {
    reply: <path d="M21 11.5c0 4.5-4 8.1-9.2 8.1-1 0-2-.1-2.9-.4L4 21l1.5-4C3.9 15.6 3 13.7 3 11.5 3 7 7 3.4 12 3.4s9 3.6 9 8.1Z" />,
    heart: <path d="M20.8 8.8c0 6.2-8.8 11.3-8.8 11.3S3.2 15 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />,
    views: <path d="M4 20v-7m5 7V6m6 14v-10m5 10V3" />,
    repost: <><path d="m7 5 3-3 3 3M10 2v15M17 19l-3 3-3-3M14 22V7" /></>,
    bookmark: <path d="M6 3h12v18l-6-4-6 4Z" />,
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M9.5 21h5" />,
    profile: <><circle cx="12" cy="7.2" r="4" /><path d="M4.5 21c.6-5 3-7.2 7.5-7.2s6.9 2.2 7.5 7.2" /></>,
    message: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m5 8 7 5 7-5" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

const Avatar = ({src, size = 48}: {src: string; size?: number}) => <Img src={src} style={{width: size, height: size, borderRadius: '50%', objectFit: 'cover', flex: '0 0 auto'}} />;
const Verified = () => <span style={{display: 'inline-grid', placeItems: 'center', width: 19, height: 19, borderRadius: '50%', background: C.blue, color: '#fff', fontSize: 12, fontWeight: 900}}>✓</span>;

const Metrics = ({views = '112K', likes = '4.8K', focus = false}: {views?: string; likes?: string; focus?: boolean}) => (
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.25fr 32px', marginTop: 24, alignItems: 'center', color: C.muted, fontSize: 18}}>
    <span style={{display: 'flex', gap: 9, alignItems: 'center'}}><Icon name="reply" size={21} />49</span>
    <span style={{display: 'flex', gap: 9, alignItems: 'center'}}><Icon name="repost" size={21} />38</span>
    <span style={{display: 'flex', gap: 9, alignItems: 'center'}}><Icon name="heart" size={21} />{likes}</span>
    <span style={{display: 'flex', gap: 10, alignItems: 'center', color: focus ? C.text : C.muted, fontWeight: focus ? 800 : 400, fontSize: focus ? 26 : 18}}><Icon name="views" size={focus ? 28 : 21} />{views}</span>
    <Icon name="bookmark" size={21} />
  </div>
);

const XPost = ({author = 'Justin Welsh', handle = '@thejustinwelsh', avatar = JUSTIN, children, views = '112K', likes = '4.8K', focus = false, width = 760}: {author?: string; handle?: string; avatar?: string; children: ReactNode; views?: string; likes?: string; focus?: boolean; width?: number}) => (
  <div style={{width, boxSizing: 'border-box', padding: '24px 26px', background: '#000', color: C.text, border: `1px solid ${C.border}`, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'}}>
    <div style={{display: 'flex', gap: 14}}>
      <Avatar src={avatar} size={48} />
      <div style={{flex: 1}}>
        <div style={{display: 'flex', gap: 6, alignItems: 'center', fontSize: 21}}><b>{author}</b><Verified /><span style={{color: C.muted}}>{handle} · 2h</span><span style={{marginLeft: 'auto', color: C.muted}}>•••</span></div>
        <div style={{fontSize: 25, lineHeight: 1.34, marginTop: 12}}>{children}</div>
        <Metrics views={views} likes={likes} focus={focus} />
      </div>
    </div>
  </div>
);

const XReply = ({children, views = '112K', likes = '4.8K', width = 760}: {children: ReactNode; views?: string; likes?: string; width?: number}) => (
  <div style={{width, boxSizing: 'border-box', padding: '23px 26px', background: '#000', color: C.text, border: `1px solid ${C.border}`, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'}}>
    <div style={{display: 'flex', gap: 14}}><Avatar src={UJJWAL} size={48} /><div style={{flex: 1}}><div style={{fontSize: 20}}><b>Ujjwal Mathur</b> <span style={{color: C.blue}}>@ujjwalmathur03 · You replied ✓</span></div><div style={{fontSize: 25, lineHeight: 1.34, marginTop: 10}}>{children}</div><Metrics views={views} likes={likes} focus /></div></div>
  </div>
);

const Canvas = ({children, background = '#000', color = C.text}: {children: ReactNode; background?: string; color?: string}) => (
  <AbsoluteFill style={{background, color, overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'}}>{children}</AbsoluteFill>
);

const PosterTitle = ({kicker, children, color = 'currentColor', size = 82}: {kicker?: string; children: ReactNode; color?: string; size?: number}) => (
  <div>{kicker && <div style={{color, fontSize: 22, fontWeight: 850, letterSpacing: '.08em', marginBottom: 18}}>{kicker}</div>}<div style={{fontSize: size, lineHeight: .98, letterSpacing: '-4.5px', fontWeight: 830}}>{children}</div></div>
);

const Poster01 = () => (
  <Canvas>
    <div style={{position: 'absolute', left: 90, top: 72, width: 820}}><PosterTitle kicker="A SMALL CREATOR PSA" color={C.blue}>Your next 1,000 followers are already in someone else’s replies.</PosterTitle></div>
    <div style={{position: 'absolute', right: 75, top: 82, width: 580, height: 730, borderLeft: `1px solid ${C.border}`, overflow: 'hidden'}}>
      {[['Sahil Bloom', SAHIL, '774K'], ['Justin Welsh', JUSTIN, '112K'], ['Sahil Bloom', SAHIL, '287K']].map(([name, avatar, views]) => (
        <div key={views} style={{padding: '25px 30px', borderBottom: `1px solid ${C.border}`}}><div style={{display: 'flex', alignItems: 'center', gap: 12}}><Avatar src={avatar} size={42} /><b style={{fontSize: 20}}>{name}</b><Verified /></div><div style={{fontSize: 22, lineHeight: 1.3, marginTop: 14}}>A conversation people are already paying attention to.</div><div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 15, fontSize: 27, fontWeight: 750}}><Icon name="views" size={26} />{views}</div></div>
      ))}
    </div>
    <div style={{position: 'absolute', left: 94, bottom: 78, fontSize: 25, color: C.muted}}>Stop shouting into an empty room.</div>
  </Canvas>
);

const Poster02 = () => (
  <Canvas>
    <div style={{position: 'absolute', left: 90, top: 78}}><PosterTitle kicker="DISTRIBUTION, FOUND" color={C.blue}>The reply button<br />is a growth channel.</PosterTitle></div>
    <div style={{position: 'absolute', right: 100, top: 120, width: 460, height: 460, borderRadius: '50%', border: `2px solid ${C.border}`, display: 'grid', placeItems: 'center', boxShadow: '0 0 0 38px rgba(29,155,240,.035), 0 0 0 76px rgba(29,155,240,.02)'}}><Icon name="reply" size={220} color={C.blue} /></div>
    <div style={{position: 'absolute', left: 90, bottom: 78, width: 860}}><XReply width={860}>One useful perspective, placed where 112K people are already looking.</XReply></div>
    <div style={{position: 'absolute', right: 112, bottom: 95, fontSize: 24, color: C.muted, textAlign: 'right'}}>Not a comment.<br /><b style={{color: C.text}}>Distribution.</b></div>
  </Canvas>
);

const Poster03 = () => (
  <Canvas background="linear-gradient(135deg,#f91880 0%,#7b2ff7 45%,#1d9bf0 100%)">
    <div style={{position: 'absolute', left: 82, top: 58, fontSize: 26, fontWeight: 850, letterSpacing: '.08em'}}>IT’S A MATCH</div>
    <div style={{position: 'absolute', left: 110, top: 170, width: 570, height: 600, borderRadius: 34, background: '#fff', color: '#0f1419', boxShadow: '0 40px 100px rgba(0,0,0,.35)', transform: 'rotate(-5deg)', padding: 38, boxSizing: 'border-box'}}>
      <div style={{fontSize: 24, color: '#536471'}}>YOUR REPLY</div><div style={{marginTop: 28}}><Avatar src={UJJWAL} size={120} /></div><div style={{fontSize: 42, fontWeight: 820, marginTop: 24}}>Useful perspective</div><div style={{fontSize: 25, color: '#536471', marginTop: 14}}>Actually adds something to the conversation.</div><div style={{position: 'absolute', right: 34, bottom: 30, fontSize: 68, color: C.pink}}>♥</div>
    </div>
    <div style={{position: 'absolute', right: 110, top: 130, width: 570, height: 600, borderRadius: 34, background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,.25)', boxShadow: '0 40px 100px rgba(0,0,0,.35)', transform: 'rotate(5deg)', padding: 38, boxSizing: 'border-box'}}>
      <div style={{fontSize: 24, color: C.muted}}>EXISTING ATTENTION</div><div style={{fontSize: 124, fontWeight: 850, letterSpacing: '-8px', marginTop: 90}}>774K</div><div style={{fontSize: 31, color: C.muted}}>views</div><div style={{position: 'absolute', left: 38, bottom: 35, display: 'flex', gap: 12, alignItems: 'center', fontSize: 28}}><Icon name="views" size={34} color={C.blue} /> Looking for value</div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 45, textAlign: 'center', fontSize: 30, fontWeight: 750}}>Compatibility: dangerously high.</div>
  </Canvas>
);

const Poster04 = () => {
  const rows = [['112K', 'REPLIES', 'NOW'], ['774K', 'USEFUL TAKES', 'BOARDING'], ['2.7M', 'CONSISTENCY', 'ON TIME'], ['5,214', 'FOLLOWERS', 'ARRIVED']];
  return (
    <Canvas background="#11110e" color="#ffd45c">
      <div style={{position: 'absolute', inset: 54, border: '3px solid #534b2c', borderRadius: 16, padding: '38px 44px', boxSizing: 'border-box', background: 'linear-gradient(#17160f,#0e0e0b)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #534b2c', paddingBottom: 25}}><div style={{fontSize: 32, fontWeight: 850}}>X DEPARTURES</div><div style={{fontSize: 26}}>GATE 𝕏</div></div>
        <div style={{fontFamily: 'Menlo, Monaco, monospace', marginTop: 25}}>{rows.map((row, i) => <div key={row[0]} style={{display: 'grid', gridTemplateColumns: '260px 1fr 290px', borderBottom: '1px dashed #534b2c', padding: '25px 0', fontSize: 39, letterSpacing: '2px', color: i === 0 ? '#fff4c6' : '#ffd45c'}}><b>{row[0]}</b><span>{row[1]}</span><span style={{textAlign: 'right'}}>{row[2]}</span></div>)}</div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 34}}><div><div style={{fontSize: 24, color: '#8e8355'}}>FINAL CALL FOR</div><div style={{fontSize: 58, color: '#fff4c6', fontWeight: 850}}>YOUR EMPTY POSTS</div></div><div style={{fontSize: 28, textAlign: 'right'}}>Board through<br /><b style={{fontSize: 52}}>REPLIES</b></div></div>
      </div>
    </Canvas>
  );
};

const Poster05 = () => {
  const candles = [74,120,88,160,105,210,156,250,205,290,265,345,320];
  return (
    <Canvas background="#050b08" color="#d9ffe9">
      <div style={{position: 'absolute', left: 70, top: 52, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Menlo, monospace'}}><div style={{fontSize: 31, fontWeight: 850}}>RPLY / X</div><div style={{fontSize: 25, color: C.green}}>▲ 112,000.00%</div></div>
      <div style={{position: 'absolute', left: 70, top: 125}}><PosterTitle kicker="MARKET SIGNAL" color={C.green} size={72}>BUY useful replies.<br /><span style={{color: '#ff5c68'}}>SELL empty posts.</span></PosterTitle></div>
      <div style={{position: 'absolute', left: 75, right: 75, bottom: 75, height: 330, border: '1px solid #163324', backgroundImage: 'linear-gradient(#163324 1px,transparent 1px),linear-gradient(90deg,#163324 1px,transparent 1px)', backgroundSize: '80px 65px'}}>
        <svg width="100%" height="100%" viewBox="0 0 1450 330" preserveAspectRatio="none"><polyline points="0,280 120,260 220,270 330,220 420,235 540,180 640,195 760,135 870,150 980,92 1100,110 1220,48 1450,20" fill="none" stroke={C.green} strokeWidth="6" /></svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 45px 25px'}}>{candles.map((height, i) => <div key={`${height}-${i}`} style={{position: 'relative', width: 18, height}}><div style={{position: 'absolute', left: 8, top: -18, bottom: -18, width: 2, background: i % 3 === 0 ? '#ff5c68' : C.green}} /><div style={{position: 'absolute', inset: '20% 0', background: i % 3 === 0 ? '#ff5c68' : C.green}} /></div>)}</div>
      </div>
      <div style={{position: 'absolute', right: 90, top: 205, fontFamily: 'Menlo, monospace', textAlign: 'right'}}><div style={{fontSize: 22, color: '#648774'}}>VOLUME</div><div style={{fontSize: 48}}>2.7M</div></div>
    </Canvas>
  );
};

const Poster06 = () => (
  <Canvas background="radial-gradient(circle at 50% 25%,#38226e,#120c24 58%,#07040d)" color="#fff6cc">
    <div style={{position: 'absolute', inset: 30, border: '4px solid #a87cff', boxShadow: 'inset 0 0 0 8px #241449,0 0 40px rgba(168,124,255,.35)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', fontFamily: 'Menlo, monospace', fontSize: 25, color: '#d3bdff'}}>ACHIEVEMENT UNLOCKED</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', fontSize: 82, lineHeight: 1, fontWeight: 900, textShadow: '6px 6px 0 #3b216e'}}>90-DAY<br />REPLY STREAK</div>
    <div style={{position: 'absolute', left: 600, top: 365, width: 400, height: 220, border: '4px solid #fff6cc', background: '#160d2d', display: 'grid', placeItems: 'center', boxShadow: '10px 10px 0 #6d41c8'}}><div style={{textAlign: 'center'}}><Icon name="reply" size={92} color="#fff6cc" /><div style={{fontFamily: 'Menlo, monospace', fontSize: 22, marginTop: 12}}>+5,214 FOLLOWERS</div></div></div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 92, textAlign: 'center', fontFamily: 'Menlo, monospace', fontSize: 28}}>SIDE QUEST COMPLETED: <span style={{color: '#72f1b8'}}>SHOW UP EVERY DAY</span></div>
    <div style={{position: 'absolute', left: 70, top: 440, fontSize: 25, transform: 'rotate(-8deg)', color: '#d3bdff'}}>Rare item:<br /><b>Consistency</b></div><div style={{position: 'absolute', right: 80, top: 450, fontSize: 25, transform: 'rotate(8deg)', color: '#d3bdff'}}>Boss defeated:<br /><b>The void</b></div>
  </Canvas>
);

const Poster07 = () => (
  <Canvas background="linear-gradient(#18261b,#07120a)" color="#ecf4e7">
    <div style={{position: 'absolute', left: 75, top: 60, fontFamily: 'Georgia, serif', fontSize: 30, fontStyle: 'italic'}}>A nature documentary</div>
    <div style={{position: 'absolute', left: 75, top: 118, width: 980, fontFamily: 'Georgia, serif', fontSize: 67, lineHeight: 1.05}}>Here we see a small creator approaching a <i>774K-view post</i> in its natural habitat.</div>
    <div style={{position: 'absolute', left: 280, bottom: 65, width: 1040, height: 400, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 520, height: 400, borderRadius: '50% 0 0 50%', overflow: 'hidden', border: '12px solid #080d09'}}><div style={{transform: 'translate(-40px,90px) scale(.72)'}}><XPost author="Sahil Bloom" handle="@SahilBloom" avatar={SAHIL} views="774K" focus>The best opportunities are hiding inside conversations already in motion.</XPost></div></div>
      <div style={{position: 'absolute', right: 0, top: 0, width: 520, height: 400, borderRadius: '0 50% 50% 0', overflow: 'hidden', border: '12px solid #080d09'}}><div style={{transform: 'translate(-190px,90px) scale(.72)'}}><XPost author="Sahil Bloom" handle="@SahilBloom" avatar={SAHIL} views="774K" focus>The best opportunities are hiding inside conversations already in motion.</XPost></div></div>
      <div style={{position: 'absolute', left: 500, top: 0, width: 40, height: 400, background: '#080d09'}} />
    </div>
    <div style={{position: 'absolute', right: 76, top: 100, width: 290, fontFamily: 'Georgia, serif', fontSize: 25, lineHeight: 1.35, color: '#9db39f'}}>Quietly, it prepares a useful reply. One wrong move and it returns to posting into the void.</div>
  </Canvas>
);

const Poster08 = () => (
  <Canvas background="#07172c" color="#ddebff">
    <div style={{position: 'absolute', inset: 35, border: '2px solid #3d76ad', backgroundImage: 'linear-gradient(rgba(86,148,207,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(86,148,207,.12) 1px,transparent 1px)', backgroundSize: '40px 40px'}} />
    <div style={{position: 'absolute', left: 80, top: 68}}><PosterTitle kicker="CLASSIFIED // OPERATION REPLY" color="#62b4ff" size={70}>The Great<br />Attention Heist.</PosterTitle></div>
    <div style={{position: 'absolute', left: 705, top: 95, width: 760, transform: 'rotate(-2deg)'}}><XPost width={760} author="Justin Welsh" handle="@thejustinwelsh" avatar={JUSTIN} views="526K" focus>Accounts growing crazy fast build a deep network. They engage regularly.</XPost></div>
    <div style={{position: 'absolute', left: 520, bottom: 110, width: 760, transform: 'rotate(2deg)'}}><XReply width={760}>Small creators: replying is the way to grow on X.</XReply></div>
    <svg style={{position: 'absolute', inset: 0}} width="1600" height="900"><path d="M540 320 C690 350 650 550 780 650" stroke="#ff5e67" strokeWidth="6" fill="none" strokeDasharray="18 13" /><circle cx="540" cy="320" r="12" fill="#ff5e67" /><circle cx="780" cy="650" r="12" fill="#ff5e67" /></svg>
    <div style={{position: 'absolute', left: 83, bottom: 80, width: 390, fontFamily: 'Menlo, monospace', fontSize: 23, lineHeight: 1.7}}><div>01 FIND THE CROWD</div><div>02 ADD ACTUAL VALUE</div><div style={{color: '#62b4ff'}}>03 LEAVE WITH 112K</div></div>
    <div style={{position: 'absolute', right: 80, bottom: 50, transform: 'rotate(-9deg)', border: '5px solid #ff5e67', color: '#ff5e67', padding: '12px 22px', fontSize: 26, fontWeight: 900}}>NO EMPTY POSTS</div>
  </Canvas>
);

const Poster09 = () => (
  <Canvas background="#eee9dd" color="#171717">
    <div style={{position: 'absolute', left: 75, top: 55, fontFamily: 'Georgia, serif', fontSize: 28}}>THE MUSEUM OF INTERNET DISTRIBUTION</div>
    <div style={{position: 'absolute', left: 130, top: 140, width: 1020, height: 520, padding: 24, boxSizing: 'border-box', background: '#cab891', border: '18px solid #5b4630', boxShadow: '0 28px 60px rgba(0,0,0,.25)'}}><div style={{background: '#000', height: '100%', display: 'grid', placeItems: 'center'}}><XReply width={850}>A clear point of view compounds when you keep showing up.</XReply></div></div>
    <div style={{position: 'absolute', right: 90, top: 170, width: 300, fontFamily: 'Georgia, serif'}}><div style={{fontSize: 38, fontStyle: 'italic'}}>Untitled<br />(112K Views)</div><div style={{height: 1, background: '#8f897f', margin: '24px 0'}} /><div style={{fontSize: 22, lineHeight: 1.5}}>Ujjwal Mathur<br />2026<br /><br />Medium: one useful reply on a viral post.</div><div style={{fontSize: 20, color: '#69645b', marginTop: 32}}>Acquired after the artist stopped posting into the void.</div></div>
    <div style={{position: 'absolute', left: 132, bottom: 80, fontFamily: 'Georgia, serif', fontSize: 32, fontStyle: 'italic'}}>Please do not touch. You may reply.</div>
  </Canvas>
);

const Poster10 = () => (
  <Canvas background="#f2efe7" color="#111">
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 68, background: '#d71920', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 60px', fontSize: 29, fontWeight: 900, letterSpacing: '.08em'}}>BREAKING NEWS <span style={{marginLeft: 'auto', fontWeight: 500}}>THE REPLY BUTTON HAS BEEN LOCATED</span></div>
    <div style={{position: 'absolute', left: 64, top: 110, width: 990}}><PosterTitle size={79}>Local creator uses reply button. Algorithm reportedly “in shambles.”</PosterTitle></div>
    <div style={{position: 'absolute', left: 70, bottom: 90, width: 890, height: 330, background: '#000', padding: 24, boxSizing: 'border-box', transform: 'rotate(-1deg)', boxShadow: '10px 12px 0 #c8c2b4'}}><XReply width={842}>Small creators: replying is the way to grow on X.</XReply></div>
    <div style={{position: 'absolute', right: 72, top: 120, width: 430, background: '#fff', border: '3px solid #111', padding: 28, boxSizing: 'border-box', transform: 'rotate(2deg)'}}><div style={{fontSize: 22, fontWeight: 900, color: '#d71920'}}>DEVELOPING STORY</div><div style={{fontSize: 35, lineHeight: 1.08, fontWeight: 850, marginTop: 18}}>Followers mysteriously increase from hundreds to 5,214.</div><div style={{height: 2, background: '#111', margin: '25px 0'}} /><div style={{fontSize: 24, lineHeight: 1.4}}>Witnesses report the creator was “being useful in public” and “doing it again tomorrow.”</div></div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 55, background: '#111', color: '#fff', display: 'flex', alignItems: 'center', fontSize: 23, overflow: 'hidden', whiteSpace: 'nowrap'}}><span style={{background: '#d71920', alignSelf: 'stretch', display: 'flex', alignItems: 'center', padding: '0 28px', fontWeight: 900}}>LIVE</span><span style={{paddingLeft: 25}}>112K VIEWS • 2.7M IMPRESSIONS • CO-FOUNDER SAYS “CRAZYYYY” • EMPTY POSTS DECLINE TO COMMENT</span></div>
  </Canvas>
);

export const posterCreativeComponents = [Poster01, Poster02, Poster03, Poster04, Poster05, Poster06, Poster07, Poster08, Poster09, Poster10];
