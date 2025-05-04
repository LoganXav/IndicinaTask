import { z } from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/globals/form';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { Card } from '~/components/globals/card';
import { Input } from '~/components/globals/input';
import { Button } from '~/components/globals/button';
import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from '~/components/globals/typography';
import { LoadingContent } from '~/components/loading-content';
import { useGetUrlStatisticsQuery } from '~/apis/core-url-api';
import { UrlStatisticSchema } from '~/features/home/home-url-shortener-schema';

export function HomeUrlShortenerStatisticForm() {
  const [path, setPath] = useState<string>('');

  const {
    data: urlStatistics,
    isLoading: urlStatisticsPending,
    error: urlStatisticsError,
    refetch: refetchUrlStatistics,
  } = useGetUrlStatisticsQuery(
    useMemo(
      () => ({
        path: { urlPath: path },
      }),
      [path]
    )
  );

  useEffect(() => {
    if (urlStatistics) {
      toast.success(urlStatistics.data.message);
    } else if (urlStatisticsError) {
      toast.error(urlStatisticsError.message);
    }
  }, [urlStatistics, urlStatisticsError, path]);

  const defaultValues = {
    path: '',
  };

  const form = useForm<z.infer<typeof UrlStatisticSchema>>({
    resolver: zodResolver(UrlStatisticSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const handle = async (data: z.infer<typeof UrlStatisticSchema>) => {
    setPath(data.path);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handle)}
          className="space-y-4 w-full mx-auto"
        >
          <FormField
            control={form.control}
            name={'path'}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={'Enter URL path to view statistics...'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="col-span-2 w-full" loading={urlStatisticsPending}>
            View Statistics
          </Button>
        </form>
      </Form>

      <LoadingContent
        data={urlStatistics}
        loading={urlStatisticsPending}
        error={urlStatisticsError}
        retry={refetchUrlStatistics}
        shouldLoad={false}
      >
        <Card className="mt-4 p-4">
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <Typography>Original URL:</Typography>
              <Typography color="muted">
                {urlStatistics?.data?.data?.url || '-'}
              </Typography>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <Typography>Short URL:</Typography>
              <Typography color="muted">
                {urlStatistics?.data?.data?.shortUrl || '-'}
              </Typography>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <Typography>Visit Count:</Typography>
              <Typography color="muted">
                {urlStatistics?.data?.data?.visitCount || '-'}
              </Typography>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <Typography>Created At:</Typography>
              <Typography color="muted">
                {urlStatistics?.data?.data?.createdAt
                  ? format(
                      new Date(urlStatistics?.data?.data?.createdAt),
                      'PPpp'
                    )
                  : '-'}
              </Typography>
            </div>
          </div>
        </Card>
      </LoadingContent>
    </>
  );
}
