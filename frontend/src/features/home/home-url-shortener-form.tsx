import { z } from 'zod';
import { RouteEnums } from '~/constants/routes';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/globals/form';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from '~/components/globals/toast';
import { Input } from '~/components/globals/input';
import { Button } from '~/components/globals/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useUrlEncodeMutation } from '~/apis/core-url-api';
import { UrlEncodeSchema } from './home-url-shortener-schema';

export function HomeUrlShortenerForm() {
  const navigate = useNavigate();

  const { urlEncode, urlEncodePending } = useUrlEncodeMutation();

  const defaultValues = {
    url: '',
  };

  const form = useForm<z.infer<typeof UrlEncodeSchema>>({
    resolver: zodResolver(UrlEncodeSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const handleEncode = (data: z.infer<typeof UrlEncodeSchema>) => {
    urlEncode(
      {
        payload: { ...data },
      },
      {
        onSuccess: (result) => {
          toast.success(result.data.message);
          form.reset();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleEncode)}
        className="space-y-4 w-3/4 mx-auto"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Shorten your link" {...field} />
              </FormControl>
              <FormMessage className="text-blue-500" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <Button className="col-span-2" loading={urlEncodePending}>
            Shorten URL
          </Button>
          <Button
            className="col-span-1"
            variant={'outline'}
            onClick={() => navigate(RouteEnums.LIST)}
          >
            View all links <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
