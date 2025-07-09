-- Add the new table 47/48 to the database
-- Run this script to add table 47/48 to your database

INSERT INTO tables (id, name, category, pax, base_price, current_bid, highest_bidder_username, bidding_starts_at, bidding_ends_at) VALUES
('47/48', 'Platinum 47/48', 'Platinum', '10-13', 10000, 10000, 'User10', '2024-01-20 18:00:00+05:30', '2024-01-20 23:00:00+05:30')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  pax = EXCLUDED.pax,
  base_price = EXCLUDED.base_price,
  current_bid = EXCLUDED.current_bid,
  highest_bidder_username = EXCLUDED.highest_bidder_username,
  bidding_starts_at = EXCLUDED.bidding_starts_at,
  bidding_ends_at = EXCLUDED.bidding_ends_at;

-- Verify the table was added
SELECT id, name, category, pax, base_price, current_bid, highest_bidder_username 
FROM tables 
WHERE id = '47/48';

-- Show all platinum tables
SELECT id, name, category, pax, base_price, current_bid 
FROM tables 
WHERE category = 'Platinum' 
ORDER BY id;
