type JsonLdProps = {
  data: unknown;
};

/**
 * Server-side JSON-LD script. Content is JSON.stringify'd and `<`-escaped
 * so the payload cannot break out of the script element.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json">{json}</script>;
}
