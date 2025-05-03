import { ArrowRightIcon } from 'lucide-react';
import { Card } from '~/components/globals/card';
import { Button } from '~/components/globals/button';
import { useGetUrlListQuery } from '~/apis/core-url-api';
import { Typography } from '~/components/globals/typography';
import { LoadingContent } from '~/components/loading-content';

export function HomeUrlShortenerShortList() {
  const {
    data: urlList,
    isLoading: isLoadingUrlList,
    error: errorUrlList,
    refetch: refetchUrlList,
  } = useGetUrlListQuery();

  return (
    <>
      <LoadingContent
        loading={isLoadingUrlList}
        error={errorUrlList}
        data={urlList}
        retry={refetchUrlList}
      >
        <Card className="space-y-4 p-4">
          {urlList?.data.data.slice(0, 3).map((url) => (
            <div key={url.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Typography>{url.id}.</Typography>
                <Typography>{url.url}</Typography>
              </div>
              <Typography color="muted">{url.shortUrl}</Typography>
            </div>
          ))}
        </Card>
      </LoadingContent>

      <Button className="underline justify-end" variant="link">
        View full list <ArrowRightIcon className="h-3 w-3" />
      </Button>
    </>
  );
}
