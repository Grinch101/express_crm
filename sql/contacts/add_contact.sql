INSERT INTO contacts(user_id, firstname, lastname, email, phonenumber)
 VALUES($1, $2, $3, $4, $5) RETURNING *;