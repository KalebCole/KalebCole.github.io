export interface PinnedRepo {
  name: string;
  description: string | null;
  url: string;
  primaryLanguage: { name: string } | null;
}

export type PinnedReposResult =
  | { status: 'ready'; repos: PinnedRepo[] }
  | { status: 'unavailable'; repos: [] };

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

export async function getPinnedRepos(): Promise<PinnedReposResult> {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    console.warn('[github] GITHUB_TOKEN missing: pinned repos are unavailable.');
    return { status: 'unavailable', repos: [] };
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
      console.warn(`[github] HTTP ${res.status}: pinned repos are unavailable.`);
      return { status: 'unavailable', repos: [] };
    }
    const json = (await res.json()) as {
      data?: { user?: { pinnedItems?: { nodes?: PinnedRepo[] } } };
      errors?: unknown;
    };
    if (json.errors) {
      console.warn('[github] GraphQL errors: pinned repos are unavailable.', json.errors);
      return { status: 'unavailable', repos: [] };
    }
    return {
      status: 'ready',
      repos: json.data?.user?.pinnedItems?.nodes ?? [],
    };
  } catch (err) {
    console.warn('[github] fetch failed: pinned repos are unavailable.', err);
    return { status: 'unavailable', repos: [] };
  }
}
