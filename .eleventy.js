module.exports = function(eleventyConfig) {
  // Pass through static assets unchanged
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "public": "/" });

  // Collections: case studies (ordered by order field)
  eleventyConfig.addCollection("caseStudies", (collection) => {
    return collection.getFilteredByGlob("src/content/case-studies/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });

  // Filter: slugify for URLs
  eleventyConfig.addFilter("slug", (str) => {
    return String(str).toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  });

  // Filter: escape HTML entities (simple)
  eleventyConfig.addFilter("smart", (str) => {
    if (!str) return "";
    return String(str)
      .replace(/\.\.\./g, "&hellip;")
      .replace(/---/g, "&mdash;")
      .replace(/--/g, "&ndash;");
  });

  // Markdown support for rich text fields
  const md = require("markdown-it")({ html: true, breaks: false, linkify: true });
  eleventyConfig.addFilter("md", (str) => str ? md.render(String(str)) : "");
  eleventyConfig.addFilter("mdInline", (str) => str ? md.renderInline(String(str)) : "");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "content/data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
