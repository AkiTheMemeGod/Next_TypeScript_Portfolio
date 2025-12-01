BEGIN;

-- Create a function to get blog post with categories and tags
CREATE OR REPLACE FUNCTION get_blog_post_with_relations(post_slug TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  published BOOLEAN,
  featured BOOLEAN,
  reading_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID,
  categories JSONB,
  tags JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.content,
    bp.cover_image_url,
    bp.published,
    bp.featured,
    bp.reading_time,
    bp.created_at,
    bp.updated_at,
    bp.published_at,
    bp.author_id,
    COALESCE(
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', bc.id,
          'name', bc.name,
          'slug', bc.slug,
          'color', bc.color,
          'description', bc.description
        )
      ) FILTER (WHERE bc.id IS NOT NULL),
      '[]'::JSONB
    ) as categories,
    COALESCE(
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', bt.id,
          'name', bt.name,
          'slug', bt.slug
        )
      ) FILTER (WHERE bt.id IS NOT NULL),
      '[]'::JSONB
    ) as tags
  FROM blog_posts bp
  LEFT JOIN blog_post_categories bpc ON bp.id = bpc.post_id
  LEFT JOIN blog_categories bc ON bpc.category_id = bc.id
  LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
  LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
  WHERE bp.slug = post_slug AND bp.published = true
  GROUP BY bp.id, bp.title, bp.slug, bp.excerpt, bp.content, bp.cover_image_url, bp.published, bp.featured, bp.reading_time, bp.created_at, bp.updated_at, bp.published_at, bp.author_id;
END;
$$ LANGUAGE plpgsql;

COMMIT;