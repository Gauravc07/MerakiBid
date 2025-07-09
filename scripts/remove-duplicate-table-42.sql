-- Remove any duplicate table 42 entries if they exist
-- This ensures only one table 42 exists in the database

-- First, check if there are multiple table 42 entries
SELECT id, name, created_at FROM tables WHERE id = '42' ORDER BY created_at;

-- Keep only the first table 42 and remove any duplicates
-- (This is a safety measure in case duplicates were created)
DELETE FROM tables 
WHERE id = '42' 
AND created_at NOT IN (
  SELECT MIN(created_at) 
  FROM tables 
  WHERE id = '42'
);

-- Verify only one table 42 exists
SELECT id, name, category, pax, current_bid, highest_bidder_username 
FROM tables 
WHERE id = '42';
