/**
 * 11ty Configuration
 * Configures static site generation with Nunjucks templates and markdown content
 */
const markdownIt = require('markdown-it');
const multimdTable = require('markdown-it-multimd-table');

module.exports = function (eleventyConfig) {
    // Configure markdown-it with enhanced options
    const md = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    });

    // Enable multi-markdown table support (GFM-style tables)
    md.use(multimdTable);

    eleventyConfig.setLibrary('md', md);

    // Pass through static assets
    eleventyConfig.addPassthroughCopy('assets');
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
            .filter(item => item.inputPath.includes('/contents/experience/') && item.inputPath.endsWith('.md'))
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
