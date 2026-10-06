ALTER TABLE "blogs" ALTER COLUMN "content" TYPE JSONB USING to_jsonb("content");
ALTER TABLE "projects" ALTER COLUMN "description" TYPE JSONB USING to_jsonb("description");
ALTER TABLE "projects" ALTER COLUMN "longDescription" TYPE JSONB USING CASE WHEN "longDescription" IS NULL THEN NULL ELSE to_jsonb("longDescription") END;
ALTER TABLE "experiences" ALTER COLUMN "description" TYPE JSONB USING to_jsonb("description");
ALTER TABLE "educations" ALTER COLUMN "description" TYPE JSONB USING to_jsonb("description");
