/**
 * Fetch experience entries from Notion API and convert to markdown files
 * 
 * This script:
 * 1. Queries the Notion database for experience pages
 * 2. Extracts company info, role, period, and projects
 * 3. Creates markdown files with proper frontmatter
 * 
 * Usage:
 *   node scripts/fetch-notion-experience.js           # Fetch all experiences
 *   node scripts/fetch-notion-experience.js --limit 3 # Fetch only 3 (for testing)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = '2d5835c2e62f8026abb8f2bdf353ca04'; // From URL: alifgiant/2d5835c2e62f8026abb8f2bdf353ca04
const EXPERIENCE_DIR = path.join(__dirname, '..', 'contents', 'experience');

// Company metadata (hardcoded for now, could be moved to separate DB/config)
const COMPANY_METADATA = {
    'Grab': {
        role: 'Senior Software Engineer, Mobile',
        period: 'Aug 2021 - Present',
        current: true,
        order: 1
    },
    'Bukalapak': {
        role: 'Software Engineer, Mobile Apps',
        period: 'Apr 2018 - Jul 2021',
        current: false,
        order: 2
    },
    'Xtremax': {
        role: 'Back End Developer',
        period: 'Oct 2017 - Mar 2018',
        current: false,
        order: 3
    },
    'Personal': {
        role: 'Personal Projects',
        period: '2016 - Present',
        current: true,
        order: 99
    }
};

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
 * Parse achievements from page blocks
 * Extracts bullet points from paragraph blocks (split by • character)
 * @param {Array} blocks - Notion blocks
 * @returns {Array} - Array of achievement strings
 */
function parseAchievements(blocks) {
    const achievements = [];

    for (const block of blocks) {
        const type = block.type;
        const content = block[type];

        if (type === 'paragraph') {
            const text = richTextToMarkdown(content?.rich_text);
            if (text.trim()) {
                // Split by bullet point character •
                const bullets = text.split('•').map(s => s.trim()).filter(s => s.length > 0);
                achievements.push(...bullets);
            }
        } else if (type === 'bulleted_list_item') {
            // Also support native bulleted lists
            const text = richTextToMarkdown(content?.rich_text);
            if (text.trim()) {
                achievements.push(text);
            }
        }
    }

    return achievements;
}

/**
 * Fetch all blocks (content) from a Notion page
 * @param {string} pageId - Notion page ID
 * @returns {Promise<Array>} - Array of blocks
 */
async function fetchPageBlocks(pageId) {
    const blocks = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
        const endpoint = `/v1/blocks/${pageId}/children${startCursor ? `?start_cursor=${startCursor}` : ''}`;
        const response = await notionRequest(endpoint, 'GET');

        blocks.push(...response.results);

        hasMore = response.has_more;
        startCursor = response.next_cursor;
    }

    return blocks;
}

/**
 * Extract project properties
 * @param {object} page - Notion page object (represents a project)
 * @returns {object} - Project properties
 */
function extractProjectProperties(page) {
    const props = page.properties;
    const project = {};

    // Extract company from select field
    if (props.Company?.select) {
        project.company = props.Company.select.name;
    }

    // Extract title
    const titleProp = props.Title || props.Name || props.title;
    if (titleProp?.title) {
        project.title = richTextToPlain(titleProp.title);
    }

    // Extract tag (as rich_text in this database)
    if (props.Tag?.rich_text) {
        project.tag = richTextToPlain(props.Tag.rich_text);
    }

    // Extract description (new field)
    if (props.Description?.rich_text) {
        project.description = richTextToPlain(props.Description.rich_text);
    }

    return project;
}

/**
 * Cleanup experience directory by removing all .md files
 */
