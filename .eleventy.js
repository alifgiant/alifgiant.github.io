/**
 * 11ty Configuration
 * Configures static site generation with Nunjucks templates and markdown content
 */
const markdownIt = require('markdown-it');

module.exports = function (eleventyConfig) {
    // Configure markdown-it with enhanced options
    const md = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    });

    eleventyConfig.setLibrary('md', md);

    // Pass through static assets
    eleventyConfig.addPassthroughCopy('assets');
    eleventyConfig.addPassthroughCopy({ 'src/css': 'css' });
    eleventyConfig.addPassthroughCopy({ 'src/js': 'js' });

    // Ignore the old index.html and design-ref folder
    eleventyConfig.ignores.add('index.html');
    eleventyConfig.ignores.add('design-ref/**');
    eleventyConfig.ignores.add('resume/**');
    eleventyConfig.ignores.add('deeplink.html');

    // Create blog posts collection sorted by date (newest first)
    eleventyConfig.addCollection('posts', function (collectionApi) {
        return collectionApi.getFilteredByGlob('contents/blog/*.md')
            .sort((a, b) => b.date - a.date);
    });

    // Create experience collection sorted by order
    eleventyConfig.addCollection('experiences', function (collectionApi) {
        return collectionApi.getFilteredByGlob('contents/experience/*.md')
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
