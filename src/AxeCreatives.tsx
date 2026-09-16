import type {ReactNode} from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

const C = {
  bg: '#000000',
  text: '#e7e9ea',
  muted: '#71767b',
  border: '#2f3336',
  blue: '#1d9bf0',
  pink: '#f91880',
  green: '#00ba7c',
};

const JUSTIN = staticFile('x-reference/avatars/thejustinwelsh.jpg');
const SAHIL = staticFile('x-reference/avatars/SahilBloom.jpg');
const UJJWAL = staticFile('x-reference/avatars/ujjwalmathur03.jpg');

type IconName = 'reply' | 'repost' | 'heart' | 'views' | 'bookmark' | 'bell' | 'profile' | 'message';

const Icon = ({name, size = 28, color = 'currentColor'}: {name: IconName; size?: number; color?: string}) => {
  const paths: Record<IconName, ReactNode> = {
    reply: <path d="M21 11.5c0 4.5-4 8.1-9.2 8.1-1 0-2-.1-2.9-.4L4 21l1.5-4C3.9 15.6 3 13.7 3 11.5 3 7 7 3.4 12 3.4s9 3.6 9 8.1Z" />,
    repost: <><path d="m7 5 3-3 3 3M10 2v15M17 19l-3 3-3-3M14 22V7" /></>,
    heart: <path d="M20.8 8.8c0 6.2-8.8 11.3-8.8 11.3S3.2 15 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />,
    views: <path d="M4 20v-7m5 7V6m6 14v-10m5 10V3" />,
    bookmark: <path d="M6 3h12v18l-6-4-6 4Z" />,
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M9.5 21h5" />,
    profile: <><circle cx="12" cy="7.2" r="4" /><path d="M4.5 21c.6-5 3-7.2 7.5-7.2s6.9 2.2 7.5 7.2" /></>,
    message: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m5 8 7 5 7-5" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

const Verified = () => (
  <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', color: '#fff', background: C.blue, fontSize: 13, fontWeight: 900}}>✓</span>
);

const Avatar = ({src, size = 50}: {src: string; size?: number}) => (
  <Img src={src} style={{width: size, height: size, borderRadius: '50%', objectFit: 'cover', flex: '0 0 auto'}} />
);

const Metrics = ({replies = '49', reposts = '38', likes = '533', views = '112K', focus = false}: {replies?: string; reposts?: string; likes?: string; views?: string; focus?: boolean}) => (
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr 40px', alignItems: 'center', marginTop: 28, color: C.muted, fontSize: 20}}>
    <span style={{display: 'flex', gap: 10, alignItems: 'center'}}><Icon name="reply" size={23} />{replies}</span>
    <span style={{display: 'flex', gap: 10, alignItems: 'center'}}><Icon name="repost" size={23} />{reposts}</span>
    <span style={{display: 'flex', gap: 10, alignItems: 'center'}}><Icon name="heart" size={23} />{likes}</span>
    <span style={{display: 'flex', gap: 12, alignItems: 'center', color: focus ? C.text : C.muted, fontSize: focus ? 28 : 20, fontWeight: focus ? 700 : 400}}><Icon name="views" size={focus ? 30 : 23} />{views}</span>
    <Icon name="bookmark" size={23} />
  </div>
);

const Post = ({author, handle, avatar, children, replies, reposts, likes, views, focusViews = false, width = 900}: {author: string; handle: string; avatar: string; children: ReactNode; replies?: string; reposts?: string; likes?: string; views?: string; focusViews?: boolean; width?: number}) => (
  <article style={{width, boxSizing: 'border-box', padding: '28px 30px 26px', border: `1px solid ${C.border}`, background: C.bg}}>
    <div style={{display: 'flex', gap: 15}}>
      <Avatar src={avatar} size={52} />
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 23}}>
          <strong>{author}</strong><Verified /><span style={{color: C.muted}}>{handle} · 2h</span><span style={{marginLeft: 'auto', color: C.muted, letterSpacing: 3}}>•••</span>
        </div>
        <div style={{fontSize: 28, lineHeight: 1.34, marginTop: 14}}>{children}</div>
        <Metrics replies={replies} reposts={reposts} likes={likes} views={views} focus={focusViews} />
      </div>
    </div>
  </article>
);