function cleanupExperienceDir() {
    console.log(`🧹 Cleaning up ${EXPERIENCE_DIR}...`);
    if (!fs.existsSync(EXPERIENCE_DIR)) return;

    const files = fs.readdirSync(EXPERIENCE_DIR);
    for (const file of files) {
        if (file.endsWith('.md')) {
            fs.unlinkSync(path.join(EXPERIENCE_DIR, file));
            console.log(`  🗑️ Deleted: ${file}`);
        }
    }
    console.log('✨ Cleanup complete.\n');
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
            yaml += `${key}:\n`;
            for (const item of value) {
                if (typeof item === 'object') {
                    // Handle nested objects (like projects)
                    yaml += `  - title: "${escapeYaml(item.title || '')}"\n`;
                    if (item.tag) {
                        yaml += `    tag: "${escapeYaml(item.tag)}"\n`;
                    }
                    if (item.description) {
                        yaml += `    description: "${escapeYaml(item.description)}"\n`;
                    }
                    if (item.achievements && item.achievements.length > 0) {
                        yaml += `    achievements:\n`;
                        for (const achievement of item.achievements) {
                            // Use literal style (|) to preserve markdown formatting
                            yaml += `      - "${escapeYaml(achievement)}"\n`;
                        }
                    }
                } else {
                    yaml += `  - "${escapeYaml(item)}"\n`;
                }
            }
        } else if (typeof value === 'boolean') {
            yaml += `${key}: ${value}\n`;
        } else if (typeof value === 'number') {
            yaml += `${key}: ${value}\n`;
        } else if (typeof value === 'string') {
            yaml += `${key}: "${escapeYaml(value)}"\n`;
        } else {
            yaml += `${key}: ${value}\n`;
        }
    }

    yaml += '---\n';
    return yaml;
}

/**
 * Escape string for YAML (preserve markdown but escape quotes)
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeYaml(str) {
    if (typeof str !== 'string') return '';
    // Only escape double quotes and backslashes
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Generate a URL-friendly slug from company name
 * @param {string} company - Company name
 * @returns {string} - URL-friendly slug
 */
function slugify(company) {
    return company
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);
}

/**
 * Main function to fetch and process all experience entries
 */
async function main() {
    console.log('🚀 Fetching experience entries from Notion...\n');

    if (PAGE_LIMIT) {
        console.log(`📝 Limiting to ${PAGE_LIMIT} pages for testing\n`);
    }

    // Ensure experience directory exists
    if (!fs.existsSync(EXPERIENCE_DIR)) {
        fs.mkdirSync(EXPERIENCE_DIR, { recursive: true });
    }

    // CLEANUP: Delete existing experience files
    cleanupExperienceDir();

    try {
        // Query the database for all project pages
        const queryBody = {
            page_size: PAGE_LIMIT || 100,
            sorts: [{ timestamp: 'created_time', direction: 'descending' }]
        };

        const response = await notionRequest(`/v1/databases/${DATABASE_ID}/query`, 'POST', queryBody);

        console.log(`💼 Found ${response.results.length} project entries\n`);

        // Group projects by company
        const companiesMap = new Map();

        for (const page of response.results) {
            const projectProps = extractProjectProperties(page);
            const company = projectProps.company || 'Unknown';

            console.log(`Processing: ${projectProps.title} (${company})`);

            // Fetch page blocks to extract achievements
            const blocks = await fetchPageBlocks(page.id);
            const achievements = parseAchievements(blocks);

            console.log(`  Found ${achievements.length} achievements`);

            // Initialize company if not exists
            if (!companiesMap.has(company)) {
                const metadata = COMPANY_METADATA[company] || {
                    role: '',
                    period: '',
                    current: false,
                    order: 99
                };

                companiesMap.set(company, {
                    company: company,
                    role: metadata.role,
                    period: metadata.period,
                    current: metadata.current,
                    order: metadata.order,
                    projects: []
                });
            }

            // Add project to company
            const companyData = companiesMap.get(company);
            const projectData = {
                title: projectProps.title || 'Untitled Project',
                tag: projectProps.tag || '',
                achievements: achievements
            };
            
            // Add description if available
            if (projectProps.description) {
                projectData.description = projectProps.description;
            }
            
            companyData.projects.push(projectData);
        }

        // Generate markdown files for each company
        console.log('\n--- Generating Files ---\n');
        let processed = 0;
        for (const [companyName, companyData] of companiesMap) {
            const slug = slugify(companyName);

            console.log(`${companyName}:`);
            console.log(`  ${companyData.projects.length} projects`);

            // Generate frontmatter
            const markdown = generateFrontmatter(companyData);

            // Save to file with order prefix
            const filename = `${String(companyData.order).padStart(2, '0')}-${slug}.md`;
            const filepath = path.join(EXPERIENCE_DIR, filename);
            fs.writeFileSync(filepath, markdown, 'utf-8');

            console.log(`  ✅ Saved: ${filename}\n`);
            processed++;
        }

        console.log(`🎉 Successfully processed ${response.results.length} projects into ${processed} company files!`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the script
main();
