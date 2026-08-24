-- ==============================================================================
-- FunLearn - Gamified Rural Education Platform
-- Supabase PostgreSQL Schema (schema.sql)
-- Features: Offline-first sync support, RLS, XP Gamification, Trilingual defaults
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- Stores student info, gamification stats (XP, level, streak), and language prefs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name VARCHAR(150) NOT NULL DEFAULT 'Student',
    class_level INTEGER NOT NULL DEFAULT 7 CHECK (class_level BETWEEN 1 AND 12),
    preferred_lang VARCHAR(10) NOT NULL DEFAULT 'hi' CHECK (preferred_lang IN ('en', 'hi', 'or')),
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    total_xp INTEGER NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
    level_title VARCHAR(100) NOT NULL DEFAULT 'Gyaan Aarambhi (Beginner Learner)',
    streak_days INTEGER NOT NULL DEFAULT 1 CHECK (streak_days >= 0),
    teacher_id UUID, -- optional reference to a teacher's user_id
    village_school_name VARCHAR(200),
    avatar_id VARCHAR(50) DEFAULT 'sprout',
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. LESSONS TABLE
-- Master curriculum lesson bundles with trilingual metadata & quizzes
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lessons (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    subject VARCHAR(100) NOT NULL,
    class_level INTEGER NOT NULL DEFAULT 7,
    estimated_minutes INTEGER NOT NULL DEFAULT 15,
    xp_reward INTEGER NOT NULL DEFAULT 100,
    size_kb INTEGER NOT NULL DEFAULT 1200,
    title_en TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    title_or TEXT NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    description_or TEXT,
    content_en TEXT,
    content_hi TEXT,
    content_or TEXT,
    explore_content_en TEXT,
    explore_content_hi TEXT,
    explore_content_or TEXT,
    experiment_title_en TEXT,
    experiment_title_hi TEXT,
    experiment_title_or TEXT,
    experiment_steps_en JSONB DEFAULT '[]'::jsonb,
    experiment_steps_hi JSONB DEFAULT '[]'::jsonb,
    experiment_steps_or JSONB DEFAULT '[]'::jsonb,
    key_vocab_keys JSONB DEFAULT '[]'::jsonb,
    questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. CHAPTER PROGRESS TABLE
-- Tracks subject/chapter mastery, offline bundle progress, and quiz scores
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chapter_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    chapter_slug VARCHAR(150) NOT NULL,
    progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    status VARCHAR(30) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_chapter UNIQUE (user_id, subject, chapter_slug)
);

-- ------------------------------------------------------------------------------
-- 4. MISSION LOGS TABLE
-- Immutable logs of completed gamified missions/quizzes, with offline sync tracking
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mission_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    mission_slug VARCHAR(150) NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
    xp_earned INTEGER NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
    offline_synced_flag BOOLEAN NOT NULL DEFAULT FALSE,
    client_mutation_id UUID UNIQUE, -- Client-generated UUID for idempotency in offline sync
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR FAST QUERYING & BATCH SYNC
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_teacher_id ON public.profiles(teacher_id);
CREATE INDEX IF NOT EXISTS idx_profiles_total_xp ON public.profiles(total_xp DESC);

CREATE INDEX IF NOT EXISTS idx_lessons_subject_class ON public.lessons(subject, class_level);
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON public.lessons(slug);

CREATE INDEX IF NOT EXISTS idx_chapter_progress_user ON public.chapter_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_chapter_progress_subject ON public.chapter_progress(user_id, subject);

