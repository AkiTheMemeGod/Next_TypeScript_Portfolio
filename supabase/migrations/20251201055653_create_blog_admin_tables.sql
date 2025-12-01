BEGIN;

-- Create blog drafts table for admin functionality
CREATE TABLE blog_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  reading_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create junction table for drafts and categories
CREATE TABLE blog_draft_categories (
  draft_id UUID REFERENCES blog_drafts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (draft_id, category_id)
);

-- Create junction table for drafts and tags
CREATE TABLE blog_draft_tags (
  draft_id UUID REFERENCES blog_drafts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (draft_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX idx_blog_drafts_author_id ON blog_drafts(author_id);
CREATE INDEX idx_blog_drafts_created_at ON blog_drafts(created_at DESC);
CREATE INDEX idx_blog_drafts_slug ON blog_drafts(slug);

-- Create updated_at trigger for drafts
CREATE TRIGGER update_blog_drafts_updated_at 
    BEFORE UPDATE ON blog_drafts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security for drafts
ALTER TABLE blog_drafts ENABLE ROW LEVEL SECURITY;

-- Policies for blog drafts
CREATE POLICY "Users can view their own drafts" ON blog_drafts
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can create their own drafts" ON blog_drafts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own drafts" ON blog_drafts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own drafts" ON blog_drafts
    FOR DELETE USING (auth.uid() = author_id);

COMMIT;