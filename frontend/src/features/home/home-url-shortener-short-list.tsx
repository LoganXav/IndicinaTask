import { ArrowRightIcon } from 'lucide-react';
import { Card } from '~/components/globals/card';
import { Button } from '~/components/globals/button';
import { useGetUrlListQuery } from '~/apis/core-url-api';
import { Typography } from '~/components/globals/typography';
import { LoadingContent } from '~/components/loading-content';
import { Tooltip } from '~/components/globals/tooltip';
import { TooltipTrigger } from '~/components/globals/tooltip';
import { TooltipContent } from '~/components/globals/tooltip';
import { TooltipProvider } from '~/components/globals/tooltip';

export function HomeUrlShortenerShortList() {
  const {
    data: urlList,
    isLoading: isLoadingUrlList,
    error: errorUrlList,
    refetch: refetchUrlList,
  } = useGetUrlListQuery();

  return (
    <div className="space-y-2">
      <LoadingContent
        loading={isLoadingUrlList}
        error={errorUrlList}
        data={urlList}
        retry={refetchUrlList}
      >
        <Card className="space-y-4 p-8">
          {urlList?.data.data.slice(-3).map((url) => (
            <div
              key={url.id}
              className="flex flex-col md:flex-row items-start md:items-center gap-4"
            >
              <Typography>{url.url}</Typography>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Typography
                        className="underline underline-offset-4"
                        color="muted"
                      >
                        {url.shortUrl}
                      </Typography>
                    </TooltipTrigger>
                    <TooltipContent>
                      <Typography color="muted" size="small">
                        Copy to clipboard
                      </Typography>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </Card>
      </LoadingContent>

      <Button className="underline self-end" variant="link">
        View full list <ArrowRightIcon className="h-3 w-3" />
      </Button>
    </div>
  );
}