CREATE INDEX IF NOT EXISTS idx_mission_logs_user_date ON public.mission_logs(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_mission_logs_offline_sync ON public.mission_logs(offline_synced_flag);
CREATE INDEX IF NOT EXISTS idx_mission_logs_mutation_id ON public.mission_logs(client_mutation_id);

-- ------------------------------------------------------------------------------
-- HELPER FUNCTION: Compute Level Title based on Total XP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_level_title(xp_count INTEGER)
RETURNS VARCHAR(100) AS $$
BEGIN
    IF xp_count < 150 THEN
        RETURN 'Gyaan Aarambhi (Novice Explorer)';
    ELSIF xp_count < 400 THEN
        RETURN 'Khoji Shiksharthi (Curious Seeker)';
    ELSIF xp_count < 800 THEN
        RETURN 'Gram Vigyani (Village Scientist)';
    ELSIF xp_count < 1500 THEN
        RETURN 'Prayogik Guru (Experiment Master)';
    ELSIF xp_count < 3000 THEN
        RETURN 'Mahan Anveshak (Grand Researcher)';
    ELSE
        RETURN 'Gyaan Shiromani (Village Laureate)';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ------------------------------------------------------------------------------
-- TRIGGER FUNCTION: Update level_title & updated_at automatically on profile change
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_profile_xp_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.level_title := public.calculate_level_title(NEW.total_xp);
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profile_xp_update
    BEFORE INSERT OR UPDATE OF total_xp, student_name, class_level, preferred_lang
    ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_xp_update();

-- ------------------------------------------------------------------------------
-- TRIGGER FUNCTION: Automatically update profile XP when mission log is inserted
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_mission_log_inserted()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET 
        total_xp = total_xp + NEW.xp_earned,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_mission_log_inserted
    AFTER INSERT ON public.mission_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_mission_log_inserted();

-- ------------------------------------------------------------------------------
-- TRIGGER: Auto-create a profile row when a new user signs up via Supabase Auth
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, student_name, class_level, preferred_lang, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'student_name', 'Student'),
        COALESCE((NEW.raw_user_meta_data->>'class_level')::INTEGER, 7),
        COALESCE(NEW.raw_user_meta_data->>'preferred_lang', 'hi'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_new_user_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_logs ENABLE ROW LEVEL SECURITY;

-- ── Profiles Policies ─────────────────────────────────────────────────────────

-- Anyone logged in can read their own profile
CREATE POLICY "Students can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

-- Students can update only their own profile
CREATE POLICY "Students can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow profile creation on signup
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Teachers can view profiles of their linked students
CREATE POLICY "Teachers can view linked students"
    ON public.profiles FOR SELECT
    USING (
        teacher_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.user_id = auth.uid() 
              AND p.role IN ('teacher', 'admin')
        )
    );

-- ── Lessons Policies ──────────────────────────────────────────────────────────

-- Lessons are publicly readable by all authenticated and anon users
CREATE POLICY "Lessons are viewable by everyone"
    ON public.lessons FOR SELECT
    USING (true);

-- ── Chapter Progress Policies ──────────────────────────────────────────────────

-- Students manage only their own chapter progress
CREATE POLICY "Users can manage own chapter progress"
    ON public.chapter_progress FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Teachers can read chapter progress of linked students
CREATE POLICY "Teachers can view linked student progress"
    ON public.chapter_progress FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles sp
            WHERE sp.user_id = chapter_progress.user_id
              AND sp.teacher_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.profiles tp
            WHERE tp.user_id = auth.uid()
              AND tp.role IN ('teacher', 'admin')
        )
    );

-- ── Mission Logs Policies ──────────────────────────────────────────────────────

-- Students manage only their own mission logs
CREATE POLICY "Users can manage own mission logs"
    ON public.mission_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Teachers can read mission logs of their linked students
CREATE POLICY "Teachers can view linked student mission logs"
    ON public.mission_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles sp
            WHERE sp.user_id = mission_logs.user_id
              AND sp.teacher_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.profiles tp
            WHERE tp.user_id = auth.uid()
              AND tp.role IN ('teacher', 'admin')
        )
    );

