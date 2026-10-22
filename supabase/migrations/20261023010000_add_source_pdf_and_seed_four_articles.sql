-- ==============================================================================
-- THE DISPATCH — Migration: Add Source PDF & Seed Four Original PDF Articles
-- ==============================================================================

-- 1. Schema Extensions
alter table public.articles add column if not exists source_pdf jsonb;
alter table public.articles add column if not exists pdf_pages jsonb default '[]'::jsonb;

-- 2. Seed Confirmed Contributors (if not present)
insert into public.contributors (id, display_name, role) values
  ('samridhi', 'Samridhi', 'Administrator'),
  ('arpita', 'Arpita Singh', 'Contributor'),
  ('kirti', 'Kirti', 'Contributor')
on conflict (id) do nothing;

-- 3. Seed Four Original Articles
insert into public.articles (
  id, slug, headline, subheading, summary, body, category, format,
  cover_src, cover_alt, cover_credit, cover_caption,
  source_pdf, pdf_pages, status, published_at, reading_time, is_lead, is_demo
) values
  (
    'dispatch-du-hidden-struggles',
    'hidden-struggles-du-students-beyond-classroom',
    'The Hidden Struggles of DU Students: Beyond the Classroom',
    'Attendance pressure, expensive accommodation, patriarchy and financial difficulties reveal the challenges students face beyond academics.',
    'From attendance pressure and expensive PG accommodation to family curfews and financial strain, Delhi University students face deep challenges beyond the lecture hall.',
    '⭐ **Introduction: Attendance pressure, expensive accommodation, patriarchy and financial difficulties reveal the challenges students face beyond academics.**\n\nCollege life is often considered one of the most exciting phases of a person’s life...',
    'Campus',
    'long-read',
    '/images/articles/du-campus-opportunity.jpg',
    'Delhi University Arts Faculty campus and building',
    'Original photograph (long story.pdf)',
    'For many students, Delhi University represents opportunity, independence and a new beginning.',
    '{"filename":"long story.pdf","url":"/documents/long story.pdf","sizeBytes":454754,"pageCount":6}'::jsonb,
    '["/images/articles/du-campus-opportunity.jpg","/images/articles/du-classroom-attendance.jpg","/images/articles/du-women-independence.jpg","/images/articles/du-pg-accommodation.jpg","/images/articles/du-student-financial-burden.jpg","/images/articles/du-students-lawn-growth.jpg"]'::jsonb,
    'published',
    '2026-10-21',
    6,
    true,
    false
  ),
  (
    'dispatch-delhi-daily-commute',
    'daily-commute-what-it-takes-to-reach-delhi',
    'The Daily Commute: What it takes to reach Delhi',
    'Delhi Daily Commute • The morning gauntlet, metro surges, road alternatives, and reaching the capital.',
    'For millions in Noida, Gurugram, and Ghaziabad, reaching Delhi every day is a masterclass in endurance, patience, and tactical crowd navigation.',
    '### The Morning Gauntlet\n\nThemorning alarm is a sharp, unforgiving siren at 5:30 AM...',
    'Society',
    'short',
    '/images/articles/delhi-commute-metro-montage.png',
    'Delhi Metro passenger and platform crowd during morning rush hour',
    'Original photograph (Short Story.pdf)',
    'Reaching the capital every day is not simply a commute; it is a masterclass in endurance, patience, and tactical navigation.',
    '{"filename":"Short Story.pdf","url":"/documents/Short Story.pdf","sizeBytes":1605374,"pageCount":2}'::jsonb,
    '["/images/articles/delhi-commute-metro-montage.png","/images/articles/delhi-commute-road-montage.png"]'::jsonb,
    'published',
    '2026-10-22',
    3,
    false,
    false
  ),
  (
    'dispatch-every-day-a-new-protest',
    'every-day-a-new-protest',
    'EVERY DAY, A NEW PROTEST',
    'What happens when people feel they are not being heard? An examination of student exam marches, European unrest, and law-and-order doctrine.',
    'From student exam marches and electoral rolls in India to a historic town hall fire in France and hard-line force in the US, an international investigation into global protest movements.',
    'The world seems to wake up to a new protest every day. Students march over exams, women demand safety and dignity...',
    'Investigations',
    'short',
    '/images/articles/every-day-protest-cover-illustration.png',
    'Editorial illustration: protest movements in India, France and the United States',
    'Editorial illustration (kirti(8).pdf)',
    'Editorial illustration: protest movements in India, France and the United States. This is an illustration, not a documentary photograph of one event.',
    '{"filename":"kirti(8).pdf","url":"/documents/kirti(8).pdf","sizeBytes":750133,"pageCount":3}'::jsonb,
    '["/images/articles/every-day-protest-page-1.png","/images/articles/every-day-protest-page-2.png","/images/articles/every-day-protest-page-3.png"]'::jsonb,
    'published',
    '2026-10-22',
    4,
    false,
    false
  ),
  (
    'dispatch-beyond-the-slogans',
    'beyond-the-slogans-real-impact-of-protests',
    'Beyond the Slogans: The Real Impact of Protests',
    'The Other Side of a Protest: Who Pays the Price When the Streets Become a Battlefield of Demands?',
    'A deep investigation into the wider ripple effects of street demonstrations on local residents, small businesses, the viral digital crowd, and public trust.',
    'While protests aim to bring change, their effects are far wider than just the people on the streets...',
    'Society',
    'photo',
    '/images/articles/beyond-slogans-rani-beti.png',
    'Demonstrator holding placard: RANI BETI REBEL KAREGI IN THE POOJA YOU DO WHAT',
    'Original photograph (kirti(1)(1).pdf)',
    'The Other Side of a Protest: Who Pays the Price When the Streets Become a Battlefield of Demands?',
    '{"filename":"kirti(1)(1).pdf","url":"/documents/kirti(1)(1).pdf","sizeBytes":1474301,"pageCount":4}'::jsonb,
    '["/images/articles/beyond-slogans-page-1.png","/images/articles/beyond-slogans-page-2.png","/images/articles/beyond-slogans-page-3.png","/images/articles/beyond-slogans-page-4.png"]'::jsonb,
    'published',
    '2026-10-21',
    8,
    false,
    false
  )
on conflict (id) do update set
  headline = excluded.headline,
  subheading = excluded.subheading,
  summary = excluded.summary,
  body = excluded.body,
  category = excluded.category,
  format = excluded.format,
  cover_src = excluded.cover_src,
  cover_alt = excluded.cover_alt,
  cover_credit = excluded.cover_credit,
  cover_caption = excluded.cover_caption,
  source_pdf = excluded.source_pdf,
  pdf_pages = excluded.pdf_pages,
  status = excluded.status,
  is_lead = excluded.is_lead,
  is_demo = excluded.is_demo;

-- 4. Attribution Links
insert into public.article_contributors (article_id, contributor_id, contribution_role, display_order) values
  ('dispatch-du-hidden-struggles', 'arpita', 'Reporter / Writer', 0),
  ('dispatch-du-hidden-struggles', 'samridhi', 'Editor', 1),
  ('dispatch-delhi-daily-commute', 'arpita', 'Reporter / Writer', 0),
  ('dispatch-delhi-daily-commute', 'samridhi', 'Editor', 1),
  ('dispatch-every-day-a-new-protest', 'kirti', 'Reporter / Writer', 0),
  ('dispatch-every-day-a-new-protest', 'samridhi', 'Editor', 1),
  ('dispatch-beyond-the-slogans', 'kirti', 'Reporter / Writer', 0),
  ('dispatch-beyond-the-slogans', 'samridhi', 'Editor', 1)
on conflict do nothing;
