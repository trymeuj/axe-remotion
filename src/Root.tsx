import {Composition} from 'remotion';
import {AxeLaunch} from './AxeLaunch';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AxeLaunch"
      component={AxeLaunch}
      durationInFrames={755}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