-- ------------------------------------------------------------------------------
-- SEED LESSONS DATA
-- ------------------------------------------------------------------------------
INSERT INTO public.lessons (
    id, slug, subject, class_level, estimated_minutes, xp_reward, size_kb,
    title_en, title_hi, title_or,
    description_en, description_hi, description_or
)
VALUES 
    (
        'bundle-physics-01', 'electricity-and-circuit-builder', 'Physics', 7, 15, 100, 1400,
        'Electricity & Circuit Builder (Ohm''s Law)',
        'विद्युत परिपथ और ओम का नियम (Circuit & Ohm''s Law)',
        'ବିଦ୍ୟୁତ୍ ପରିପଥ ଏବଂ ଓମ୍‌ଙ୍କ ନିୟମ (Ohm''s Law)',
        'Construct virtual electric circuits with batteries, switches, resistors, and light bulbs to master Ohm''s Law.',
        'बैटरी, स्विच, प्रतिरोध और बल्ब जोड़कर विद्युत परिपथ बनाएं और ओम के नियम को समझें।',
        'ବ୍ୟାଟେରୀ, ସ୍ୱିଚ୍ ଏବଂ ବଲ୍ବ ସଂଯୋଗ କରି ବିଦ୍ୟୁତ୍ ପରିପଥ ନିର୍ମାଣ କରନ୍ତୁ।'
    ),
    (
        'bundle-chem-01', 'water-quality-and-ph-indicator-lab', 'Chemistry', 7, 15, 100, 1100,
        'Water Quality & pH Indicator Lab',
        'जल गुणवत्ता और pH सूचक प्रयोगशाला (Water pH Lab)',
        'ଜଳ ଗୁଣବତ୍ତା ଏବଂ pH ସୂଚକ ପରୀକ୍ଷାଗାର (Water pH Lab)',
        'Test pond water, tap water, lemon juice, and soap solutions using litmus and universal indicators.',
        'तालाब के पानी, नल के पानी, नींबू के रस और साबुन के घोल का pH परीक्षण करें।',
        'ପୋଖରୀ ପାଣି ଏବଂ ଲେମ୍ବୁ ରସର pH ମାନ ପରୀକ୍ଷା କରନ୍ତୁ।'
    ),
    (
        'bundle-math-01', 'farm-field-area-and-perimeter-mission', 'Mathematics', 7, 12, 100, 950,
        'Farm Field Area & Perimeter Slider Mission',
        'खेत का क्षेत्रफल और परिमाप मिशन (Farm Field Area & Perimeter)',
        'ଜମି କ୍ଷେତ୍ରଫଳ ଏବଂ ପରିସୀମା ମିଶନ (Farm Field Area & Perimeter)',
        'Drag interactive dimension sliders to calculate village agricultural plots and fencing requirements.',
        'इंटरैक्टिव स्लाइडर्स को खींचकर गांव के खेतों का क्षेत्रफल और बाड़ लगाने का खर्च निकालें।',
        'ଗାଁ ଜମିର କ୍ଷେତ୍ରଫଳ ଏବଂ ତାରବାଡ଼ ଖର୍ଚ୍ଚ ହିସାବ କରନ୍ତୁ।'
    ),
    (
        'bundle-bio-01', 'virtual-cell-organelles-explorer', 'Biology', 7, 18, 100, 1600,
        'Virtual Cell Organelles Explorer',
        'आभासी कोशिका अंगक अन्वेषक (Cell Organelles Explorer)',
        'ଭର୍ଚୁଆଲ କୋଷ ଅଙ୍ଗିକା ଅନୁସନ୍ଧାନ (Cell Organelles Explorer)',
        'Explore 3D interactive cross-sections of plant and animal cells.',
        'पादप और जंतु कोशिकाओं की 3D आंतरिक संरचनाओं का अन्वेषण करें।',
        'ଉଦ୍ଭିଦ ଏବଂ ପ୍ରାଣୀ କୋଷର 3D ଅଭ୍ୟନ୍ତରୀଣ ଗଠନ ଦେଖନ୍ତୁ।'
    )
ON CONFLICT (id) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_hi = EXCLUDED.title_hi,
    title_or = EXCLUDED.title_or,
    updated_at = NOW();
