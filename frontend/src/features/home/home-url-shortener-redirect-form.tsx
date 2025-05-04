import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/globals/form';

import { useForm } from 'react-hook-form';
import { BACKEND_URL } from '~/config/http';
import {
  UrlShortenerRedirectRequestType,
  UrlShortenerRedirectSchema,
} from '~/features/home/home-url-shortener-schema';
import { Input } from '~/components/globals/input';
import { useMemo, useState, useEffect } from 'react';
import { Button } from '~/components/globals/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetUrlRedirectQuery } from '~/apis/core-url-api';

export function HomeUrlShortenerRedirectForm() {
  const [path, setPath] = useState<string>('');

  const { data: redirectData, error: redirectError } = useGetUrlRedirectQuery(
    useMemo(
      () => ({
        path: { urlPath: path },
      }),
      [path]
    )
  );

  useEffect(() => {
    if (redirectData) {
      window.location.href = `${BACKEND_URL}/${path}`;
    } else if (redirectError) {
      toast.error(redirectError.message);
    }
  }, [redirectData, redirectError, path]);

  const defaultValues = {
    urlPath: '',
  };

  const form = useForm<UrlShortenerRedirectRequestType>({
    resolver: zodResolver(UrlShortenerRedirectSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const handle = (data: UrlShortenerRedirectRequestType) => {
    setPath(data.urlPath);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handle)}
        className="space-y-4 w-full mx-auto"
      >
        <FormField
          control={form.control}
          name="urlPath"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={'Enter a shortened URL to redirect...'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="col-span-2 w-full">Redirect</Button>
      </form>
    </Form>
  );
}
