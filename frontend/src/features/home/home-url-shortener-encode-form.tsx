import { z } from 'zod';
import { useState } from 'react';
import { UrlType } from '~/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/globals/form';
import { useForm } from 'react-hook-form';
import { toast } from '~/components/globals/toast';
import { Input } from '~/components/globals/input';
import { Button } from '~/components/globals/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUrlEncodeMutation } from '~/apis/core-url-api';
import { UrlShortenerEncodeSchema } from '~/features/home/home-url-shortener-schema';
import { HomeUrlShortenerClipboard } from '~/features/home/home-url-shortener-clipboard';

export function HomeUrlShortenerEncodeForm() {
  const [urlEntry, setUrlEntry] = useState<UrlType | null>(null);

  const { urlEncode, urlEncodePending } = useUrlEncodeMutation();

  const defaultValues = {
    url: '',
  };

  const form = useForm<z.infer<typeof UrlShortenerEncodeSchema>>({
    resolver: zodResolver(UrlShortenerEncodeSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const handle = (data: z.infer<typeof UrlShortenerEncodeSchema>) => {
    urlEncode(
      { payload: { url: data.url } },
      {
        onSuccess: (result) => {
          toast.success(result.data.message);
          setUrlEntry(result.data.data);
          form.reset({ ...defaultValues });
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
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
            name={'url'}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={'Type a URL here to encode...'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="col-span-2 w-full" loading={urlEncodePending}>
            Shorten URL
          </Button>
        </form>
      </Form>

      <HomeUrlShortenerClipboard
        url={urlEntry?.shortUrl}
        title="Your encoded URL"
        placeholder="https://short.url/..."
      />
    </>
  );
}
