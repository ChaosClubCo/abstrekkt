import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import type { EmailTemplateKey, UpdateTemplateInput } from '../types';

export function useEmailTemplates() {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: api.getTemplates,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      key,
      input,
      locale,
    }: {
      key: EmailTemplateKey;
      input: UpdateTemplateInput;
      locale?: string;
    }) => api.updateTemplate(key, input, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    },
  });

  const resetMutation = useMutation({
    mutationFn: api.resetTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
    },
  });

  return {
    templates,
    isLoading,
    updateTemplate: updateMutation.mutateAsync,
    resetTemplate: resetMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

export function useEmailTemplate(key: EmailTemplateKey, locale?: string) {
  return useQuery({
    queryKey: ['emailTemplate', key, locale],
    queryFn: () => api.getTemplate(key, locale),
  });
}

export function useEmailPreview(key: EmailTemplateKey, variables: Record<string, unknown>) {
  return useQuery({
    queryKey: ['emailPreview', key, variables],
    queryFn: () => api.previewTemplate(key, variables),
    enabled: Object.keys(variables).length > 0,
  });
}

export function useSendEmail() {
  const mutation = useMutation({
    mutationFn: api.sendEmail,
  });

  return {
    send: mutation.mutateAsync,
    isSending: mutation.isPending,
    error: mutation.error,
  };
}

export function useSendTestEmail() {
  const mutation = useMutation({
    mutationFn: ({ key, to }: { key: EmailTemplateKey; to: string }) =>
      api.sendTestEmail(key, to),
  });

  return {
    sendTest: mutation.mutateAsync,
    isSending: mutation.isPending,
    result: mutation.data,
  };
}