const Reply = ({children, views = '18.4K', likes = '318', compact = false}: {children: ReactNode; views?: string; likes?: string; compact?: boolean}) => (
  <article style={{width: '100%', padding: compact ? '18px 22px' : '24px 28px', boxSizing: 'border-box', background: C.bg, border: `1px solid ${C.border}`}}>
    <div style={{display: 'flex', gap: 14}}>
      <Avatar src={UJJWAL} size={compact ? 42 : 50} />
      <div style={{flex: 1}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: compact ? 18 : 21}}>
          <strong>Ujjwal Mathur</strong><span style={{color: C.blue}}>@ujjwalmathur03 · You replied ✓</span>
        </div>
        <div style={{fontSize: compact ? 20 : 25, lineHeight: 1.32, marginTop: 9}}>{children}</div>
        {!compact && <Metrics replies="12" reposts="24" likes={likes} views={views} />}
      </div>
    </div>
  </article>
);

const Headline = ({eyebrow, children, width = 1100, align = 'left'}: {eyebrow?: string; children: ReactNode; width?: number; align?: 'left' | 'center'}) => (
  <div style={{width, textAlign: align}}>
    {eyebrow && <div style={{color: C.blue, fontSize: 24, fontWeight: 750, letterSpacing: '0.02em', marginBottom: 18}}>{eyebrow}</div>}
    <div style={{fontSize: 76, lineHeight: 1.02, letterSpacing: '-4px', fontWeight: 760}}>{children}</div>
  </div>
);

const Canvas = ({children}: {children: ReactNode}) => (
  <AbsoluteFill style={{background: C.bg, color: C.text, overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'}}>
    {children}
  </AbsoluteFill>
);

const Notification = ({icon, title, body, light = false, width = 610}: {icon: IconName; title: string; body: string; light?: boolean; width?: number}) => (
  <div style={{width, display: 'flex', alignItems: 'center', gap: 18, padding: '22px 24px', borderRadius: 22, color: light ? '#0f1419' : C.text, background: light ? '#f7f9f9' : '#16181c', border: `1px solid ${light ? '#cfd9de' : C.border}`, boxShadow: '0 20px 60px rgba(0,0,0,.35)'}}>
    <div style={{width: 54, height: 54, borderRadius: '50%', background: light ? C.blue : '#202d38', display: 'grid', placeItems: 'center'}}><Icon name={icon} size={29} color={light ? '#fff' : C.blue} /></div>
    <div style={{flex: 1}}><div style={{fontSize: 23, fontWeight: 750}}>{title}</div><div style={{fontSize: 20, marginTop: 4, color: light ? '#536471' : C.muted}}>{body}</div></div>
    <span style={{alignSelf: 'flex-start', color: light ? '#536471' : C.muted, fontSize: 17}}>now</span>
  </div>
);

const Creative01 = () => (
  <Canvas>
    <div style={{position: 'absolute', left: -120, top: 90, transform: 'scale(1.35)', opacity: 0.42}}>
      <Post author="Justin Welsh" handle="@thejustinwelsh" avatar={JUSTIN} views="112K">Accounts growing crazy fast build a deep network. <b>They engage regularly.</b></Post>
    </div>
    <div style={{position: 'absolute', right: -160, bottom: 80, transform: 'scale(1.2)', opacity: 0.28}}>
      <Post author="Sahil Bloom" handle="@SahilBloom" avatar={SAHIL} likes="6.9K" views="774K">The fastest way to build momentum is to shorten the feedback loop.</Post>
    </div>
    <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,.38)', backdropFilter: 'blur(3px)'}} />
    <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>
      <Headline align="center" width={1250}>Attention is<br />already here.</Headline>
    </div>
  </Canvas>
);

const Creative02 = () => (
  <Canvas>
    <div style={{position: 'absolute', left: 100, top: 100, width: 1400}}>
      <Headline eyebrow="THE INTERNET IS ALREADY TALKING">You don’t need to<br />create attention.</Headline>
    </div>
    <div style={{position: 'absolute', left: 100, bottom: 80, display: 'flex', gap: 24}}>
      {[
        [JUSTIN, 'Justin Welsh', '@thejustinwelsh', '112K'],
        [SAHIL, 'Sahil Bloom', '@SahilBloom', '774K'],
        [JUSTIN, 'Justin Welsh', '@thejustinwelsh', '287K'],
      ].map(([avatar, author, handle, views]) => (
        <div key={views} style={{width: 450, padding: '26px 28px', border: `1px solid ${C.border}`, borderRadius: 18}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 13}}><Avatar src={avatar} size={44} /><div><b style={{fontSize: 20}}>{author}</b><div style={{color: C.muted, fontSize: 17}}>{handle}</div></div></div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 35}}><Icon name="views" size={48} /><span style={{fontSize: 64, fontWeight: 760, letterSpacing: '-3px'}}>{views}</span></div>
          <div style={{color: C.muted, fontSize: 18, marginTop: 5}}>views</div>
        </div>
      ))}
    </div>
  </Canvas>
);

