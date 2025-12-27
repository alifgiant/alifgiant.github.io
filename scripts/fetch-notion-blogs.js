/**
 * Fetch blog posts from Notion API and convert to markdown files
 * 
 * This script:
 * 1. Queries the Notion database for blog pages
 * 2. Fetches page content and converts to markdown
 * 3. Downloads images and saves them locally
 * 4. Creates markdown files with proper frontmatter
 * 
 * Usage:
 *   node scripts/fetch-notion-blogs.js           # Fetch all posts
 *   node scripts/fetch-notion-blogs.js --limit 3 # Fetch only 3 posts (for testing)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = '168c63d498cd40d0b4c1d8cec90cd5a6';
const BLOG_DIR = path.join(__dirname, '..', 'contents', 'blog');
const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images', 'blog');

// Parse command line arguments for limit
const args = process.argv.slice(2);
const limitIndex = args.indexOf('--limit');
const PAGE_LIMIT = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : null;

/**
 * Make HTTPS request to Notion API
 * @param {string} endpoint - API endpoint path
 * @param {string} method - HTTP method (GET, POST)
 * @param {object} body - Request body for POST requests
 * @returns {Promise<object>} - JSON response
 */
function notionRequest(endpoint, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.notion.com',
            path: endpoint,
            method: method,
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode >= 400) {
                        reject(new Error(`Notion API error: ${json.message || JSON.stringify(json)}`));
                    } else {
                        resolve(json);
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${data}`));
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

/**
 * Download an image from URL and save locally
 * @param {string} url - Image URL to download
 * @param {string} filename - Local filename to save as
 * @returns {Promise<string>} - Local path to saved image
 */
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        // Ensure images directory exists
        if (!fs.existsSync(IMAGES_DIR)) {
            fs.mkdirSync(IMAGES_DIR, { recursive: true });
        }

        const localPath = path.join(IMAGES_DIR, filename);
        const relativePath = `/assets/images/blog/${filename}`;

        // Skip if already downloaded
        if (fs.existsSync(localPath)) {
            console.log(`  Image already exists: ${filename}`);
            return resolve(relativePath);
        }

        const urlObj = new URL(url);
        const protocol = urlObj.protocol === 'https:' ? https : require('http');

        const request = (url) => {
            protocol.get(url, (response) => {
                // Handle redirects
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    return request(response.headers.location);
                }

                if (response.statusCode !== 200) {
                    return reject(new Error(`Failed to download image: ${response.statusCode}`));
                }

                const file = fs.createWriteStream(localPath);
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`  Downloaded: ${filename}`);
                    resolve(relativePath);
                });
            }).on('error', reject);
        };

        request(url);
    });
}

/**
 * Extract plain text from Notion rich text array
 * @param {Array} richTextArray - Notion rich text array
 * @returns {string} - Plain text content
 */
function richTextToPlain(richTextArray) {
    if (!richTextArray || !Array.isArray(richTextArray)) return '';
    return richTextArray.map(rt => rt.plain_text || '').join('');
}

/**
 * Convert Notion rich text to markdown with formatting
 * @param {Array} richTextArray - Notion rich text array
 * @returns {string} - Markdown formatted text
 */
function richTextToMarkdown(richTextArray) {
    if (!richTextArray || !Array.isArray(richTextArray)) return '';

    return richTextArray.map(rt => {
        let text = rt.plain_text || '';
        const annotations = rt.annotations || {};

        // Apply formatting
        if (annotations.code) text = `\`${text}\``;
        if (annotations.bold) text = `**${text}**`;
        if (annotations.italic) text = `*${text}*`;
        if (annotations.strikethrough) text = `~~${text}~~`;
        if (annotations.underline) text = `<u>${text}</u>`;

        // Handle links
        if (rt.href) {
            text = `[${text}](${rt.href})`;
        }

        return text;
    }).join('');
}

/**
 * Convert Notion block to markdown
 * @param {object} block - Notion block object
 * @param {string} pageId - Page ID for image naming
 * @param {number} imageCounter - Counter for image naming
 * @returns {Promise<{markdown: string, imageCounter: number}>}
 */
