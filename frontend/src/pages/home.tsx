import { HomeUrlShortenerForm } from '~/features/home/home-url-shortener-form';
import { HomeUrlShortenerShortList } from '~/features/home/home-url-shortener-short-list';

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <div className="min-h-60"></div>
      <HomeUrlShortenerForm />
      <HomeUrlShortenerShortList />
    </div>
  );
}