const Creative03 = () => (
  <Canvas>
    <div style={{position: 'absolute', left: 96, top: 80}}><Headline width={750}>Small creators:<br /><span style={{color: C.blue}}>replying</span> is the way<br />to grow on X.</Headline></div>
    <div style={{position: 'absolute', right: 70, top: 105, width: 720, transform: 'rotate(-1deg)'}}>
      <Post width={720} author="Justin Welsh" handle="@thejustinwelsh" avatar={JUSTIN} views="112K">Accounts growing crazy fast build a deep network. <b>They engage regularly.</b></Post>
      <div style={{marginTop: -1}}><Reply views="1.2K" likes="18">A clear point of view compounds when you keep showing up.</Reply></div>
    </div>
  </Canvas>
);

const Creative04 = () => (
  <Canvas>
    <div style={{position: 'absolute', left: 110, top: 76}}><Headline eyebrow="STEP 01">Find the conversation<br />that already has momentum.</Headline></div>
    <div style={{position: 'absolute', left: 110, right: 110, bottom: 74, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
      <Post width={680} author="Justin Welsh" handle="@thejustinwelsh" avatar={JUSTIN} likes="4.8K" views="112K" focusViews>Build a deep network. Engage regularly. Nothing fancy. All meaningful.</Post>
      <Post width={680} author="Sahil Bloom" handle="@SahilBloom" avatar={SAHIL} likes="9.4K" views="774K" focusViews>Do uncomfortable things sooner. The delayed conversation gets harder.</Post>
    </div>
  </Canvas>
);

const Creative05 = () => (
  <Canvas>
    <div style={{position: 'absolute', left: 90, top: 70}}><Headline eyebrow="STEP 02">Add something<br />worth noticing.</Headline></div>
    <div style={{position: 'absolute', right: 90, top: 76, width: 720, border: `1px solid ${C.border}`, borderRadius: 22, overflow: 'hidden', boxShadow: '0 28px 80px rgba(29,155,240,.08)'}}>
      <Post width={720} author="Sahil Bloom" handle="@SahilBloom" avatar={SAHIL} views="178K">The best opportunities are usually hiding inside the conversations everyone else ignores.</Post>
      <div style={{padding: '26px 30px 30px', borderTop: `1px solid ${C.border}`}}>
        <div style={{display: 'flex', gap: 14}}><Avatar src={UJJWAL} size={48} /><div style={{flex: 1}}><div style={{color: C.blue, fontSize: 18}}>Replying to @SahilBloom</div><div style={{fontSize: 26, lineHeight: 1.35, marginTop: 12}}>Distribution starts when your perspective improves a conversation people already care about.</div><div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 24}}><div style={{background: '#eff3f4', color: '#0f1419', padding: '11px 25px', borderRadius: 999, fontSize: 19, fontWeight: 750}}>Reply</div></div></div></div>
      </div>
    </div>
  </Canvas>
);

const Creative06 = () => {
  const replies = [
    'A clear point of view compounds when you keep showing up.',
    'The best distribution starts inside existing conversations.',
    'Consistency makes your point of view familiar—and familiarity builds trust.',
    'A useful reply earns attention before you ever ask for it.',
    'Small useful actions look ordinary until the payoff arrives.',
    'A network compounds one useful conversation at a time.',
  ];
  return (
    <Canvas>
      <div style={{position: 'absolute', left: 90, top: 70}}><Headline eyebrow="STEP 03">Be useful.<br />Then do it again.</Headline></div>
      <div style={{position: 'absolute', right: 70, top: 44, width: 790, height: 812, overflow: 'hidden', border: `1px solid ${C.border}`}}>
        {replies.map((reply) => <Reply key={reply} compact>{reply}</Reply>)}
      </div>
    </Canvas>
  );
};

