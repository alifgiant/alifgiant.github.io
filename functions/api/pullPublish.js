/**
 * POST /api/pullPublish
 * Triggers a GitHub Action workflow dispatch.
 * 
 * @param {object} context - The context object containing request and env.
 * @returns {Response}
 */
export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
        return new Response('Missing token parameter', { status: 400 });
    }

    try {
        const response = await fetch(
            'https://api.github.com/repos/alifgiant/alifgiant.github.io/actions/workflows/build-site.yml/dispatches',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `Bearer ${token}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                    'User-Agent': 'Cloudflare-Pages-Function'
                },
                body: JSON.stringify({
                    ref: 'master' // Adjust if your production branch is different
                })
            }
        );

        if (response.ok) {
            return new Response('Workflow triggered successfully', { status: 200 });
        } else {
            const errorText = await response.text();
            return new Response(`Failed to trigger workflow: ${errorText}`, { status: response.status });
        }
    } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}
