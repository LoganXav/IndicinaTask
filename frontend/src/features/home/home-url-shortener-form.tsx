import { z } from 'zod';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/globals/form';
import { ActionPayload, ActionType } from '~/types';
import { useForm } from 'react-hook-form';
import { toast } from '~/components/globals/toast';
import { Input } from '~/components/globals/input';
import { Button } from '~/components/globals/button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useUrlDecodeMutation,
  useUrlEncodeMutation,
} from '~/apis/core-url-api';
import {
  UrlShortenerSchema,
  UrlShortenerRequestType,
} from './home-url-shortener-schema';
import { Card, CardContent } from '~/components/globals/card';
import { ClipboardCopyIcon, CheckIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/globals/tooltip';
import { Typography } from '~/components/globals/typography';
import { useCopyToClipboard } from '~/hooks/use-clipboard';

export function HomeUrlShortenerForm() {
  const [urlEntry, setUrlEntry] = useState<UrlShortenerRequestType | null>(
    null
  );
  const [mode, setMode] = useState<ActionType>('encode');
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const { urlEncode, urlEncodePending } = useUrlEncodeMutation();
  const { urlDecode, urlDecodePending } = useUrlDecodeMutation();

  const defaultValues = {
    action: mode,
    url: '',
    shortUrl: '',
  };

  const form = useForm<z.infer<typeof UrlShortenerSchema>>({
    resolver: zodResolver(UrlShortenerSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const handleCopy = async () => {
    if (!urlEntry) return;

    const textToCopy =
      urlEntry.action === 'encode' ? urlEntry.shortUrl! : urlEntry.url!;
    const success = await copyToClipboard(textToCopy);

    if (success) {
      toast.success('URL copied to clipboard!');
    } else {
      toast.error('Failed to copy URL');
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    form.reset({ ...defaultValues, action: newMode });
  };

  const handle = (data: z.infer<typeof UrlShortenerSchema>) => {
    if (!data.url && data.action === 'encode') {
      toast.error('URL is required for encoding');
      return;
    }
    if (!data.shortUrl && data.action === 'decode') {
      toast.error('Short URL is required for decoding');
      return;
    }

    const payload: ActionPayload =
      data.action === 'encode'
        ? { action: 'encode', url: data.url! }
        : { action: 'decode', shortUrl: data.shortUrl! };

    const mutate = data.action === 'encode' ? urlEncode : urlDecode;

    mutate(
      { payload },
      {
        onSuccess: (result) => {
          toast.success(result.data.message);
          setUrlEntry(result.data.data);
          form.reset({ ...defaultValues, action: mode });
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
          className="space-y-4 w-3/4 mx-auto"
        >
          <FormField
            control={form.control}
            name={mode === 'encode' ? 'url' : 'shortUrl'}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={
                      mode === 'encode'
                        ? 'Type a URL here to encode...'
                        : 'Enter a short URL to decode...'
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <Button
              className="col-span-2"
              loading={mode === 'encode' ? urlEncodePending : urlDecodePending}
            >
              {mode === 'encode' ? 'Shorten URL' : 'Decode URL'}
            </Button>
            <Button
              className="col-span-1"
              variant={'outline'}
              type="button"
              onClick={toggleMode}
            >
              Switch to {mode === 'encode' ? 'decode' : 'encode'}
            </Button>
          </div>
        </form>
      </Form>

      <Card className="w-3/4 mx-auto">
        <Typography className="px-4 pt-4">
          {mode === 'encode' ? 'Your encoded URL' : 'Original URL'}
        </Typography>
        <CardContent className="flex items-center gap-2 px-8">
          <Input
            value={
              urlEntry?.action === mode
                ? mode === 'encode'
                  ? urlEntry.shortUrl
                  : urlEntry.url
                : ''
            }
            disabled={!urlEntry || urlEntry.action !== mode}
            readOnly
            className="text-sm cursor-pointer"
            onClick={handleCopy}
            placeholder={
              mode === 'encode'
                ? 'https://short.url/...'
                : 'https://original-url.com/...'
            }
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0"
                  disabled={!urlEntry || urlEntry.action !== mode}
                >
                  {isCopied ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ClipboardCopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <Typography color="muted" size="small">
                  {isCopied ? 'Copied!' : 'Copy URL'}
                </Typography>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
    </>
  );
}
