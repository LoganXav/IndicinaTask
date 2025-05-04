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
import { useUrlDecodeMutation } from '~/apis/core-url-api';
import { UrlShortenerDecodeSchema } from '~/features/home/home-url-shortener-schema';
import { HomeUrlShortenerClipboard } from '~/features/home/home-url-shortener-clipboard';

export function HomeUrlShortenerDecodeForm() {
  const [urlEntry, setUrlEntry] = useState<UrlType | null>(null);

  const { urlDecode, urlDecodePending } = useUrlDecodeMutation();

  const defaultValues = {
    shortUrl: '',
  };

  const form = useForm<z.infer<typeof UrlShortenerDecodeSchema>>({
    resolver: zodResolver(UrlShortenerDecodeSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const handle = (data: z.infer<typeof UrlShortenerDecodeSchema>) => {
    urlDecode(
      { payload: { shortUrl: data.shortUrl } },
      {
        onSuccess: (result) => {
          toast.success(result.data.message);
          setUrlEntry(result.data.data);
          form.reset({ ...defaultValues });
        },
        onError: (error: { message: string }) => {
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
            name={'shortUrl'}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={'Type a shortened URL here to decode...'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="col-span-2 w-full" loading={urlDecodePending}>
            Decode URL
          </Button>
        </form>
      </Form>

      <HomeUrlShortenerClipboard
        url={urlEntry?.url}
        title="Your decoded URL"
        placeholder="https://original-url.com/..."
      />
    </>
  );
}
