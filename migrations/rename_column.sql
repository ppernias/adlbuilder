-- Rename the column from encrypted_api_key to api_key
ALTER TABLE openaiconfig RENAME COLUMN encrypted_api_key TO api_key;
