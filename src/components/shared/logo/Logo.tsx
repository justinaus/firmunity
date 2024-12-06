import { clsx } from 'clsx';
import { Fredoka } from 'next/font/google';

const fredoka = Fredoka({ subsets: ['latin'], weight: '700' });

export default function Logo() {
  return <div className={clsx(fredoka.className, 'logo')}>firmunity</div>;
}
