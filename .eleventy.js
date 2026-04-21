/**
 * 11ty Configuration
 * Configures static site generation with Nunjucks templates and markdown content
 */
const markdownIt = require('markdown-it');
const multimdTable = require('markdown-it-multimd-table');
const fs = require('fs');
const path = require('path');

// Get image dimensions for responsive images
function getImageDimensions(src) {
    try {
        // Remove leading slash and construct file path
        const filePath = src.startsWith('/') ? src.slice(1) : src;
        const fullPath = path.join(process.cwd(), filePath);
        
        if (fs.existsSync(fullPath)) {
            // Fallback dimensions - in production, you'd parse actual image metadata
            // For now, return standard dimensions that work for most content images
            return { width: 1200, height: 675 };
        }
    } catch (e) {
        // Silently fail - use defaults
    }
    return { width: 1200, height: 675 };
}

module.exports = function (eleventyConfig) {
    // Configure markdown-it with enhanced options
    const md = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    });

    // Enable multi-markdown table support (GFM-style tables)
    md.use(multimdTable);

    // Custom image renderer to add optimization attributes
    const defaultImageRenderer = md.renderer.rules.image;
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        let src = token.attrs[token.attrIndex('src')][1];
        const alt = token.content || 'Image';
        
        // Convert PNG and JPG sources to WebP only (no fallback)
        if (/\.(png|jpe?g)$/i.test(src)) {
            src = src.replace(/\.(png|jpe?g)$/i, '.webp');
        }
        
        // Get image dimensions
        const { width, height } = getImageDimensions(src);
        
        // Create img tag with optimization attributes
        return `<img 
            src="${src}" 
            alt="${alt}" 
            width="${width}" 
            height="${height}"
            loading="lazy" 
            decoding="async"
        />`;
    };

    // Render ```mermaid fences as Mermaid containers that Mermaid.js can parse directly.
    const defaultFenceRenderer = md.renderer.rules.fence;
    md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const info = (token.info || '').trim();
        const langName = info ? info.split(/\s+/g)[0].toLowerCase() : '';

        if (langName === 'mermaid' || langName === 'gitgraph') {
            // Normalize copied markdown content so Mermaid parser receives stable input.
            let mermaidSource = token.content
                .replace(/\r\n?/g, '\n')
                .replace(/\u00a0/g, ' ')
                .replace(/\t/g, '    ')
                .replace(/[ \t]+$/gm, '')
                .trimEnd();

            return `<div class="mermaid">${md.utils.escapeHtml(mermaidSource)}</div>`;
        }

        if (defaultFenceRenderer) {
            return defaultFenceRenderer(tokens, idx, options, env, self);
        }

        const langClass = langName ? ` class="${options.langPrefix}${md.utils.escapeHtml(langName)}"` : '';
        return `<pre><code${langClass}>${md.utils.escapeHtml(token.content)}</code></pre>\n`;
    };

    eleventyConfig.setLibrary('md', md);

    // Pass through static assets
    eleventyConfig.addPassthroughCopy('assets');
    eleventyConfig.addPassthroughCopy('favicon.ico');
    eleventyConfig.addPassthroughCopy('_headers');
    eleventyConfig.addPassthroughCopy({ 'src/css': 'css' });
    eleventyConfig.addPassthroughCopy({ 'src/js': 'js' });

    // Ignore files that shouldn't be processed
    eleventyConfig.ignores.add('index.html');
    eleventyConfig.ignores.add('design-ref/**');
    eleventyConfig.ignores.add('resume/**');
    eleventyConfig.ignores.add('deeplink.html');
    eleventyConfig.ignores.add('README.md');
    eleventyConfig.ignores.add('.agent/**');
    eleventyConfig.ignores.add('node_modules/**');

    // Create blog posts collection sorted by date (newest first)
    eleventyConfig.addCollection('posts', function (collectionApi) {
        return collectionApi.getAll()
            .filter(item => item.inputPath.includes('/contents/blog/') && item.inputPath.endsWith('.md'))
            .sort((a, b) => (b.date || 0) - (a.date || 0));
    });

    // Create experience collection sorted by order
    eleventyConfig.addCollection('experiences', function (collectionApi) {
        return collectionApi.getAll()
            .filter(item => item.inputPath.includes('/contents/work/') && item.inputPath.endsWith('.md'))
            .sort((a, b) => (a.data.order || 99) - (b.data.order || 99));
    });

    // Date formatting filter
    eleventyConfig.addFilter('formatDate', function (date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    });

    // Reading time filter
    eleventyConfig.addFilter('readingTime', function (content) {
        const wordsPerMinute = 200;
        const words = content ? content.split(/\s+/).length : 0;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    });

    return {
        dir: {
            input: '.',
            output: '_site',
            includes: 'src/_includes',
            data: 'src/_data'
        },
        templateFormats: ['njk', 'md', 'html'],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk'
    };
};
