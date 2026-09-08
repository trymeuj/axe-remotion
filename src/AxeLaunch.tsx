import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

const C = { blue: "#1d9bf0", pink: "#f91880" };
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const cl = (f: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(f, [a, b], [x, y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
const lin = (f: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(f, [a, b], [x, y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
const pop = (f: number, at: number) =>
  spring({
    frame: f - at,
    fps: 30,
    config: { damping: 16, stiffness: 160, mass: 0.8 },
  });

const Icon = ({
  name,
  size = 28,
  fill = "none",
}: {
  name: string;
  size?: number;
  fill?: string;
}) => {
  const paths: Record<string, ReactNode> = {
    home: <path d="M3 11.2 12 3l9 8.2v9.3h-6v-6H9v6H3Z" />,
    search: (
      <>
        <circle cx="10.7" cy="10.7" r="7.1" />
        <path d="m16 16 5 5" />
      </>
    ),
    bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M9.5 21h5" />,
    profile: (
      <>
        <circle cx="12" cy="7.2" r="4" />
        <path d="M4.5 21c.6-5 3-7.2 7.5-7.2s6.9 2.2 7.5 7.2" />
      </>
    ),
    reply: (
      <path d="M21 11.5c0 4.5-4 8.1-9.2 8.1-1 0-2-.1-2.9-.4L4 21l1.5-4C3.9 15.6 3 13.7 3 11.5 3 7 7 3.4 12 3.4s9 3.6 9 8.1Z" />
    ),
    repost: (
      <>
        <path d="m7 5 3-3 3 3M10 2v15M17 19l-3 3-3-3M14 22V7" />
      </>
    ),
    heart: (
      <path d="M20.8 8.8c0 6.2-8.8 11.3-8.8 11.3S3.2 15 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
    ),
    views: <path d="M4 20v-7m5 7V6m6 14v-10m5 10V3" />,
    bookmark: <path d="M6 3h12v18l-6-4-6 4Z" />,
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <circle cx="9" cy="10" r="2" />
        <path d="m5 18 5-5 4 4 2-2 3 3" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20c.5-4.2 2.5-6 6-6s5.5 1.8 6 6M15 15c3.6-.4 5.5 1.3 6 4.5" />
      </>
    ),
    message: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m5 8 7 5 7-5" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};

const XLogo = ({ size = 34 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.24 2H21l-6.04 6.9L22 22h-5.52l-4.32-5.65L7.22 22H4.45l6.42-7.34L4.12 2H9.8l3.9 5.16L18.24 2Zm-.97 17.7h1.53L8.96 4.18H7.32L17.27 19.7Z" />
  </svg>
);
const Verified = () => <span className="verified">✓</span>;

const AVATAR_JUSTIN = staticFile("x-reference/avatars/thejustinwelsh.jpg");
const AVATAR_SAHIL = staticFile("x-reference/avatars/SahilBloom.jpg");
const USER_AVATAR = staticFile("x-reference/avatars/ujjwalmathur03.jpg");
const Avatar = ({ src, size = 48 }: { src: string; size?: number }) => (
  <Img className="x-avatar" src={src} style={{ width: size, height: size }} />
);

type PostProps = {
  author: string;
  handle: string;
  avatar: string;
  text: ReactNode;
  time?: string;
  replies?: string;
  reposts?: string;
  likes?: string;
  views?: string;
  big?: boolean;
  highlightReply?: number;
};
const Post = ({
  author,
  handle,
  avatar,
  text,
  time = "2h",
  replies = "128",
  reposts = "94",
  likes = "1.8K",
  views = "86K",
  big = false,
  highlightReply = 0,
}: PostProps) => (
  <article className={`x-post ${big ? "x-post--big" : ""}`}>
    <Avatar src={avatar} size={big ? 55 : 48} />
    <div className="x-post-body">
      <div className="x-byline">
        <strong>{author}</strong>
        <Verified />
        <span>{handle} · {time}</span>
        <span className="x-more">
          <Icon name="more" size={23} />
        </span>
      </div>
      <div className="x-copy">{text}</div>
      {big && <div className="x-timestamp">10:33 PM · Jul 25, 2022</div>}
      <div className="x-actions">
        <span style={{ color: highlightReply ? C.blue : undefined }}>
          <i
            style={{
              transform: `scale(${1 + highlightReply * 0.18})`,
              background: `rgba(29,155,240,${highlightReply * 0.13})`,
            }}
          >
            <Icon name="reply" size={21} />
          </i>
          {replies}
        </span>
        <span>
          <i>
            <Icon name="repost" size={21} />
          </i>
          {reposts}
        </span>
        <span>
          <i>
            <Icon name="heart" size={21} />
          </i>
          {likes}
        </span>
        <span className="x-views-target">
          <i>
            <Icon name="views" size={21} />
          </i>
          {views}
        </span>
        <span>
          <i>
            <Icon name="bookmark" size={21} />
          </i>
        </span>
      </div>
    </div>
  </article>
);

const Nav = ({ active }: { active: "home" | "notifications" | "profile" }) => (
  <aside className="x-nav">
    <XLogo size={34} />
    {[
      ["home", "Home"],
      ["search", "Explore"],
      ["bell", "Notifications"],
      ["users", "Chat"],
      ["profile", "Profile"],
    ].map(([icon, label]) => (
      <div
        className={`nav-item ${active === label.toLowerCase() ? "active" : ""}`}
        key={label}
      >
        <Icon name={icon} size={29} />
        <span>{label}</span>
      </div>
    ))}
    <div className="nav-more">
      <Icon name="more" size={29} />
      <span>More</span>
    </div>
    <button className="post-button">Post</button>
    <div className="account">
      <Avatar src={USER_AVATAR} size={42} />
      <div>
        <b>Ujjwal Mathur</b>
        <span>@ujjwalmathur03</span>
      </div>
      <Icon name="more" size={18} />
    </div>
  </aside>
);
const RightRail = () => (
  <aside className="x-right">
    <div className="x-search">
      <Icon name="search" size={20} />
      Search
    </div>
    <section>
      <h3>Relevant people</h3>
      <div className="person">
        <Avatar src={AVATAR_JUSTIN} />
        <div>
          <b>
            Justin Welsh <Verified />
          </b>
          <span>@thejustinwelsh</span>
        </div>
        <button>Following</button>
      </div>
      <p>Writer &amp; Entrepreneur. I write The Saturday Essay.</p>
    </section>
    <section>
      <h3>What&apos;s happening</h3>
      {[
        "Creators · Trending",
        "Build in public",
        "Design · Trending",
        "Launch day",
      ].map((x, i) => (
        <div className="trend" key={x}>
          <span>{x}</span>
          <b>{i % 2 ? "#buildinpublic" : "Growth on X"}</b>
          <small>{24 + i * 17}K posts</small>
        </div>
      ))}
    </section>
  </aside>
);
const Header = ({ title }: { title: string }) => (
  <div className="x-header">
    <b>{title}</b>
  </div>
);

const HomeFeed = ({ frame }: { frame: number }) => {
  const y = cl(frame, 0, 88, 70, -215);
  const hot = cl(frame, 72, 105);
  return (
    <main className="x-center">
      <Header title="For you" />
      <div className="feed" style={{ transform: `translateY(${y}px)` }}>
        <div className="composer-mini">
          <Avatar src={USER_AVATAR} />
          <span>What&apos;s happening?</span>
          <button>Post</button>
        </div>
        <Post
          author="Sahil Bloom"
          handle="@SahilBloom"
          avatar={AVATAR_SAHIL}
          text={
            <>
              Do uncomfortable things sooner.{" "}
              <b>The delayed conversation gets harder.</b> The ignored problem
              expands.
            </>
          }
          replies="150"
          reposts="933"
          likes="6.9K"
          views="178K"
        />
        <Post
          author="Justin Welsh"
          handle="@thejustinwelsh"
          avatar={AVATAR_JUSTIN}
          text={
            <>
              Twitter observation:
              <br />
              <br />
              <b>
                Accounts growing crazy fast don&apos;t have the best content.
              </b>
              <br />
              <br />
              They have a clear profile, helpful content, and a deep network.{" "}
              <b>They engage regularly.</b>
            </>
          }
          replies="49"
          reposts="38"
          likes="533"
          views="92K"
          highlightReply={hot}
        />
        <Post
          author="Sahil Bloom"
          handle="@SahilBloom"
          avatar={AVATAR_SAHIL}
          text={
            <>
              Shrink the time horizon. Focus on the next hour.{" "}
              <b>One closed loop. One hard conversation.</b>
            </>
          }
          replies="161"
          reposts="709"
          likes="5.9K"
          views="774K"
        />
      </div>
    </main>
  );
};

const InlineReply = () => (
  <div className="inline-reply">
    <Avatar src={USER_AVATAR} />
    <span>Post your reply</span>
    <button>Reply</button>
  </div>
);
const OurReply = ({ frame }: { frame: number }) => (
  <div
    className="our-reply"
    style={{
      opacity: cl(frame, 270, 282),
      transform: `translateY(${cl(frame, 270, 292, 25, 0)}px)`,
    }}
  >
    <div className="thread-stem" />
    <Avatar src={USER_AVATAR} />
    <div>
      <div className="x-byline">
        <strong>Ujjwal Mathur</strong>
        <span>@ujjwalmathur03 · now</span>
      </div>
      <p>
        <b>Small creators: replying is the way to grow on X.</b>
      </p>
      <div className="x-actions">
        <span>
          <i>
            <Icon name="reply" size={21} />
          </i>
          3
        </span>
        <span>
          <i>
            <Icon name="repost" size={21} />
          </i>
          2
        </span>
        <span style={{ color: frame > 294 ? C.pink : undefined }}>
          <i>
            <Icon name="heart" size={21} fill={frame > 294 ? C.pink : "none"} />
          </i>
          {frame > 368 ? "427" : frame > 335 ? "86" : frame > 300 ? "18" : "0"}
        </span>
        <span
          className="reply-views-target"
        >
          <i>
            <Icon name="views" size={21} />
          </i>
          {frame > 368 ? "48K" : frame > 335 ? "10.4K" : frame > 300 ? "1.2K" : "18"}
        </span>
      </div>
    </div>
  </div>
);
const PostDetail = ({ frame, sent }: { frame: number; sent: boolean }) => (
  <main className="x-center">
    <Header title="Post" />
    <Post
      author="Justin Welsh"
      handle="@thejustinwelsh"
      avatar={AVATAR_JUSTIN}
      big
      text={
        <>
          Twitter observation:
          <br />
          <br />
          <b>Accounts growing crazy fast don&apos;t have the best content.</b>
          <br />
          <br />
          They have:
          <br />
          <br />
          1. A clear profile
          <br />
          2. Helpful content
          <br />
          <b>3. Deep network: They engage regularly</b>
          <br />
          <br />
          Nothing fancy. All meaningful.
        </>
      }
      replies={sent ? "50" : "49"}
      reposts="38"
      likes="533"
      views="112K"
      highlightReply={cl(frame, 115, 145)}
    />
    {sent ? <OurReply frame={frame} /> : <InlineReply />}
  </main>
);

const ReplyModal = ({ frame }: { frame: number }) => {
  const open = pop(frame, 165);
  const full = "Small creators: replying is the way to grow on X.";
  const typed = full.slice(0, Math.floor(cl(frame, 184, 250, 0, full.length)));
  const send = pop(frame, 258);
  return (
    <div className="modal-shade" style={{ opacity: open }}>
      <div
        className="reply-modal"
        style={{
          transform: `translateY(${(1 - open) * 45}px) scale(${0.96 + open * 0.04})`,
        }}
      >
        <button className="close">×</button>
        <Post
          author="Justin Welsh"
          handle="@thejustinwelsh"
          avatar={AVATAR_JUSTIN}
          text={
            <>
              Accounts growing crazy fast don&apos;t have the best content. They
              engage regularly.
            </>
          }
          replies="49"
          reposts="38"
          likes="533"
          views="112K"
        />
        <div className="modal-thread" />
        <div className="modal-compose">
          <Avatar src={USER_AVATAR} />
          <div>
            <span className="replying">
              Replying to <b>@thejustinwelsh</b>
            </span>
            <p className={typed ? "" : "placeholder"}>
              {typed || "Post your reply"}
              <i className="caret" />
            </p>
            <div className="compose-bottom">
              <span>
                <Icon name="image" size={23} />
              </span>
              <button style={{ transform: `scale(${1 + send * 0.08})` }}>
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Notifications = ({ frame }: { frame: number }) => {
  const rows = [
    {
      at: 450,
      kind: "heart",
      who: "Justin Welsh",
      text: "liked your reply",
      avatar: AVATAR_JUSTIN,
      post: "Small accounts don’t need more empty posts…",
    },
    {
      at: 468,
      kind: "users",
      who: "Sahil Bloom and 6 others",
      text: "liked your reply",
      avatar: AVATAR_SAHIL,
      post: "They need to add something useful…",
    },
    {
      at: 486,
      kind: "profile",
      who: "12 people",
      text: "viewed your profile",
      avatar: USER_AVATAR,
      post: "from your reply",
    },
    {
      at: 504,
      kind: "users",
      who: "4 people",
      text: "followed you",
      avatar: AVATAR_JUSTIN,
      post: "",
    },
  ];
  const followers = Math.floor(cl(frame, 500, 535, 70, 86));
  return (
    <main className="x-center">
      <Header title="Notifications" />
      <div className="tabs">
        <b>All</b>
        <span>Mentions</span>
      </div>
      {rows.map((r, i) => {
        const p = pop(frame, r.at);
        return (
          <div
            className="notification-row"
            key={r.at}
            style={{ opacity: p, transform: `translateY(${(1 - p) * 22}px)` }}
          >
            <span className={r.kind === "heart" ? "pink" : "blue"}>
              <Icon
                name={r.kind === "heart" ? "heart" : r.kind}
                size={31}
                fill={r.kind === "heart" ? C.pink : "none"}
              />
            </span>
            <Avatar src={r.avatar} size={42} />
            <div>
              <p>
                <b>{r.who}</b> {r.text}
              </p>
              <small>{r.post}</small>
            </div>
            <time>{i + 1}m</time>
          </div>
        );
      })}
      <div
        className="follower-payoff"
        style={{
          opacity: cl(frame, 505, 520),
          transform: `translateY(${cl(frame, 505, 525, 24, 0)}px)`,
        }}
      >
        <Avatar src={USER_AVATAR} size={58} />
        <div>
          <b>Ujjwal Mathur</b>
          <span>@ujjwalmathur03</span>
        </div>
        <strong>
          {followers}
          <small> followers</small>
        </strong>
      </div>
    </main>
  );
};

const AxePanel = ({ frame }: { frame: number }) => {
  const p = pop(frame, 660);
  return (
    <div
      className="axe-panel"
      style={{ transform: `translateX(${(1 - p) * 420}px)`, opacity: p }}
    >
      <div className="axe-head">
        <div className="axe-mark">A</div>
        <div>
          <b>Axe</b>
          <span>Reply opportunities</span>
        </div>
        <span className="live-dot" />
      </div>
      <div className="axe-label">HIGH-ATTENTION POSTS</div>
      <div className="axe-opportunity">
        <Avatar src={AVATAR_JUSTIN} />
        <div>
          <b>
            Justin Welsh <Verified />
          </b>
          <span>92K views · 49 replies</span>
          <p>Accounts growing crazy fast don&apos;t have the best content…</p>
          <button>Reply while it&apos;s moving</button>
        </div>
      </div>
      <div className="axe-opportunity">
        <Avatar src={AVATAR_SAHIL} />
        <div>
          <b>
            Sahil Bloom <Verified />
          </b>
          <span>178K views · 150 replies</span>
          <p>
            Do uncomfortable things sooner. The delayed conversation gets
            harder…
          </p>
        </div>
      </div>
      <div className="axe-foot">
        <span>2 opportunities found</span>
        <b>Stay consistent →</b>
      </div>
    </div>
  );
};

const WallCard = ({ index, frame }: { index: number; frame: number }) => {
  const real = index === 31 || index === 30 || index === 32;
  const light = cl(
    frame,
    565 + Math.abs(index - 31) * 1.35,
    610 + Math.abs(index - 31) * 0.35,
  );
  return (
    <div className={`wall-card ${real ? "real" : ""}`}>
      <div className="wall-byline">
        {real ? (
          <>
            <Avatar
              src={
                index === 31
                  ? USER_AVATAR
                  : index === 30
                    ? AVATAR_JUSTIN
                    : AVATAR_SAHIL
              }
              size={42}
            />
            <div>
              <b>
                {index === 31
                  ? "Ujjwal Mathur"
                  : index === 30
                    ? "Justin Welsh"
                    : "Sahil Bloom"}
              </b>
              <span>
                {index === 31 ? "@ujjwalmathur03" : "Verified creator"}
              </span>
            </div>
          </>
        ) : (
          <>
            <i />
            <div>
              <b />
              <span />
            </div>
          </>
        )}
      </div>
      <div className="wall-lines">
        {real ? (
          <p>
            {index === 31
              ? "Add something useful where people are already paying attention."
              : index === 30
                ? "Accounts growing fast have a deep network. They engage regularly."
                : "Do uncomfortable things sooner. The delayed conversation gets harder."}
          </p>
        ) : (
          <>
            <i />
            <i />
            <i />
          </>
        )}
      </div>
      <div className="wall-actions">
        <span
          style={{
            color: light ? C.blue : undefined,
            transform: `scale(${1 + light * 0.12})`,
          }}
        >
          <Icon name="reply" size={24} />
          {real ? (index === 31 ? "24" : "49") : ""}
        </span>
        <span>
          <Icon name="repost" size={22} />
        </span>
        <span>
          <Icon name="heart" size={22} />
        </span>
        <span>
          <Icon name="views" size={22} />
        </span>
      </div>
    </div>
  );
};
const ConversationWall = ({ frame }: { frame: number }) => {
  const t = cl(frame, 540, 655);
  const scale = 1.18 * Math.pow(0.3 / 1.18, Math.pow(t, 0.86));
  return (
    <AbsoluteFill className="wall-world">
      <div
        className="wall-plane"
        style={{
          transform: `translate(-50%,-50%) perspective(1800px) rotateX(${5 * t}deg) rotateY(${-2 * t}deg) scale(${scale})`,
        }}
      >
        {Array.from({ length: 63 }, (_, i) => (
          <WallCard key={i} index={i} frame={frame} />
        ))}
      </div>
      <div className="wall-edge" />
    </AbsoluteFill>
  );
};

type Placement = { s: number; x: number; y: number };
const placements: Record<string, Placement> = {
  attentionMetric: { s: 1.72, x: -72, y: -135 },
  wideFeed: { s: 0.84, x: 0, y: 22 },
  heroPost: { s: 1.24, x: -84, y: -32 },
  replyComposer: { s: 1.06, x: -62, y: 0 },
  typedPush: { s: 1.15, x: -72, y: -18 },
  replyWide: { s: 1.08, x: -94, y: -72 },
  replyMetrics: { s: 1.58, x: -116, y: -242 },
  notifications: { s: 0.98, x: 14, y: 0 },
  notificationPayoff: { s: 1.34, x: -52, y: -118 },
  axeWide: { s: 0.82, x: -112, y: 0 },
  axeCta: { s: 1.08, x: -188, y: -42 },
};
const blend = (a: Placement, b: Placement, t: number): Placement => ({
  s: a.s + (b.s - a.s) * t,
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});
const cameraAt = (frame: number) => {
  if (frame < 42)
    return blend(
      placements.attentionMetric,
      placements.wideFeed,
      cl(frame, 0, 42),
    );
  if (frame < 92)
    return blend(placements.wideFeed, placements.heroPost, cl(frame, 62, 92));
  if (frame < 150) return placements.heroPost;
  if (frame < 245) return placements.replyComposer;
  if (frame < 300)
    return blend(
      placements.replyComposer,
      placements.typedPush,
      cl(frame, 245, 278),
    );
  if (frame < 345) return placements.replyWide;
  if (frame < 420)
    return blend(
      placements.replyWide,
      placements.replyMetrics,
      cl(frame, 345, 410),
    );
  if (frame < 490) return placements.notifications;
  if (frame < 540)
    return blend(
      placements.notifications,
      placements.notificationPayoff,
      cl(frame, 490, 535),
    );
  if (frame < 690)
    return blend(placements.axeWide, placements.axeCta, cl(frame, 660, 685));
  return blend(placements.axeCta, placements.axeWide, cl(frame, 690, 715));
};
const CameraStage = () => {
  const frame = useCurrentFrame();
  if (frame >= 540 && frame < 660) return <ConversationWall frame={frame} />;
  const modal = frame >= 150 && frame < 300;
  const sent = frame >= 300;
  const notifications = frame >= 420 && frame < 540;
  const axe = frame >= 660;
  const detail = frame >= 92;
  const c = cameraAt(frame);
  return (
    <div
      className="camera"
      style={{ transform: `scale(${c.s}) translate(${c.x}px,${c.y}px)` }}
    >
      <div className="x-app">
        <Nav active={notifications ? "notifications" : "home"} />
        {notifications ? (
          <Notifications frame={frame} />
        ) : detail ? (
          <PostDetail frame={frame} sent={sent} />
        ) : (
          <HomeFeed frame={frame} />
        )}
        <RightRail />
        {axe && <AxePanel frame={frame} />}
      </div>
      {modal && <ReplyModal frame={frame} />}
    </div>
  );
};
const focusWindow = (frame: number) =>
  Math.max(
    cl(frame, 22, 32) * cl(frame, 66, 76, 1, 0),
    cl(frame, 98, 106) * cl(frame, 132, 142, 1, 0),
    cl(frame, 308, 318) * cl(frame, 342, 352, 1, 0),
    cl(frame, 425, 435) * cl(frame, 462, 472, 1, 0),
    cl(frame, 552, 562) * cl(frame, 607, 617, 1, 0),
  );
// Retained as reference camera choreography while the premium cut uses the
// explicit scene directors below.
void CameraStage;
void focusWindow;
const Copy = ({
  children,
  at,
  out,
}: {
  children: ReactNode;
  at: number;
  out: number;
}) => {
  const frame = useCurrentFrame();
  const a = cl(frame, at, at + 10);
  const b = cl(frame, out - 10, out);
  return (
    <div
      className="film-copy"
      style={{
        opacity: a * (1 - b),
        transform: `translate(-50%,-50%) translateY(${(1 - a) * 24 - b * 18}px)`,
      }}
    >
      {children}
    </div>
  );
};

const SceneX = ({
  frame,
  detail = false,
  sent = false,
  transform = "scale(0.9)",
}: {
  frame: number;
  detail?: boolean;
  sent?: boolean;
  transform?: string;
}) => (
  <div className="scene-x" style={{ transform }}>
    <div className="x-app">
      <Nav active="home" />
      {detail ? (
        <PostDetail frame={frame} sent={sent} />
      ) : (
        <HomeFeed frame={frame} />
      )}
      <RightRail />
    </div>
  </div>
);

const MetricHero = ({
  frame,
  at,
  out,
  value,
  label = "views",
  pink = false,
}: {
  frame: number;
  at: number;
  out: number;
  value: string;
  label?: string;
  pink?: boolean;
}) => {
  const enter = cl(frame, at, at + 8);
  const leave = cl(frame, out - 6, out);
  return (
    <div
      className={`metric-hero ${pink ? "metric-hero--pink" : ""}`}
      style={{
        opacity: enter * (1 - leave),
        transform: `translate(-50%,-50%) scale(${0.76 + enter * 0.24 + cl(frame, at, out, 0, 0.08)})`,
      }}
    >
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
};

const OpeningScene = ({ frame }: { frame: number }) => {
  const travel = cl(frame, 58, 82);
  const scale = 1.08 - travel * 0.18;
  const y = -travel * 82;
  return (
    <AbsoluteFill className="scene">
      <div className="scene-dim">
        <SceneX
          frame={frame < 58 ? 50 : 0}
          transform={`scale(${scale}) translateY(${y}px)`}
        />
      </div>
      <MetricHero frame={frame} at={0} out={62} value="112K" label="views on this post" />
      <div
        className="question-line"
        style={{ opacity: cl(frame, 27, 35) * cl(frame, 57, 63, 1, 0) }}
      >
        WANT 112K VIEWS?
      </div>
      <MetricHero frame={frame} at={66} out={96} value="774K" label="views on another post" />
      <Copy at={96} out={120}>
        THE ATTENTION IS ALREADY <em>HERE.</em>
      </Copy>
    </AbsoluteFill>
  );
};

const EnterScene = ({ frame }: { frame: number }) => {
  const push = cl(frame, 120, 174);
  const replyPush = cl(frame, 174, 208);
  return (
    <AbsoluteFill className="scene">
      <SceneX
        frame={frame}
        detail
        transform={`scale(${1.05 + push * 0.55 + replyPush * 0.35}) translate(${-70 - replyPush * 135}px,${-15 - push * 92 - replyPush * 145}px)`}
      />
      <div
        className="native-quote"
        style={{ opacity: cl(frame, 128, 140) * cl(frame, 166, 176, 1, 0) }}
      >
        They engage regularly.
      </div>
      <div
        className="reply-target"
        style={{
          opacity: cl(frame, 176, 186),
          transform: `translate(-50%,-50%) scale(${0.75 + pop(frame, 184) * 0.25})`,
        }}
      >
        <Icon name="reply" size={72} />
      </div>
    </AbsoluteFill>
  );
};

const ComposeScene = ({ frame }: { frame: number }) => (
  <AbsoluteFill className="scene">
    <SceneX frame={frame} detail transform="scale(0.92)" />
    <div className="composer-camera">
      <ReplyModal frame={frame} />
    </div>
  </AbsoluteFill>
);

const ImpactScene = ({ frame }: { frame: number }) => {
  const push = cl(frame, 330, 470);
  return (
    <AbsoluteFill className="scene impact-scene">
      <SceneX
        frame={frame}
        detail
        sent
        transform={`scale(${1.04 + push * 0.48}) translate(${-75 - push * 55}px,${-110 - push * 105}px)`}
      />
      <div
        className="replied-stamp"
        style={{ opacity: cl(frame, 326, 336) * cl(frame, 354, 362, 1, 0) }}
      >
        YOU REPLIED <b>✓</b>
      </div>
      <MetricHero frame={frame} at={338} out={374} value="1.2K" label="views · 12 likes" />
      <MetricHero frame={frame} at={372} out={412} value="10.4K" label="views · 86 likes" />
      <MetricHero frame={frame} at={410} out={448} value="48K" label="views · 427 likes" />
      <MetricHero frame={frame} at={446} out={480} value="112K" label="views · 1.8K likes" />
      <div
        className="impact-promise"
        style={{ opacity: cl(frame, 456, 463) * cl(frame, 478, 482, 1, 0) }}
      >
        YOUR POSTS CAN HIT 112K TOO.
      </div>
    </AbsoluteFill>
  );
};

const NotificationHero = ({
  frame,
  at,
  out,
  icon,
  avatar,
  children,
  sub,
}: {
  frame: number;
  at: number;
  out: number;
  icon: "heart" | "profile" | "users";
  avatar: string;
  children: ReactNode;
  sub: string;
}) => {
  const p = cl(frame, at, at + 8);
  const q = cl(frame, out - 7, out);
  return (
    <div
      className="notification-hero"
      style={{
        opacity: p * (1 - q),
        transform: `translate(-50%,-50%) translateY(${(1 - p) * 70 - q * 45}px) scale(${0.9 + p * 0.1})`,
      }}
    >
      <span className={icon === "heart" ? "pink" : "blue"}>
        <Icon name={icon} size={66} fill={icon === "heart" ? C.pink : "none"} />
      </span>
      <Avatar src={avatar} size={88} />
      <div>
        <strong>{children}</strong>
        <small>{sub}</small>
      </div>
    </div>
  );
};

const GrowthHero = ({ frame }: { frame: number }) => {
  const steps = [
    [590, 600, "DAY 1", "286"],
    [600, 610, "WEEK 1", "742"],
    [610, 620, "WEEK 3", "1.8K"],
    [620, 630, "MONTH 3", "5.1K"],
  ] as const;
  const current = steps.find(([, out]) => frame < out) ?? steps[steps.length - 1];
  const index = steps.indexOf(current);
  return (
    <div className="growth-hero">
      <div className="growth-profile">
        <Avatar src={USER_AVATAR} size={112} />
        <div>
          <b>Ujjwal Mathur</b>
          <span>@ujjwalmathur03</span>
        </div>
      </div>
      <span className="growth-time">{current[2]}</span>
      <strong style={{ transform: `scale(${1 + index * 0.07})` }}>
        {current[3]}
      </strong>
      <small>FOLLOWERS</small>
    </div>
  );
};

const DiscoveryScene = ({ frame }: { frame: number }) => (
  <AbsoluteFill className="scene notification-world">
    <div className="notification-backdrop">
      <SceneX frame={frame} detail sent transform="scale(0.9)" />
    </div>
    <Copy at={480} out={510}>
      ONE REPLY PUTS YOU IN THE <em>ROOM.</em>
    </Copy>
    <NotificationHero
      frame={frame}
      at={510}
      out={540}
      icon="heart"
      avatar={AVATAR_JUSTIN}
      sub="Small creators: replying is the way to grow on X."
    >
      Justin Welsh liked your reply
    </NotificationHero>
    <NotificationHero
      frame={frame}
      at={540}
      out={565}
      icon="profile"
      avatar={USER_AVATAR}
      sub="from your reply"
    >
      People visited your profile
    </NotificationHero>
    <NotificationHero
      frame={frame}
      at={565}
      out={590}
      icon="users"
      avatar={AVATAR_SAHIL}
      sub="Your replies are getting noticed"
    >
      27 new followers
    </NotificationHero>
    {frame >= 590 && <GrowthHero frame={frame} />}
  </AbsoluteFill>
);

const RepeatCard = ({
  avatar,
  author,
  handle,
  text,
  result,
}: {
  avatar: string;
  author: string;
  handle: string;
  text: string;
  result: string;
}) => (
  <div className="repeat-card">
    <Post
      author={author}
      handle={handle}
      avatar={avatar}
      text={text}
      replies=""
      reposts=""
      likes=""
      views={result}
    />
    <div className="repeat-complete">
      <span>YOU REPLIED</span>
      <b>✓</b>
    </div>
  </div>
);

const RepeatScene = ({ frame }: { frame: number }) => {
  const cards = [
    {
      avatar: AVATAR_JUSTIN,
      author: "Justin Welsh",
      handle: "@thejustinwelsh",
      text: "Accounts growing fast build a deep network. They engage regularly.",
      result: "10.4K views",
    },
    {
      avatar: AVATAR_SAHIL,
      author: "Sahil Bloom",
      handle: "@SahilBloom",
      text: "Do uncomfortable things sooner. The delayed conversation gets harder.",
      result: "48K views",
    },
    {
      avatar: USER_AVATAR,
      author: "A conversation already moving",
      handle: "on X",
      text: "Add your perspective while people are already paying attention.",
      result: "112K views",
    },
  ];
  const index = Math.min(2, Math.floor((frame - 630) / 24));
  const local = (frame - 630) % 24;
  return (
    <AbsoluteFill className="repeat-world">
      <div
        className="repeat-scroll"
        style={{ transform: `translateY(${cl(local, 0, 9, 90, 0)}px)` }}
      >
        <RepeatCard {...cards[index]} />
      </div>
      {frame >= 698 && (
        <div className="repeat-copy">
          <em>REPLY.</em><span>BE USEFUL.</span><strong>REPEAT.</strong>
        </div>
      )}
    </AbsoluteFill>
  );
};

const AxeHero = ({ frame }: { frame: number }) => {
  const p = pop(frame, 720);
  return (
    <AbsoluteFill className="axe-world">
      <div className="axe-backdrop">
        <SceneX frame={frame} transform="scale(0.88)" />
      </div>
      <div
        className="axe-hero"
        style={{
          opacity: p,
          transform: `translate(-50%,-50%) scale(${0.86 + p * 0.14})`,
        }}
      >
        <div className="axe-hero-head">
          <div className="axe-mark">A</div>
          <div>
            <b>Axe</b>
            <span>High-attention conversations</span>
          </div>
          <i />
        </div>
        <div className="axe-hero-post">
          <Avatar src={AVATAR_SAHIL} size={76} />
          <div>
            <b>
              Sahil Bloom <Verified />
            </b>
            <span>@SahilBloom · Attention rising</span>
            <p>Do uncomfortable things sooner. The delayed conversation gets harder.</p>
            <strong>178K views</strong>
          </div>
          <button>Reply while it&apos;s moving</button>
        </div>
      </div>
    </AbsoluteFill>
  );
};
// Kept as visual reference for the discarded slide-based cut.
void OpeningScene;
void EnterScene;
void ComposeScene;
void ImpactScene;
void DiscoveryScene;
void RepeatScene;
void AxeHero;

const StoryFeed = ({ frame }: { frame: number }) => {
  return (
    <main className="x-center story-center">
      <Header title="For you" />
      <div className="story-feed">
        <Post author="Sahil Bloom" handle="@SahilBloom" avatar={AVATAR_SAHIL}
          text={<>Do uncomfortable things sooner. <b>The delayed conversation gets harder.</b></>}
          replies="161" reposts="709" likes="5.9K" views="774K" />
        <Post author="Justin Welsh" handle="@thejustinwelsh" avatar={AVATAR_JUSTIN}
          text={<>Twitter observation:<br /><br />Accounts growing crazy fast build a deep network. <b>They engage regularly.</b></>}
          replies="49" reposts="38" likes="533" views="112K"
          highlightReply={cl(frame, 145, 164)} />
        <Post author="Sahil Bloom" handle="@SahilBloom" avatar={AVATAR_SAHIL}
          text={<>Shrink the time horizon. <b>One closed loop. One hard conversation.</b></>}
          replies="150" reposts="933" likes="6.9K" views="178K" />
      </div>
    </main>
  );
};

const XMessageToast = ({ frame, at, out, message }: { frame: number; at: number; out: number; message: string }) => {
  const enter = cl(frame, at, at + 8);
  const leave = cl(frame, out - 8, out);
  return (
    <div className="x-message-toast" style={{opacity: enter * (1-leave), transform: `translate(-50%,${(1-enter)*-110-leave*90}px) scale(${.97+enter*.03})`}}>
      <span><Icon name="message" size={31} /></span>
      <div><b>Co-founder</b><p>{message}</p></div>
      <small>now</small>
    </div>
  );
};

const NativeNotificationsCenter = ({ frame }: { frame: number }) => {
  const rows = [
    {at: 392, icon: "heart", avatar: AVATAR_SAHIL, title: "Sahil Bloom liked your reply", sub: "Small creators: replying is the way to grow on X."},
    {at: 420, icon: "users", avatar: AVATAR_JUSTIN, title: "27 people followed you", sub: "Your replies are getting noticed"},
    {at: 448, icon: "views", avatar: USER_AVATAR, title: "Your profile was visited 184 times", sub: "Account activity · This week"},
  ];
  return (
    <main className="x-center native-notifications">
      <Header title="Notifications" />
      <div className="tabs"><b>All</b><span>Mentions</span></div>
      {rows.map((row) => {
        const p = pop(frame, row.at);
        return (
          <div className="notification-row story-notification" key={row.at} style={{opacity: p, transform: `translateY(${(1-p)*18}px)`}}>
            <span className={row.icon === "heart" ? "pink" : "blue"}>
              <Icon name={row.icon} size={31} fill={row.icon === "heart" ? C.pink : "none"} />
            </span>
            <Avatar src={row.avatar} size={42} />
            <div><p><b>{row.title}</b></p><small>{row.sub}</small></div>
            <time>now</time>
          </div>
        );
      })}
    </main>
  );
};

const replyData = [
  {avatar: AVATAR_JUSTIN, author: "Justin Welsh", handle: "@thejustinwelsh", text: "A clear point of view compounds when you keep showing up.", reply: "Consistency makes your point of view familiar. Familiarity is what turns attention into trust."},
  {avatar: AVATAR_SAHIL, author: "Sahil Bloom", handle: "@SahilBloom", text: "Consistency looks ordinary until the results become impossible to ignore.", reply: "The visible result is dramatic. The habit behind it is usually boring: show up, contribute, repeat."},
  {avatar: AVATAR_JUSTIN, author: "Justin Welsh", handle: "@thejustinwelsh", text: "Build a deep network. Engage regularly. Nothing fancy. All meaningful.", reply: "A network compounds one useful conversation at a time. The replies are the work."},
  {avatar: AVATAR_SAHIL, author: "Sahil Bloom", handle: "@SahilBloom", text: "Do the small useful thing again tomorrow.", reply: "Small useful actions look ordinary because their payoff arrives later—and all at once."},
  {avatar: AVATAR_JUSTIN, author: "Justin Welsh", handle: "@thejustinwelsh", text: "The best distribution starts inside existing conversations.", reply: "Distribution starts when your idea improves a conversation people already care about."},
  {avatar: AVATAR_SAHIL, author: "Sahil Bloom", handle: "@SahilBloom", text: "Momentum comes from shortening the gap between intention and action.", reply: "The smaller the gap, the less room doubt has to turn into delay."},
  {avatar: AVATAR_JUSTIN, author: "Justin Welsh", handle: "@thejustinwelsh", text: "Attention is rented. Trust is earned through repeated proof.", reply: "Every useful reply is a tiny proof of work people can discover in public."},
  {avatar: AVATAR_SAHIL, author: "Sahil Bloom", handle: "@SahilBloom", text: "Your calendar reveals what your goals cannot.", reply: "Consistency becomes real when the work has a recurring place on the calendar."},
  {avatar: AVATAR_JUSTIN, author: "Justin Welsh", handle: "@thejustinwelsh", text: "Do the work in public long enough and the right people find you.", reply: "Public work compounds because every conversation leaves another door open."},
];

const RepliesCenter = ({ frame }: { frame: number }) => {
  const scroll = cl(frame, 480, 624, 20, -820);
  return (
    <main className="x-center replies-center">
      <Header title="For you" />
      <div className="replies-feed" style={{transform: `translateY(${scroll}px)`}}>
        {replyData.map((item, i) => (
          <div className="reply-thread-block" key={item.text}>
            <Post {...item} replies={`${38+i*9}`} reposts={`${21+i*4}`} likes={`${640+i*311}`} views={`${18+i*23}K`} />
            <div className="native-replied-row">
              <Avatar src={USER_AVATAR} size={42} />
              <div><b>Ujjwal Mathur</b><span>@ujjwalmathur03 · You replied ✓</span><p>{item.reply}</p></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

const ReplyStack = ({ frame }: { frame: number }) => {
  const positions = [
    [-310,-245,-2],[310,-245,2],
    [-310,0,1],[310,0,-1],
    [-310,245,-2],[310,245,2],
  ];
  return (
    <div className="reply-stack">
      {replyData.slice(0,6).map((item, i) => {
        const p = pop(frame, 486 + i*18);
        const [x,y,r] = positions[i];
        return (
          <div className="stack-reply" key={item.text}
            style={{opacity: p*(1-cl(frame,610,620)), transform: `translate(-50%,-50%) translate(${x}px,${y+(1-p)*24}px) rotate(${r}deg)`}}>
            <Avatar src={USER_AVATAR} size={42} />
            <div><b>Ujjwal Mathur</b><span>@ujjwalmathur03 · You replied ✓</span><p>{item.reply}</p></div>
          </div>
        );
      })}
    </div>
  );
};

const AnalyticsCenter = () => (
  <main className="x-center analytics-center">
    <Header title="Account analytics" />
    <div className="analytics-range">Last 30 days</div>
    <section className="analytics-card"><span>Impressions</span><strong>2.7M</strong><small>↑ 418% from previous period</small></section>
    <div className="analytics-bars">{Array.from({length:24},(_,i)=><i key={i} style={{height:`${25+((i*37)%72)}%`}} />)}</div>
  </main>
);

const ConsistencyCenter = () => (
  <main className="x-center final-notification-center consistency-center">
    <Header title="Notifications" />
    <div className="tabs"><b>All</b><span>Mentions</span></div>
    <div className="consistency-native-notice" style={{transform:"scale(1.12)"}}>
      <span className="blue"><XLogo size={44} /></span>
      <Avatar src={USER_AVATAR} size={58} />
      <div><b>You have been consistent for the last <strong>90 days</strong></b><p>Keep replying. Your momentum is building.</p></div>
    </div>
  </main>
);

const ProfileCenter = ({ frame }: { frame: number }) => {
  const followers = frame < 734 ? "286" : frame < 746 ? "742" : frame < 758 ? "1.8K" : frame < 770 ? "3.2K" : "5.1K";
  return (
    <main className="x-center native-profile">
      <div className="profile-header"><b>Ujjwal Mathur</b><span>214 posts</span></div>
      <div className="profile-banner" />
      <div className="profile-body">
        <Avatar src={USER_AVATAR} size={138} /><button>Edit profile</button>
        <h2>Ujjwal Mathur</h2><span>@ujjwalmathur03</span>
        <p>Building in public. Learning by doing. Sharing what works.</p>
        <div className="profile-counts"><b>184</b><span> Following</span><strong>{followers}</strong><span> Followers</span></div>
      </div>
    </main>
  );
};

const FinalNotificationCenter = () => (
  <main className="x-center final-notification-center">
    <Header title="Notifications" /><div className="tabs"><b>All</b><span>Mentions</span></div>
    <div className="final-native-notice">
      <span className="blue"><Icon name="views" size={46} /></span><Avatar src={USER_AVATAR} size={62} />
      <div><b>Your post got <strong>112K views</strong></b><p>Your post is getting noticed on X.</p></div>
    </div>
  </main>
);

type StoryPlacement = {s:number;x:number;y:number};
const storyCamera = (frame:number): StoryPlacement => {
  const wide={s:.94,x:0,y:0}, justin={s:5.35,x:-96,y:-30}, sahil={s:5.15,x:-96,y:220};
  const reply={s:2.05,x:-82,y:-112}, composer={s:2.45,x:-42,y:245}, thread={s:1.52,x:-58,y:-55};
  const metrics={s:5.2,x:-58,y:-170}, notices={s:2.06,x:-42,y:88}, repeat={s:1.34,x:0,y:0};
  const consistency={s:1.5,x:-55,y:48}, analytics={s:1.75,x:-65,y:50}, profile={s:2.28,x:-70,y:-92}, finalNotice={s:2.35,x:-65,y:60};
  if(frame<30)return wide;
  if(frame<50)return blend(wide,justin,cl(frame,30,50));
  if(frame<88)return blend(justin,wide,cl(frame,68,88));
  if(frame<138)return blend(wide,sahil,cl(frame,112,138));
  if(frame<166)return blend(sahil,reply,cl(frame,152,166));
  if(frame<270)return blend(reply,composer,cl(frame,166,178));
  if(frame<300)return blend(composer,thread,cl(frame,270,300));
  if(frame<390)return blend(thread,metrics,cl(frame,305,350));
  if(frame<410)return blend(metrics,notices,cl(frame,390,404));
  if(frame<480)return notices;
  if(frame<620)return blend(notices,repeat,cl(frame,480,500));
  if(frame<670)return blend(repeat,consistency,cl(frame,620,636));
  if(frame<720)return blend(consistency,analytics,cl(frame,670,684));
  if(frame<780)return blend(analytics,profile,cl(frame,720,734));
  return blend(profile,finalNotice,cl(frame,780,796));
};

const ContinuousXFilm = ({ frame }: { frame:number }) => {
  const active: "home"|"notifications"|"profile" = (frame>=390&&frame<480)||(frame>=620&&frame<670)||frame>=780 ? "notifications" : frame>=720&&frame<780 ? "profile" : "home";
  const c=storyCamera(frame);
  const stackFocus=cl(frame,486,500)*cl(frame,610,620,1,0);
  let center:ReactNode;
  if(frame<270)center=<StoryFeed frame={frame}/>;
  else if(frame<390)center=<PostDetail frame={frame} sent/>;
  else if(frame<480)center=<NativeNotificationsCenter frame={frame}/>;
  else if(frame<620)center=<RepliesCenter frame={frame}/>;
  else if(frame<670)center=<ConsistencyCenter/>;
  else if(frame<720)center=<AnalyticsCenter/>;
  else if(frame<780)center=<ProfileCenter frame={frame}/>;
  else center=<FinalNotificationCenter/>;
  return (
    <AbsoluteFill className="continuous-world">
      <div className="continuous-camera" style={{transform:`scale(${c.s}) translate(${c.x}px,${c.y}px)`}}>
        <div className="x-app" style={{filter:`blur(${stackFocus*6}px) brightness(${1-stackFocus*.7})`,transform:`scale(${1+stackFocus*.018})`}}>
          <Nav active={active}/>{center}<RightRail/>
          {frame>=165&&frame<270&&<ReplyModal frame={frame}/>} 
        </div>
        {frame>=480&&frame<620&&<ReplyStack frame={frame}/>} 
      </div>
    </AbsoluteFill>
  );
};

const EndCard = () => {
  const frame = useCurrentFrame();
  const p = pop(frame, 817);
  const sub = cl(frame, 827, 835);
  return (
    <AbsoluteFill className="end-card">
      <div
        className="end-x"
        style={{ transform: `scale(${0.82 + p * 0.18})`, opacity: p }}
      >
        <div className="axe-mark large">A</div>
        <span>AXE</span>
      </div>
      <h1
        style={{ opacity: sub, transform: `translateY(${(1 - sub) * 18}px)` }}
      >
        Reply your way to growth.
      </h1>
      <p style={{ opacity: cl(frame, 835, 843) }}>
        Find the posts worth replying to. Show up consistently.
      </p>
      <div className="end-url" style={{ opacity: cl(frame, 843, 852) }}>
        axe.oddpages.site
      </div>
    </AbsoluteFill>
  );
};

export const AxeLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  // The narrative order is unchanged; this clock trims only dead time between beats.
  // Both co-founder messages pause the underlying X world for a full two seconds.
  const storyFrame = frame < 36
    ? lin(frame,0,36,0,50)
    : frame < 66
      ? 50
      : frame < 78
        ? lin(frame,66,78,68,88)
        : frame < 138
          ? 88
          : frame < 164
            ? lin(frame,138,164,106,138)
            : frame < 188
              ? 138
              : frame < 208
                ? lin(frame,188,208,138,166)
                : frame < 292
                  ? lin(frame,208,292,166,270)
                  : frame < 304
                    ? lin(frame,292,304,270,300)
                    : frame < 394
                      ? lin(frame,304,394,300,390)
                      : frame < 460
                        ? lin(frame,394,460,390,480)
                        : frame < 544
                          ? lin(frame,460,544,480,620)
                          : frame < 592
                            ? lin(frame,544,592,620,670)
                            : frame < 637
                              ? lin(frame,592,637,670,720)
                              : frame < 682
                                ? lin(frame,637,682,720,780)
                                : frame < 727
                                  ? lin(frame,682,727,780,825)
                : 825;
  const attentionFocus = cl(frame, 36, 42) * cl(frame, 60, 66, 1, 0);
  const useFocus = cl(frame, 164, 170) * cl(frame, 182, 188, 1, 0);
  const thesisFocus = cl(frame, 727, 733) * cl(frame, 751, 757, 1, 0);
  const messageFocus = frame>=78&&frame<138 || frame>=757&&frame<817 ? 1 : 0;
  const textFocus = Math.max(attentionFocus, useFocus, thesisFocus);
  const backgroundFocus = Math.max(textFocus, messageFocus);
  return (
    <AbsoluteFill className="film">
      <div className="stage-focus" style={{filter:`blur(${backgroundFocus*8}px) brightness(${1-backgroundFocus*.74})`,transform:`scale(${1+backgroundFocus*.015})`}}>
        <ContinuousXFilm frame={storyFrame}/>
      </div>
      <Copy at={36} out={66}>ATTENTION IS ALREADY HERE.</Copy>
      <Copy at={164} out={188}>USE IT.</Copy>
      <Copy at={727} out={757}><em>REPLY.</em>&nbsp; BE USEFUL.&nbsp; REPEAT.</Copy>
      {messageFocus>0&&<div className="message-camera">
        {frame>=78&&frame<138&&<XMessageToast frame={frame} at={78} out={138} message="i also wanna get 112K views" />}
        {frame>=757&&frame<817&&<XMessageToast frame={frame} at={757} out={817} message="Yo, 112K views, crazyyyy," />}
      </div>}
      <div
        className="cut-flash"
        style={{
          opacity: cl(frame, 288, 292, 0, 0.16) * cl(frame, 292, 298, 1, 0),
        }}
      />
      {frame >= 817 && <EndCard />}
      <div className="frame-vignette" />
      <div className="progress">
        <i style={{ width: `${frame / 8.76}%` }} />
      </div>
    </AbsoluteFill>
  );
};
