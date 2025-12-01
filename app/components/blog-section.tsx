"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/database.types";
import { MagneticCard } from "./magnetic-card";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  blog_categories: Database["public"]["Tables"]["blog_categories"]["Row"][];
  blog_tags: Database["public"]["Tables"]["blog_tags"]["Row"][];
};

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Database["public"]["Tables"]["blog_categories"]["Row"][]>([]);
  const [tags, setTags] = useState<Database["public"]["Tables"]["blog_tags"]["Row"][]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  const fetchPosts = useMemo(() => async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("blog_posts")
        .select(`
          *,
          blog_categories(*),
          blog_tags(*)
        `)
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (selectedCategory) {
        query = query.contains("blog_categories", [{ slug: selectedCategory }]);
      }

      if (selectedTag) {
        query = query.contains("blog_tags", [{ slug: selectedTag }]);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedTag, searchQuery, supabase]);

  const fetchCategories = useMemo(() => async () => {
    try {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [supabase]);

  const fetchTags = useMemo(() => async () => {
    try {
      const { data, error } = await supabase
        .from("blog_tags")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, [fetchCategories, fetchTags]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const trackView = async (postId: string) => {
    try {
      await supabase.from("blog_views").insert({
        post_id: postId,
        ip_address: null,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 skeleton animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="h-4 bg-white/10 rounded mb-2 skeleton"></div>
            <div className="h-3 bg-white/10 rounded mb-1 skeleton"></div>
            <div className="h-3 bg-white/10 rounded w-3/4 skeleton"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4 animate-fade-in-up">
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-neutral-400 backdrop-blur-strong focus:border-fuchsia-500/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 smooth-transition"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full border px-3 py-1 text-xs smooth-transition hover-lift ${
              selectedCategory === null
                ? "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200 animate-pulse-glow"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`rounded-full border px-3 py-1 text-xs smooth-transition hover-lift ${
                selectedCategory === category.slug
                  ? "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200 animate-pulse-glow"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
              }`}
              style={{
                borderColor: selectedCategory === category.slug ? category.color : undefined,
                backgroundColor: selectedCategory === category.slug ? `${category.color}20` : undefined,
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`rounded-full border px-3 py-1 text-xs smooth-transition hover-lift ${
              selectedTag === null
                ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-200 animate-pulse-glow"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
            }`}
          >
            All Tags
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.slug)}
              className={`rounded-full border px-3 py-1 text-xs smooth-transition hover-lift ${
                selectedTag === tag.slug
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-200 animate-pulse-glow"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12 animate-fade-in-up">
          <p className="text-neutral-400">No posts found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <MagneticCard key={post.id} intensity={0.1} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <article className="group rounded-xl border border-white/10 bg-white/5 p-4 transform-gpu smooth-transition hover:scale-105 hover:border-fuchsia-500/30 hover:shadow-lg hover:shadow-fuchsia-500/20">
                {post.cover_image_url && (
                  <div className="relative h-32 overflow-hidden rounded-lg mb-4">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transform-gpu smooth-transition group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-2">
                  {post.blog_categories.map((category) => (
                    <span
                      key={category.id}
                      className="rounded-full border px-2 py-0.5 text-xs smooth-transition hover:scale-110"
                      style={{
                        borderColor: category.color,
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                      }}
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-lg font-medium group-hover:text-fuchsia-300 smooth-transition mb-2">
                  {post.title}
                </h3>
                
                <p className="text-sm text-neutral-300 line-clamp-3 mb-3">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.blog_tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-neutral-300 smooth-transition hover:border-cyan-500/30 hover:bg-cyan-500/10"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span>{post.reading_time || 5} min read</span>
                    <span>•</span>
                    <span>
                      {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {post.featured && (
                    <span className="text-fuchsia-400 animate-pulse">⭐ Featured</span>
                  )}
                </div>
                
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      trackView(post.id);
                      // Use client-side navigation to ensure the route opens
                      window.location.href = `/blog/${post.slug}`;
                    }}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/90 backdrop-blur-strong smooth-transition hover:bg-white/10 hover:border-fuchsia-500/30 hover:scale-105 hover-lift"
                  >
                    Read More
                  </button>
                </div>
              </article>
            </MagneticCard>
          ))}
        </div>
      )}
      
      {/* Admin Link */}
      <div className="text-center pt-8 border-t border-white/10">
        <a
          href="/blog/admin"
          className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-2 text-sm text-fuchsia-200 backdrop-blur-strong smooth-transition hover:bg-fuchsia-500/20 hover-lift"
        >
          📝 Write New Blog Post
        </a>
      </div>
    </div>
  );
}
