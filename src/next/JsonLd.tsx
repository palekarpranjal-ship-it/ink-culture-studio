export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return <>{blocks.map((block) => <script key={JSON.stringify(block)} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />)}</>;
}
