truncate table notes cascade;
truncate table projects cascade;

insert into notes (title, content) values
  ('Template ready', 'Supabase + Lambda template is ready to accept data.'),
  ('Projects seeded', 'This note proves seeding works with the schema script.');

insert into projects (name, description, repo_url, status, priority, tags, metadata) values
  (
    'Personal Portfolio',
    'Landing page that aggregates Seasoned projects.',
    'https://github.com/jovyllebermudez/portfolio',
    'active',
    20,
    array['personal','frontend'],
    '{"featured_image":"https://example.com/portfolio.png","demo_url":"https://jovyllebermudez.dev","notes":"Client-facing showcase"}'::jsonb
  ),
  (
    'Supabase AWS Template',
    'The repo you are working on right now; serves metadata for other UIs.',
    'https://github.com/jovyllebermudez/supabase-aws-serverless-template',
    'active',
    10,
    array['template'],
    '{"docs":"README.md","tags":"lambda","notes":"Primary backend"}'::jsonb
  );
