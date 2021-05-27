INSERT INTO activities(action, description, date, time, contact_id, user_id) 
VALUES($1, $2, $3, $4, $5, $6) RETURNING id;