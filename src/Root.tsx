import {Composition, Still} from 'remotion';
import {AxeLaunch} from './AxeLaunch';
import {AxeAttentionTeaser} from './AxeTeaser';
import {creativeComponents} from './AxeCreatives';
import {posterCreativeComponents} from './AxePosterCreatives';

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
    {creativeComponents.map((Creative, index) => (
      <Still
        key={index}
        id={`AxeCreative${String(index + 1).padStart(2, '0')}`}
        component={Creative}
        width={1600}
        height={900}
      />
    ))}
    {posterCreativeComponents.map((Creative, index) => (
      <Still
        key={`poster-${index}`}
        id={`AxePoster${String(index + 1).padStart(2, '0')}`}
        component={Creative}
        width={1600}
        height={900}
      />
    ))}
    </>
  );
};
