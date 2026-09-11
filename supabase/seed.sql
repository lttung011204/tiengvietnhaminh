-- Sample curriculum content for Tiếng Việt Nhà Mình.
-- Run after 0001_init.sql. Safe to re-run (uses fixed ids + ON CONFLICT).
-- Teachers/parents/students/admin are NOT seeded here — those are real
-- auth.users and should go through the app's normal sign-up flow (see
-- README.md for how to promote the first admin).

insert into programs (id, slug, audience, name_vi, name_en, description_vi, description_en, is_published, sort_order)
values
  ('00000000-0000-0000-0000-000000000001', 'kids', 'kids', 'Tiếng Việt cho trẻ em', 'Vietnamese for Kids', 'Học qua flashcard hình ảnh và âm thanh.', 'Learn through picture and audio flashcards.', true, 1),
  ('00000000-0000-0000-0000-000000000002', 'adults', 'adults', 'Tiếng Việt cho người lớn', 'Vietnamese for Adults', 'Từ vựng, hội thoại và ngữ pháp theo lộ trình rõ ràng.', 'Vocabulary, conversation and grammar with a clear path.', true, 2)
on conflict (id) do nothing;

insert into courses (id, program_id, slug, level, name_vi, name_en, description_vi, description_en, is_published, sort_order)
values
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'kids-beginner-1', 'beginner', 'Tiếng Việt Thiếu Nhi 1', 'Kids Vietnamese Beginner 1', 'Bắt đầu với gia đình và những từ vựng gần gũi.', 'Starting with family and everyday words.', true, 1),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000002', 'adults-beginner-1', 'beginner', 'Tiếng Việt Người Lớn 1', 'Adults Vietnamese Beginner 1', 'Chào hỏi và giao tiếp cơ bản hằng ngày.', 'Greetings and everyday basic conversation.', true, 1)
on conflict (id) do nothing;

insert into units (id, course_id, name_vi, name_en, sort_order)
values
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000011', 'Gia đình', 'Family', 1),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000012', 'Chào hỏi', 'Greetings', 1)
on conflict (id) do nothing;

insert into lessons (id, unit_id, format, name_vi, name_en, estimated_minutes, is_published, sort_order)
values
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000021', 'flashcard', 'Bài 1: Thành viên gia đình', 'Lesson 1: Family Members', 10, true, 1),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000022', 'structured', 'Bài 1: Lời chào cơ bản', 'Lesson 1: Basic Greetings', 15, true, 1)
on conflict (id) do nothing;

-- Kids flashcard lesson content
insert into flashcards (lesson_id, image_url, word_vi, word_en, example_sentence_vi, example_sentence_en, sort_order)
values
  ('00000000-0000-0000-0000-000000000031', null, 'Mẹ', 'Mother', 'Con yêu mẹ.', 'I love my mother.', 1),
  ('00000000-0000-0000-0000-000000000031', null, 'Bố', 'Father', 'Bố ơi, con đói.', 'Dad, I''m hungry.', 2),
  ('00000000-0000-0000-0000-000000000031', null, 'Bà', 'Grandmother', 'Con nhớ bà lắm.', 'I miss grandma a lot.', 3),
  ('00000000-0000-0000-0000-000000000031', null, 'Ông', 'Grandfather', 'Ông kể chuyện cho con nghe.', 'Grandpa tells me stories.', 4),
  ('00000000-0000-0000-0000-000000000031', null, 'Chị gái', 'Older sister', 'Chị gái dạy em học.', 'My sister teaches me.', 5),
  ('00000000-0000-0000-0000-000000000031', null, 'Anh trai', 'Older brother', 'Anh trai chơi với em.', 'My brother plays with me.', 6)
on conflict do nothing;

insert into quiz_questions (id, lesson_id, question_type, prompt_vi, prompt_en, sort_order)
values
  ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000031', 'multiple_choice', 'Từ nào có nghĩa là "Mother"?', 'Which word means "Mother"?', 1),
  ('00000000-0000-0000-0000-000000000042', '00000000-0000-0000-0000-000000000031', 'multiple_choice', 'Từ nào có nghĩa là "Grandfather"?', 'Which word means "Grandfather"?', 2)
on conflict (id) do nothing;

insert into quiz_options (question_id, label_vi, label_en, is_correct, sort_order)
values
  ('00000000-0000-0000-0000-000000000041', 'Mẹ', 'Mother', true, 1),
  ('00000000-0000-0000-0000-000000000041', 'Bố', 'Father', false, 2),
  ('00000000-0000-0000-0000-000000000041', 'Chị gái', 'Older sister', false, 3),
  ('00000000-0000-0000-0000-000000000042', 'Ông', 'Grandfather', true, 1),
  ('00000000-0000-0000-0000-000000000042', 'Bà', 'Grandmother', false, 2),
  ('00000000-0000-0000-0000-000000000042', 'Anh trai', 'Older brother', false, 3)
on conflict do nothing;

-- Adult structured lesson content
insert into lesson_blocks (lesson_id, block_type, title_vi, title_en, content, sort_order)
values
  ('00000000-0000-0000-0000-000000000032', 'vocabulary', 'Từ vựng', 'Vocabulary',
    '{"items": [{"word_vi": "Xin chào", "word_en": "Hello"}, {"word_vi": "Cảm ơn", "word_en": "Thank you"}, {"word_vi": "Tạm biệt", "word_en": "Goodbye"}]}'::jsonb, 1),
  ('00000000-0000-0000-0000-000000000032', 'dialogue', 'Hội thoại', 'Dialogue',
    '{"lines": [{"speaker": "A", "text_vi": "Xin chào, bạn khỏe không?", "text_en": "Hello, how are you?"}, {"speaker": "B", "text_vi": "Tôi khỏe, cảm ơn bạn.", "text_en": "I''m well, thank you."}]}'::jsonb, 2),
  ('00000000-0000-0000-0000-000000000032', 'grammar', 'Ngữ pháp', 'Grammar',
    '{"text_vi": "Trong tiếng Việt, lời chào thường đi kèm với đại từ nhân xưng phù hợp với tuổi tác.", "text_en": "In Vietnamese, greetings are usually paired with a pronoun that matches the listener''s age."}'::jsonb, 3)
on conflict do nothing;
