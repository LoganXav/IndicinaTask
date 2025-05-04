import { Card } from '~/components/globals/card';
import { Input } from '~/components/globals/input';
import { toast } from '~/components/globals/toast';
import { Button } from '~/components/globals/button';
import { Tooltip } from '~/components/globals/tooltip';
import { CardContent } from '~/components/globals/card';
import { useCopyToClipboard } from '~/hooks/use-clipboard';
import { Typography } from '~/components/globals/typography';
import { TooltipProvider } from '~/components/globals/tooltip';
import { ClipboardCopyIcon, CheckIcon } from '@radix-ui/react-icons';
import { TooltipContent, TooltipTrigger } from '~/components/globals/tooltip';

export function HomeUrlShortenerClipboard({
  url,
  title,
  placeholder,
}: {
  url?: string;
  title: string;
  placeholder: string;
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const handleCopy = async () => {
    if (!url) return;

    const success = await copyToClipboard(url);

    if (success) {
      toast.success('URL copied to clipboard!');
    } else {
      toast.error('Failed to copy URL');
    }
  };

  return (
    <Card>
      <Typography className="px-4 pt-4">{title}</Typography>
      <CardContent className="flex items-center gap-2 px-8">
        <Input
          value={url || ''}
          disabled={!url}
          readOnly
          className="text-sm cursor-pointer"
          onClick={handleCopy}
          placeholder={placeholder}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
                disabled={!url}
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
  );
}
