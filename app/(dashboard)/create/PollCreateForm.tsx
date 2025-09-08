'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPoll } from '@/app/lib/actions/poll-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const pollFormSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  options: z
    .array(z.object({ value: z.string().min(1, 'Option is required') }))
    .min(2, 'At least two options are required'),
  expires_at: z.date().optional(),
});

export default function PollCreateForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof pollFormSchema>>({
    resolver: zodResolver(pollFormSchema),
    defaultValues: {
      question: '',
      options: [{ value: '' }, { value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const onSubmit = async (data: z.infer<typeof pollFormSchema>) => {
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('question', data.question);
    data.options.forEach((option) => {
      formData.append('options', option.value);
    });

    if (data.expires_at) {
      formData.append('expires_at', data.expires_at.toISOString());
    }

    const res = await createPoll(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/polls';
      }, 1200);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-md mx-auto"
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poll Question</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Label>Options</Label>
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`options.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2 mb-2">
                      <Input {...field} />
                      {fields.length > 2 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ value: '' })}
          >
            Add Option
          </Button>
        </div>

        <FormField
          control={form.control}
          name="expires_at"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiration Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className="text-red-500">{error}</div>}
        {success && (
          <div className="text-green-600">Poll created! Redirecting...</div>
        )}
        <Button type="submit">Create Poll</Button>
      </form>
    </Form>
  );
}
 