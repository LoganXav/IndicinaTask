import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '~/components/globals/tabs';
import { HomeUrlShortenerShortList } from '~/features/home/home-url-shortener-short-list';
import { HomeUrlShortenerEncodeForm } from '~/features/home/home-url-shortener-encode-form';
import { HomeUrlShortenerDecodeForm } from '~/features/home/home-url-shortener-decode-form';
import { HomeUrlShortenerRedirectForm } from '~/features/home/home-url-shortener-redirect-form';
import { HomeUrlShortenerStatisticForm } from '~/features/home/home-url-shortener-statistic-form';

export default function Home() {
  const formTabs = [
    {
      value: 'encode',
      label: 'Encode',
      component: <HomeUrlShortenerEncodeForm />,
    },
    {
      value: 'decode',
      label: 'Decode',
      component: <HomeUrlShortenerDecodeForm />,
    },
    {
      value: 'statistic',
      label: 'Statistic',
      component: <HomeUrlShortenerStatisticForm />,
    },
    {
      value: 'redirect',
      label: 'Redirect',
      component: <HomeUrlShortenerRedirectForm />,
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="min-h-60"></div>

      <Tabs
        defaultValue={formTabs[0].value}
        className="w-full md:w-3/4 mx-auto"
      >
        <TabsList className="flex justify-center mb-8">
          {formTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {formTabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="flex flex-col gap-8"
          >
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>

      <HomeUrlShortenerShortList />
    </div>
  );
}
