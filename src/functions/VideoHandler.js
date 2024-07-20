import Clip1 from '../Media/Videos/Main/Clip 1.mp4';
import Clip2 from '../Media/Videos/Main/Clip 2.mp4';
import Clip3 from '../Media/Videos/Main/Clip 3.mp4';
import Clip4 from '../Media/Videos/Main/Clip 4.mp4';
import Clip5 from '../Media/Videos/Main/Clip 5.mp4';
import Clip6 from '../Media/Videos/Main/Clip 6.mp4';
import Clip7 from '../Media/Videos/Main/Clip 7.mp4';
import Clip8 from '../Media/Videos/Main/Clip 8.mp4';
import Clip9 from '../Media/Videos/Main/Clip 9.mp4';
import Clip10 from '../Media/Videos/Main/Clip 10.mp4';
import '../styles/VideoHandler.css';

const videoUrls = [
  Clip1,
  Clip2,
  Clip3,
  Clip4,
  Clip5,
  Clip6,
  Clip7,
  Clip8,
  Clip9,
  Clip10,
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export { videoUrls, shuffleArray };