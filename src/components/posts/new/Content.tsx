import {
  ActionIcon,
  Button,
  FileButton,
  Group,
  Image,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPhoto } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { PutBlobResult } from '@vercel/blob';
import { AxiosResponse } from 'axios';
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { axiosInstance } from '@/helpers/axios';
import { PostPostsRequestBody, PostPostsResponse } from '@/pages/api/posts';
import { PostUploadsResponse } from '@/pages/api/uploads';

type FormValues = {
  title: string;
  content: string;
};

export default function PostNewContent() {
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const { mutate: mutateImageFileUpload, isPending: isPendingImageFileUpload } =
    useMutation<AxiosResponse<PostUploadsResponse>, undefined, File>({
      mutationFn: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return axiosInstance.post(
          `/api/uploads?filename=${file.name}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      },
      onSuccess: async (result) => {
        if (!result.data.data) return;

        setBlob(result.data.data);
      },
    });

  const handleFileChange = useCallback(
    async (selectedFile: File | null) => {
      if (!selectedFile?.size) return;

      if (selectedFile.size > MAX_FILE_SIZE) {
        notifications.show({
          color: 'red',
          title: 'File size is too big',
          message: `File size must be less than 5MB`,
        });

        return;
      }

      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(selectedFile, options);
        // console.log(
        //   'compressedFile instanceof Blob',
        //   compressedFile instanceof Blob
        // ); // true
        // console.log(
        //   `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        // ); // smaller than maxSizeMB

        await mutateImageFileUpload(compressedFile); // write your own logic
      } catch (error) {
        console.log(error);
      }
    },
    [mutateImageFileUpload]
  );

  const { push } = useRouter();

  const { mutate: mutatePost, isPending: isPendingPost } = useMutation<
    AxiosResponse<PostPostsResponse>,
    undefined,
    PostPostsRequestBody
  >({
    mutationFn: (values: PostPostsRequestBody) => {
      return axiosInstance.post(`/api/posts`, {
        title: values.title,
        content: values.content,
        image: values.image,
      } as PostPostsRequestBody);
    },
    onSuccess: (result) => {
      // TODO. 에러 처리.
      if (!result.data.data?.success) return;

      push('/posts');
    },
  });

  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      content: '',
    },
    validate: {
      title: (value) =>
        value.trim().length < 2 ? 'Title must have at least 2 letters' : null,
      content: (value) =>
        value.trim().length < 2 ? 'Content must have at least 2 letters' : null,
    },
  });

  const handleFormSubmit = useCallback(
    (values: FormValues) => {
      if (isPendingPost) return;
      if (isPendingImageFileUpload) return;

      mutatePost({
        title: values.title.trim(),
        content: values.content.trim(),
        image: blob?.url,
      });
    },
    [blob?.url, isPendingImageFileUpload, isPendingPost, mutatePost]
  );

  return (
    <Stack>
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Stack gap={'lg'}>
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Add a title"
            key={form.key('title')}
            {...form.getInputProps('title')}
            disabled={isPendingPost || isPendingImageFileUpload}
          />

          <Textarea
            withAsterisk
            label="Content"
            placeholder="Write something..."
            key={form.key('content')}
            {...form.getInputProps('content')}
            autosize
            minRows={4}
            disabled={isPendingPost || isPendingImageFileUpload}
          />
        </Stack>

        <Group justify="space-between" mt="md">
          <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
            {(props) => (
              <ActionIcon size={'lg'} {...props}>
                <IconPhoto size={20} />
              </ActionIcon>
            )}
          </FileButton>
          <Button
            type="submit"
            disabled={isPendingPost || isPendingImageFileUpload}
          >
            Submit
          </Button>
        </Group>
      </form>
      {blob && <Image radius="md" src={blob.url} alt="preview image" />}
    </Stack>
  );
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB를 bytes로 변환
