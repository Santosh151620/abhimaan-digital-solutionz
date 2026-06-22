export default function GoogleMap() {
  return (
    <iframe
      src={process.env.NEXT_PUBLIC_GOOGLE_MAP_EMBED_URL}
      width="100%"
      height="450"
      loading="lazy"
    />
  );
}