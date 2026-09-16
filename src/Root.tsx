import {Composition} from 'remotion';
import {AxeLaunch} from './AxeLaunch';
import {AxeAttentionTeaser} from './AxeTeaser';

export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
      id="AxeLaunch"
      component={AxeLaunch}
      durationInFrames={877}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="AxeAttentionTeaser"
      component={AxeAttentionTeaser}
      durationInFrames={174}
      fps={30}
      width={1920}
      height={1080}
    />
    </>
  );
};
