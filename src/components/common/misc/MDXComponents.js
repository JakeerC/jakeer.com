import Image from 'next/image';
import CustomCode, { Pre } from '../dataDisplay/CustomCode';
import TechIcons from '../dataDisplay/TechIcons';
import CustomLink from '../links/CustomLink';
import CloudinaryImg from '../media/CloudinaryImg';
import SplitImage, { Split } from '../media/SplitImage';
import GithubCard from '../surfaces/GithubCard';
import TweetCard from '../surfaces/TweetCard';

const MDXComponents = {
  a: CustomLink,
  Image,
  pre: Pre,
  code: CustomCode,
  CloudinaryImg,
  SplitImage,
  Split,
  TechIcons,
  TweetCard,
  GithubCard,
};

export default MDXComponents;
