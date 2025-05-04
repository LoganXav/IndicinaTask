import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '~/components/globals/tabs';
import { Typography } from '~/components/globals/typography';
import { ScrollArea, ScrollBar } from '~/components/globals/scroll-area';
import { HomeUrlShortenerShortList } from '~/features/home/home-url-shortener-short-list';
import { HomeUrlShortenerEncodeForm } from '~/features/home/home-url-shortener-encode-form';
import { HomeUrlShortenerDecodeForm } from '~/features/home/home-url-shortener-decode-form';
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
      label: 'Statistics',
      component: <HomeUrlShortenerStatisticForm />,
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
            Transform long URLs into memorable links in seconds.
          </Typography>
        </div>
      </div>

      <div className="w-full md:w-3/4 mx-auto space-y-8">
        <Tabs defaultValue={formTabs[0].value}>
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
              className="flex flex-col gap-8 p-0 mt-0"
            >
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>

        <HomeUrlShortenerShortList />
      </div>
    </div>
  );
}