const Creative07 = () => (
  <Canvas>
    <div style={{position: 'absolute', inset: 0, opacity: 0.25, filter: 'blur(5px)', transform: 'scale(1.04)'}}>
      <div style={{width: 920, margin: '65px auto'}}>
        <Reply compact>A useful reply earns attention before you ever ask for it.</Reply>
        <Reply compact>The best distribution starts inside existing conversations.</Reply>
        <Reply compact>A clear point of view compounds when you keep showing up.</Reply>
        <Reply compact>Consistency makes your point of view familiar.</Reply>
      </div>
    </div>
    <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>
      <Notification icon="bell" width={760} title="You’ve been consistent for 90 days" body="Keep joining the conversations that matter." />
    </div>
  </Canvas>
);

const Creative08 = () => (
  <Canvas>
    <div style={{position: 'absolute', left: 92, top: 68}}><Headline eyebrow="CONSISTENCY COMPOUNDS">The work looks small.<br />The result doesn’t.</Headline></div>
    <div style={{position: 'absolute', left: 92, bottom: 72, width: 870, height: 310, border: `1px solid ${C.border}`, borderRadius: 22, padding: '34px 38px', boxSizing: 'border-box'}}>
      <div style={{fontSize: 22, color: C.muted}}>Post impressions · Last 30 days</div>
      <div style={{fontSize: 104, lineHeight: 1, letterSpacing: '-6px', fontWeight: 760, marginTop: 22}}>2.7M</div>
      <div style={{fontSize: 24, color: C.green, marginTop: 15}}>↑ 418% from previous period</div>
      <div style={{position: 'absolute', right: 36, bottom: 34, display: 'flex', alignItems: 'flex-end', gap: 10}}>{[54,92,63,112,72,127,86,144,96,161].map((height, i) => <div key={i} style={{width: 18, height, borderRadius: '6px 6px 0 0', background: C.blue}} />)}</div>
    </div>
    <div style={{position: 'absolute', right: 90, bottom: 72, width: 480, height: 310, border: `1px solid ${C.border}`, borderRadius: 22, padding: '34px', boxSizing: 'border-box'}}>
      <div style={{display: 'flex', gap: 17, alignItems: 'center'}}><Avatar src={UJJWAL} size={72} /><div><div style={{fontSize: 28, fontWeight: 750}}>Ujjwal Mathur</div><div style={{fontSize: 20, color: C.muted}}>@ujjwalmathur03</div></div></div>
      <div style={{display: 'flex', gap: 36, marginTop: 42}}><div><b style={{fontSize: 43}}>5,214</b><div style={{color: C.muted, fontSize: 20}}>Followers</div></div><div><b style={{fontSize: 43}}>286</b><div style={{color: C.muted, fontSize: 20}}>Following</div></div></div>
    </div>
  </Canvas>
);

const Creative09 = () => (
  <Canvas>
    <div style={{position: 'absolute', left: 130, top: 90, width: 1100}}>
      <Post width={1100} author="Justin Welsh" handle="@thejustinwelsh" avatar={JUSTIN} likes="8.7K" views="526K">Accounts growing crazy fast build a deep network. They engage regularly.</Post>
      <div style={{marginTop: -1}}><Reply views="112K" likes="4.8K">Small creators: replying is the way to grow on X.</Reply></div>
    </div>
    <div style={{position: 'absolute', right: 90, bottom: 74}}><Notification light icon="message" title="Co-founder" body="Yo, 112K views, crazyyyy" /></div>
  </Canvas>
);

const Creative10 = () => (
  <Canvas>
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
        <div style={{width: 94, height: 94, borderRadius: '50%', background: C.text, color: '#000', display: 'grid', placeItems: 'center', fontSize: 58, fontWeight: 850}}>A</div>
        <div style={{fontSize: 132, lineHeight: 1, letterSpacing: '-8px', fontWeight: 820}}>AXE</div>
      </div>
      <div style={{fontSize: 42, color: C.muted, marginTop: 35, letterSpacing: '-1.2px'}}>Reply your way to growth.</div>
      <div style={{display: 'flex', gap: 30, marginTop: 64, color: C.text, fontSize: 24}}>
        <span style={{display: 'flex', alignItems: 'center', gap: 10}}><Icon name="reply" size={27} color={C.blue} /> Find attention</span>
        <span style={{color: C.muted}}>→</span>
        <span>Add value</span>
        <span style={{color: C.muted}}>→</span>
        <span>Repeat</span>
      </div>
    </div>
  </Canvas>
);

export const creativeComponents = [Creative01, Creative02, Creative03, Creative04, Creative05, Creative06, Creative07, Creative08, Creative09, Creative10];
