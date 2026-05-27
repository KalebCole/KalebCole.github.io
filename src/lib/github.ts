export interface PinnedRepo {
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: { name: string } | null;
}

const QUERY = `{
  user(login: "KalebCole") {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          url
          primaryLanguage { name }
        }
      }
    }
  }
}`;

export async function getPinnedRepos(): Promise<PinnedRepo[]> {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    console.warn('[github] GITHUB_TOKEN missing — pinned repos will be empty.');
    return [];
  }
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'kalebcole.github.io build',
      },
      body: JSON.stringify({ query: QUERY }),
    });
    if (!res.ok) {
      console.warn(`[github] HTTP ${res.status} — pinned repos will be empty.`);
      return [];
    }
    const json = (await res.json()) as {
      data?: { user?: { pinnedItems?: { nodes?: PinnedRepo[] } } };
      errors?: unknown;
    };
    if (json.errors) {
      console.warn('[github] GraphQL errors — pinned repos will be empty.', json.errors);
      return [];
    }
    return json.data?.user?.pinnedItems?.nodes ?? [];
  } catch (err) {
    console.warn('[github] fetch failed — pinned repos will be empty.', err);
    return [];
  }
}
