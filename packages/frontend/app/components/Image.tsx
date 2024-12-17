export default function Image(props: {
  src: string;
  alt?: string;
  width: number;
  height: number;
}) {
  return <div
    title={props.alt}
    style={{
      width: props.width,
      height: props.height,
      background: `url(${props.src}) no-repeat center center`,
      backgroundSize: 'cover',
    }} />;
}
