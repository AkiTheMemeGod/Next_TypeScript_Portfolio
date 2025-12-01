BEGIN;

-- Insert sample blog posts with minimal content
INSERT INTO blog_posts (title, slug, excerpt, content, published, featured, reading_time, published_at, author_id) VALUES
(
  'Building Scalable React Applications with TypeScript',
  'building-scalable-react-applications-typescript',
  'Learn how to structure large-scale React applications using TypeScript for better maintainability and type safety.',
  '# Building Scalable React Applications with TypeScript

In this comprehensive guide, we explore the best practices for building scalable React applications using TypeScript. We cover project structure, type definitions, state management, and performance optimization.

## Project Structure

A well-organized project structure is crucial for scalability.

## Type Definitions

Creating robust type definitions helps catch errors early.

## State Management

Choosing the right state management solution.

## Performance Optimization

Techniques for optimizing React applications.

This approach ensures type safety throughout your application.',
  true,
  true,
  8,
  '2024-01-15 10:00:00',
  NULL
),
(
  'Security Best Practices for Modern Web Applications',
  'security-best-practices-modern-web-applications',
  'Essential security measures every developer should implement to protect web applications from common vulnerabilities.',
  '# Security Best Practices for Modern Web Applications

Security should be a primary concern in every web application. This article covers essential security practices.

## Authentication & Authorization

Implementing proper authentication mechanisms.

## Data Protection

Encrypting sensitive data and implementing proper access controls.

## Common Vulnerabilities

Understanding and preventing OWASP Top 10 vulnerabilities.

## Security Headers

Implementing security headers for enhanced protection.

Stay secure and protect your users!',
  true,
  false,
  6,
  '2024-01-14 10:00:00',
  NULL
),
(
  'Optimizing Next.js Performance: Advanced Techniques',
  'optimizing-nextjs-performance-advanced-techniques',
  'Deep dive into Next.js performance optimization strategies for lightning-fast web applications.',
  '# Optimizing Next.js Performance: Advanced Techniques

Performance is key to user experience. Learn advanced techniques for optimizing Next.js applications.

## Code Splitting

Implementing dynamic imports and route-based code splitting.

## Image Optimization

Leveraging Next.js Image component for optimal loading.

## Caching Strategies

Implementing effective caching at multiple levels.

## Bundle Analysis

Tools and techniques for analyzing and optimizing bundle size.

These techniques will significantly improve your app performance!',
  true,
  true,
  10,
  '2024-01-13 10:00:00',
  NULL
);

COMMIT;