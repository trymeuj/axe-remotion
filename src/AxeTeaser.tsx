import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

const X_BLUE = '#1d9bf0';
const X_TEXT = '#e7e9ea';
const X_MUTED = '#71767b';
const X_BORDER = '#2f3336';

const posts = [
  {
    author: 'Justin Welsh',
    handle: '@thejustinwelsh',
    avatar: staticFile('x-reference/avatars/thejustinwelsh.jpg'),
    text: <>Accounts growing crazy fast build a deep network. <b>They engage regularly.</b></>,
    replies: '49',
    reposts: '38',
    likes: '533',
  },
  {
    author: 'Sahil Bloom',
    handle: '@SahilBloom',
    avatar: staticFile('x-reference/avatars/SahilBloom.jpg'),
    text: <>The fastest way to build momentum is to shorten the feedback loop.</>,
    replies: '161',
    reposts: '709',
    likes: '6.9K',
  },
  {
    author: 'Justin Welsh',
    handle: '@thejustinwelsh',
    avatar: staticFile('x-reference/avatars/thejustinwelsh.jpg'),
    text: <>Build a clear point of view, then show up long enough for people to remember it.</>,
    replies: '83',
    reposts: '214',
    likes: '2.4K',
  },
  {
    author: 'Sahil Bloom',
    handle: '@SahilBloom',
    avatar: staticFile('x-reference/avatars/SahilBloom.jpg'),
    text: <>One useful conversation can change the trajectory of your work.</>,
    replies: '97',
    reposts: '405',
    likes: '4.1K',
  },
  {
    author: 'Justin Welsh',
    handle: '@thejustinwelsh',
    avatar: staticFile('x-reference/avatars/thejustinwelsh.jpg'),
    text: <>Distribution compounds when you consistently contribute to existing conversations.</>,
    replies: '118',
    reposts: '532',
    likes: '5.7K',
  },
  {
    author: 'Sahil Bloom',
    handle: '@SahilBloom',
    avatar: staticFile('x-reference/avatars/SahilBloom.jpg'),
    text: <>Do the small useful thing again tomorrow. That is how momentum is built.</>,
    replies: '146',
    reposts: '618',
    likes: '8.2K',
  },
];

const postStarts = [0, 21, 39, 56, 72, 87];
const TITLE_START = 108;

const Verified = () => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 22,
      height: 22,
      marginLeft: 5,
      borderRadius: '50%',
      color: '#fff',
      background: X_BLUE,
      fontSize: 14,
      fontWeight: 900,
      transform: 'translateY(-1px)',
    }}
  >
    ✓
  </span>
);

const Icon = ({name, size = 34}: {name: 'reply' | 'repost' | 'heart' | 'views' | 'bookmark'; size?: number}) => {
  const paths: Record<string, ReactNode> = {
    reply: <path d="M21 11.5c0 4.5-4 8.1-9.2 8.1-1 0-2-.1-2.9-.4L4 21l1.5-4C3.9 15.6 3 13.7 3 11.5 3 7 7 3.4 12 3.4s9 3.6 9 8.1Z" />,
    repost: <><path d="m7 5 3-3 3 3M10 2v15M17 19l-3 3-3-3M14 22V7" /></>,
    heart: <path d="M20.8 8.8c0 6.2-8.8 11.3-8.8 11.3S3.2 15 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />,
    views: <path d="M4 20v-7m5 7V6m6 14v-10m5 10V3" />,
    bookmark: <path d="M6 3h12v18l-6-4-6 4Z" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

const Action = ({icon, value, target = false}: {icon: 'reply' | 'repost' | 'heart' | 'views' | 'bookmark'; value?: string; target?: boolean}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: target ? 18 : 12,
      color: target ? X_TEXT : X_MUTED,
      fontSize: target ? 49 : 30,
      fontWeight: target ? 500 : 400,
      letterSpacing: target ? '-1.4px' : 0,
      whiteSpace: 'nowrap',
    }}
  >
    <Icon name={icon} size={target ? 50 : 35} />
    {value && <span>{value}</span>}
  </div>
);

const PostSurface = ({post}: {post: (typeof posts)[number]}) => {
  const camera: CSSProperties = {
    position: 'absolute',
    width: 1120,
    height: 500,
    left: 0,
    top: 0,
    transformOrigin: '0 0',
    // Uniformly scale and crop the complete X surface. The views target at
    // local (699, 364) resolves to the exact centre of the 1920x1080 frame.
    transform: 'translate(-473px, -206px) scale(2.05)',
  };

  return (
    <div style={camera}>
      <article
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          color: X_TEXT,
          background: '#000',
          borderTop: `1px solid ${X_BORDER}`,
          borderBottom: `1px solid ${X_BORDER}`,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
        }}
      >
        <div style={{display: 'flex', gap: 18, padding: '34px 34px 0'}}>
          <Img src={post.avatar} style={{width: 58, height: 58, borderRadius: '50%', objectFit: 'cover', flex: '0 0 auto'}} />
          <div style={{minWidth: 0, flex: 1}}>
            <div style={{display: 'flex', alignItems: 'center', fontSize: 27, lineHeight: 1.1}}>
              <strong>{post.author}</strong>
              <Verified />
              <span style={{color: X_MUTED, marginLeft: 8}}>{post.handle} · 2h</span>
              <span style={{marginLeft: 'auto', color: X_MUTED, letterSpacing: 4}}>•••</span>
            </div>
            <div style={{fontSize: 32, lineHeight: 1.36, marginTop: 17, maxWidth: 870}}>{post.text}</div>
          </div>
        </div>

        <div style={{position: 'absolute', left: 0, right: 0, bottom: 64, height: 1, background: X_BORDER}} />
        <div
          style={{
            position: 'absolute',
            bottom: 86,
            left: 70,
          }}
        >
          <Action icon="reply" value={post.replies} />
        </div>
        <div style={{position: 'absolute', bottom: 86, left: 240}}>
          <Action icon="repost" value={post.reposts} />
        </div>
        <div style={{position: 'absolute', bottom: 86, left: 430}}>
          <Action icon="heart" value={post.likes} />
        </div>
        <div style={{position: 'absolute', bottom: 78, left: 615}}>
          <Action icon="views" value="112K" target />
        </div>
        <div style={{position: 'absolute', bottom: 86, left: 850}}>
          <Action icon="bookmark" />
        </div>
      </article>
    </div>
  );
};

export const AxeAttentionTeaser: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame >= TITLE_START) {
    return (
      <AbsoluteFill
        style={{
          background: '#000',
          color: '#f2f2f2',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
        }}
      >
        <div style={{fontSize: 86, lineHeight: 1, letterSpacing: '-4.2px', fontWeight: 760}}>
          Attention is already here.
        </div>
      </AbsoluteFill>
    );
  }

  let index = 0;
  for (let i = postStarts.length - 1; i >= 0; i--) {
    if (frame >= postStarts[i]) {
      index = i;
      break;
    }
  }

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <PostSurface post={posts[index]} />
    </AbsoluteFill>
  );
};
