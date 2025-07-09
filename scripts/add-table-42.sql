-- Add the new table 42 to the database
-- Run this script to add table 42 to your database

INSERT INTO tables (id, name, category, pax, base_price, current_bid, highest_bidder_username, bidding_starts_at, bidding_ends_at) VALUES
('42', 'Table 42', 'Silver', '4-6', 3500, 3500, 'User20', '2024-01-20 18:00:00+05:30', '2024-01-20 23:00:00+05:30')
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
WHERE id = '42';