async function blockToMarkdown(block, pageId, imageCounter) {
    const type = block.type;
    const content = block[type];
    let markdown = '';

    switch (type) {
        case 'paragraph':
            markdown = richTextToMarkdown(content?.rich_text) + '\n';
            break;

        case 'heading_1':
            markdown = `# ${richTextToMarkdown(content?.rich_text)}\n`;
            break;

        case 'heading_2':
            markdown = `## ${richTextToMarkdown(content?.rich_text)}\n`;
            break;

        case 'heading_3':
            markdown = `### ${richTextToMarkdown(content?.rich_text)}\n`;
            break;

        case 'bulleted_list_item':
            markdown = `- ${richTextToMarkdown(content?.rich_text)}\n`;
            break;

        case 'numbered_list_item':
            markdown = `1. ${richTextToMarkdown(content?.rich_text)}\n`;
            break;

        case 'to_do':
            const checked = content?.checked ? 'x' : ' ';
            markdown = `- [${checked}] ${richTextToMarkdown(content?.rich_text)}\n`;
            break;

        case 'toggle':
            markdown = `<details>\n<summary>${richTextToMarkdown(content?.rich_text)}</summary>\n\n</details>\n`;
            break;

        case 'quote':
            markdown = `> ${richTextToMarkdown(content?.rich_text)}\n`;
            break;

        case 'callout':
            const emoji = content?.icon?.emoji || '💡';
            markdown = `> ${emoji} ${richTextToMarkdown(content?.rich_text)}\n`;
            break;

        case 'code':
            const language = content?.language || '';
            const code = richTextToPlain(content?.rich_text);
            markdown = `\`\`\`${language}\n${code}\n\`\`\`\n`;
            break;

        case 'divider':
            markdown = '---\n';
            break;

        case 'image':
            try {
                const imageUrl = content?.file?.url || content?.external?.url;
                if (imageUrl) {
                    // Extract file extension from URL or default to jpg
                    const urlPath = new URL(imageUrl).pathname;
                    const ext = path.extname(urlPath) || '.jpg';
                    const filename = `${pageId}-${imageCounter}${ext}`.replace(/[^a-zA-Z0-9.-]/g, '-');

                    const localPath = await downloadImage(imageUrl, filename);
                    const caption = richTextToPlain(content?.caption) || 'Image';
                    markdown = `![${caption}](${localPath})\n`;
                    imageCounter++;
                }
            } catch (error) {
                console.error(`  Failed to download image: ${error.message}`);
            }
            break;

        case 'bookmark':
            const url = content?.url || '';
            const bookmarkCaption = richTextToPlain(content?.caption) || url;
            markdown = `[${bookmarkCaption}](${url})\n`;
            break;

        case 'embed':
            markdown = `[Embedded content](${content?.url})\n`;
            break;

        case 'video':
            const videoUrl = content?.file?.url || content?.external?.url;
            if (videoUrl) {
                markdown = `[Video](${videoUrl})\n`;
            }
            break;

        default:
            // Unsupported block types are skipped
            console.log(`  Skipping unsupported block type: ${type}`);
    }

    return { markdown, imageCounter };
}

/**
 * Fetch all blocks (content) from a Notion page
 * @param {string} pageId - Notion page ID
 * @returns {Promise<string>} - Markdown content
 */
async function fetchPageContent(pageId) {
    let markdown = '';
    let hasMore = true;
    let startCursor = undefined;
    let imageCounter = 1;

    while (hasMore) {
        const endpoint = `/v1/blocks/${pageId}/children${startCursor ? `?start_cursor=${startCursor}` : ''}`;
        const response = await notionRequest(endpoint, 'GET');

        for (const block of response.results) {
            const result = await blockToMarkdown(block, pageId, imageCounter);
            markdown += result.markdown;
            imageCounter = result.imageCounter;

            // Handle nested blocks (children)
            if (block.has_children && block.type !== 'child_page') {
                const childContent = await fetchPageContent(block.id);
                markdown += childContent.split('\n').map(line => '  ' + line).join('\n');
            }
        }

        hasMore = response.has_more;
        startCursor = response.next_cursor;
    }

    return markdown;
}

/**
 * Extract page properties and create frontmatter
 * @param {object} page - Notion page object
 * @returns {object} - Frontmatter properties
 */
function extractProperties(page) {
    const props = page.properties;
    const frontmatter = {};

    // Extract title (usually named "Name" or "Title")
    const titleProp = props.Name || props.Title || props.title;
    if (titleProp?.title) {
        frontmatter.title = richTextToPlain(titleProp.title);
    }

    // Extract date
    const dateProp = props['Created time'] || props.Created || props.Date || props.date;

    if (dateProp?.created_time) {
        frontmatter.date = dateProp.created_time.split('T')[0];
    } else if (dateProp?.date?.start) {
        frontmatter.date = dateProp.date.start.split('T')[0];
    } else {
        frontmatter.date = page.created_time.split('T')[0];
    }

    // Extract tags
    if (props.Tags?.multi_select) {
        frontmatter.tags = props.Tags.multi_select.map(tag => tag.name);
    }

    // Extract featured status
    if (props.Featured?.checkbox !== undefined) {
        frontmatter.featured = props.Featured.checkbox;
    }

    // Extract cover image
    if (page.cover) {
        frontmatter.coverUrl = page.cover.file?.url || page.cover.external?.url;
    }

    return frontmatter;
}

