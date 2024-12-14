import {
  ActionIcon,
  Avatar,
  Card,
  Center,
  Group,
  Image,
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
