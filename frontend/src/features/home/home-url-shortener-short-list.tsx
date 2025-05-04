import { ArrowRightIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { RouteEnums } from '~/constants/routes';
import { Card } from '~/components/globals/card';
import { Button } from '~/components/globals/button';
import { useGetUrlListQuery } from '~/apis/core-url-api';
import { Typography } from '~/components/globals/typography';
import { LoadingContent } from '~/components/loading-content';

export function HomeUrlShortenerShortList() {
  const navigate = useNavigate();
  const {
    data: urlList,
    isLoading: isLoadingUrlList,
    error: errorUrlList,
    refetch: refetchUrlList,
  } = useGetUrlListQuery();

  return (
    <div className="space-y-2">
      <Typography>Your recent URLs:</Typography>
      <LoadingContent
        loading={isLoadingUrlList}
        error={errorUrlList}
        data={urlList}
        retry={refetchUrlList}
      >
        {urlList != undefined && urlList?.data?.data?.length > 0 ? (
          <Card className="space-y-2 p-4">
            {urlList?.data.data.slice(-3).map((url) => (
              <div
                key={url.id}
                className="flex flex-col md:flex-row items-start md:items-center gap-4"
              >
                <Typography>{url.url}</Typography>
                <Link to={url.shortUrl} color="muted">
                  <Typography
                    color={'muted'}
                    className="hover:text-foreground underline underline-offset-4"
                  >
                    {url.shortUrl}
                  </Typography>
                </Link>
              </div>
            ))}
          </Card>
        ) : (
          <Card className="flex items-center justify-start p-4">
            No links shortened yet.
          </Card>
        )}
      </LoadingContent>

      <Button
        className="underline self-end hover:text-foreground/90"
        variant="link"
        onClick={() => navigate(RouteEnums.LIST)}
      >
        View full list <ArrowRightIcon className="h-3 w-3" />
      </Button>
    </div>
  );
}
