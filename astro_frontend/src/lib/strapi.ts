import type { StrapiResponse } from '../interfaces/article';

interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  const url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const res = await fetch(url.toString());
  const response = await res.json() as StrapiResponse<T>;

  // Transform the response to match the expected format
  const transformedData = response.data.map(item => ({
    id: item.id,
    ...item.attributes
  }));

  return (wrappedByList ? transformedData[0] : transformedData) as T;
}
