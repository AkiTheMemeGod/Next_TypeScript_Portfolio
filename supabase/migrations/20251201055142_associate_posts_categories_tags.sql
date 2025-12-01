BEGIN;

-- Associate posts with categories
INSERT INTO blog_post_categories (post_id, category_id)
SELECT bp.id, bc.id 
FROM blog_posts bp, blog_categories bc 
WHERE bp.slug = 'building-scalable-react-applications-typescript' 
AND bc.slug IN ('development', 'technology');

INSERT INTO blog_post_categories (post_id, category_id)
SELECT bp.id, bc.id 
FROM blog_posts bp, blog_categories bc 
WHERE bp.slug = 'security-best-practices-modern-web-applications' 
AND bc.slug IN ('security', 'technology');

INSERT INTO blog_post_categories (post_id, category_id)
SELECT bp.id, bc.id 
FROM blog_posts bp, blog_categories bc 
WHERE bp.slug = 'optimizing-nextjs-performance-advanced-techniques' 
AND bc.slug IN ('development', 'performance');

-- Associate posts with tags
INSERT INTO blog_post_tags (post_id, tag_id)
SELECT bp.id, bt.id 
FROM blog_posts bp, blog_tags bt 
WHERE bp.slug = 'building-scalable-react-applications-typescript' 
AND bt.slug IN ('react', 'typescript', 'tutorial', 'best-practices');

INSERT INTO blog_post_tags (post_id, tag_id)
SELECT bp.id, bt.id 
FROM blog_posts bp, blog_tags bt 
WHERE bp.slug = 'security-best-practices-modern-web-applications' 
AND bt.slug IN ('security', 'best-practices');

INSERT INTO blog_post_tags (post_id, tag_id)
SELECT bp.id, bt.id 
FROM blog_posts bp, blog_tags bt 
WHERE bp.slug = 'optimizing-nextjs-performance-advanced-techniques' 
AND bt.slug IN ('nextjs', 'performance', 'tutorial');

COMMIT;