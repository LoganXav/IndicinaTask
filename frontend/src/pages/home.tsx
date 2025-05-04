import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '~/components/globals/tabs';
import { ScrollArea, ScrollBar } from '~/components/globals/scroll-area';
import { HomeUrlShortenerShortList } from '~/features/home/home-url-shortener-short-list';
import { HomeUrlShortenerEncodeForm } from '~/features/home/home-url-shortener-encode-form';
import { HomeUrlShortenerDecodeForm } from '~/features/home/home-url-shortener-decode-form';
import { HomeUrlShortenerRedirectForm } from '~/features/home/home-url-shortener-redirect-form';
import { HomeUrlShortenerStatisticForm } from '~/features/home/home-url-shortener-statistic-form';
import { Typography } from '~/components/globals/typography';

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
      label: 'Statistics',
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
      <div className="min-h-52 flex items-center justify-center">
        <div className="text-center">
          <Typography className="font-display" size={'h1'} weight={'bold'}>
            Short<span className="text-blue-500">Link</span>
          </Typography>
          <Typography>
            Transform long URLs into memorable links in seconds
          </Typography>
        </div>
      </div>

      <Tabs
        defaultValue={formTabs[0].value}
        className="w-full md:w-3/4 mx-auto"
      >
        <ScrollArea>
          <div className="w-full relative h-14">
            <TabsList className="flex absolute">
              {formTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
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
