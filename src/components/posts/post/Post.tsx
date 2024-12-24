import {
  ActionIcon,
  Avatar,
  Card,
  Center,
  Group,
  Image,
  Skeleton,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { IconBookmark, IconHeart, IconShare } from '@tabler/icons-react';

import { PostsItem } from '@/pages/api/posts';

type Props = {
  data: PostsItem;
};

export default function Post({ data }: Props) {
  const linkProps = {
    href: 'https://mantine.dev',
    target: '_blank',
    rel: 'noopener noreferrer',
  };

  const theme = useMantineTheme();

  return (
    <Card withBorder={false} radius="md" p={0}>
      {data.image && (
        <Card.Section mb={'md'}>
          <a {...linkProps}>
            <Image
              // component={NextImage}
              src={data.image}
              height={180}
              alt="Thumbnail"
            />
          </a>
        </Card.Section>
      )}

      {data.title && (
        <Text fw={500} component="a" {...linkProps} mb={'xs'}>
          {data.title}
        </Text>
      )}

      <Text fz="sm" c="dimmed" lineClamp={4}>
        {data.content}
      </Text>

      <Group justify="space-between" mt={'xs'}>
        <Center>
          <Avatar src={data.author.image} size={24} radius="xl" mr="xs" />
          <Text fz="sm" inline>
            {data.author.nickname}
          </Text>
        </Center>

        <Group gap={8} mr={0}>
          <ActionIcon variant="transparent">
            <IconHeart size={16} color={theme.colors.red[6]} />
          </ActionIcon>
          <ActionIcon variant="transparent">
            <IconBookmark size={16} color={theme.colors.yellow[7]} />
          </ActionIcon>
          <ActionIcon variant="transparent">
            <IconShare size={16} color={theme.colors.blue[6]} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}

function PostSkeleton() {
  const theme = useMantineTheme();

  return (
    <Card withBorder={false} radius="md" p={0}>
      <Card.Section mb={'md'}>
        <Skeleton height={180} />
      </Card.Section>
      <Skeleton fw={500} height={20} mb={'xs'} width="60%" />

      <Skeleton fz="sm" c="dimmed" height={16} mb={8} />
      <Skeleton fz="sm" c="dimmed" height={16} mb={8} width={'40%'} />

      <Group justify="space-between" mt={'xs'}>
        <Center>
          <Skeleton radius="xl" height={24} mr="xs" circle />
          <Skeleton fz="sm" height={16} width={100} />
        </Center>
        <Group gap={8} mr={0}>
          <ActionIcon variant="transparent">
            <IconHeart size={16} color={theme.colors.red[6]} />
          </ActionIcon>
          <ActionIcon variant="transparent">
            <IconBookmark size={16} color={theme.colors.yellow[7]} />
          </ActionIcon>
          <ActionIcon variant="transparent">
            <IconShare size={16} color={theme.colors.blue[6]} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}

Post.Skeleton = PostSkeleton;