/**
 * Cleanup blog directory by removing all .md files except blog.json
 */
function cleanupBlogDir() {
    console.log(`🧹 Cleaning up ${BLOG_DIR}...`);
    if (!fs.existsSync(BLOG_DIR)) return;

    const files = fs.readdirSync(BLOG_DIR);
    for (const file of files) {
        if (file.endsWith('.md')) {
            fs.unlinkSync(path.join(BLOG_DIR, file));
            console.log(`  🗑️ Deleted: ${file}`);
        }
    }
    console.log('✨ Cleanup complete.\n');
}

/**
 * Calculate read time in minutes
 * @param {string} content - Markdown content
 * @returns {string} - "X min"
 */
function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
}

/**
 * Generate description from content
 * @param {string} content - Markdown content
 * @returns {string} - Plain text description
 */
function generateDescription(content) {
    // Strip markdown formatting roughly
    const plainText = content
        .replace(/[#*`_\[\]()!]/g, '')
        .replace(/\n+/g, ' ')
        .trim();

    if (plainText.length <= 160) return plainText;
    return plainText.substring(0, 157) + '...';
}

/**
 * Generate markdown frontmatter string
 * @param {object} frontmatter - Frontmatter properties
 * @returns {string} - YAML frontmatter
 */
function generateFrontmatter(frontmatter) {
    let yaml = '---\n';

    for (const [key, value] of Object.entries(frontmatter)) {
        if (Array.isArray(value)) {
            yaml += `${key}: ${JSON.stringify(value)}\n`;
        } else if (typeof value === 'boolean') {
            yaml += `${key}: ${value}\n`;
        } else if (typeof value === 'string') {
            // Escape quotes in strings
            yaml += `${key}: "${value.replace(/"/g, '\\"')}"\n`;
        } else {
            yaml += `${key}: ${value}\n`;
        }
    }

    yaml += '---\n\n';
    return yaml;
}

/**
 * Generate a URL-friendly slug from title
 * @param {string} title - Page title
 * @returns {string} - URL-friendly slug
 */
function slugify(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);
}

/**
 * Main function to fetch and process all blog posts
 */
async function main() {
    console.log('🚀 Fetching blog posts from Notion...\n');

    if (PAGE_LIMIT) {
        console.log(`📝 Limiting to ${PAGE_LIMIT} pages for testing\n`);
    }

    // Ensure blog directory exists
    if (!fs.existsSync(BLOG_DIR)) {
        fs.mkdirSync(BLOG_DIR, { recursive: true });
    }

    // CLEANUP: Delete other blog pages
    cleanupBlogDir();

    try {
        // Query the database for all published pages
        const queryBody = {
            page_size: PAGE_LIMIT || 100,
            sorts: [{ timestamp: 'created_time', direction: 'descending' }]
        };

        // Add filter for published posts if Status property exists
        // queryBody.filter = { property: 'Status', select: { equals: 'Published' } };

        const response = await notionRequest(`/v1/databases/${DATABASE_ID}/query`, 'POST', queryBody);

        console.log(`📚 Found ${response.results.length} pages\n`);

        let processed = 0;
        for (const page of response.results) {
            const props = extractProperties(page);
            const title = props.title || 'Untitled';
            const slug = slugify(title);

            console.log(`Processing: ${title}`);

            // Fetch page content
            const content = await fetchPageContent(page.id);

            // AUTOMATIC FIELDS: description and readTime
            props.description = generateDescription(content);
            props.readTime = calculateReadTime(content);

            // Handle cover image download
            if (props.coverUrl) {
                try {
                    const ext = path.extname(new URL(props.coverUrl).pathname) || '.jpg';
                    const coverFilename = `cover-${page.id}${ext}`.replace(/[^a-zA-Z0-9.-]/g, '-');
                    const localCoverPath = await downloadImage(props.coverUrl, coverFilename);
                    props.image = localCoverPath;
                } catch (error) {
                    console.error(`  Failed to download cover: ${error.message}`);
                }
                delete props.coverUrl;
            } else {
                // Use a placeholder if no cover found
                props.image = '/assets/images/placeholder-blog.jpg';
            }

            // Generate full markdown file
            const markdown = generateFrontmatter(props) + content;

            // Save to file
            const filename = `${slug}.md`;
            const filepath = path.join(BLOG_DIR, filename);
            fs.writeFileSync(filepath, markdown, 'utf-8');

            console.log(`  ✅ Saved: ${filename}\n`);
            processed++;
        }

        console.log(`\n🎉 Successfully processed ${processed} blog posts!`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the script
main();
