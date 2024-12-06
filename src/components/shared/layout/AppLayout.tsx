type Props = Pick<React.ComponentProps<'div'>, 'className' | 'children'>;

export default function AppLayout({ ...rest }: Props) {
  return <div {...rest} />;
}
