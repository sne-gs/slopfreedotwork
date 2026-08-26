INSERT INTO users (email, password_hash, role, email_verified) VALUES
('dev@email.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'recruiter', 1),
('applicant@email.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'applicant', 1);

INSERT INTO companies (owner_id, name, slug, logo_url, primary_color, secondary_color, contact_email, website, description) VALUES
(1, 'Datastar Systems', 'datastar', '/static/datastar-logo.svg', 'oklch(55% 0.17 255)', 'oklch(62% 0.08 245)', 'hire@datastar.dev', 'https://datastar.dev', 'Building the future of data infrastructure.');

INSERT INTO applicants (user_id, full_name, headline, bio, resume_url) VALUES
(2, 'Jane Doe', 'Senior Frontend Engineer', 'Building slop-free interfaces.', '/resumes/jane-doe.pdf');

INSERT INTO jobs (company_id, title, slug, description, location, job_type, salary_range, status) VALUES
(1, 'Senior Frontend Engineer', 'senior-frontend-engineer', 'Build core platform.', 'Remote // UTC+8', 'Full-time', '$140K–$180K', 'active'),
(1, 'Product Designer', 'product-designer', 'Design systemic interfaces.', 'Berlin', 'Contract', '€70K–€90K', 'active'),
(1, 'ML Infrastructure Engineer', 'ml-infrastructure-engineer', 'Scale ML pipelines.', 'Remote // UTC-5', 'Full-time', '$160K–$210K', 'active');

INSERT INTO applications (job_id, applicant_id, status) VALUES
(1, 2, 'submitted');

INSERT INTO blog_posts (company_id, title, slug, content, excerpt, is_published, published_at) VALUES
(1, 'Why we hate AI slop', 'why-we-hate-ai-slop', 'Real talk about quality.', 'A manifesto.', 1, CURRENT_TIMESTAMP);

INSERT INTO job_alerts (user_id, name, criteria, is_active) VALUES
(2, 'Remote Frontend', '{"location": "Remote", "job_type": "Full-time"}', 1);

INSERT INTO activity_feed (entity_type, entity_id, title, link) VALUES
('company', 1, 'Datastar Systems joined the network', '/companies/datastar'),
('job', 1, 'New role: Senior Frontend Engineer', '/jobs/senior-frontend-engineer'),
('blog_post', 1, 'New post: Why we hate AI slop', '/companies/datastar/blog/why-we-hate-ai-slop');
