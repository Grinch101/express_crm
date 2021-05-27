INSERT INTO contacts(firstname, lastname, email, phonenumber, user_id)
 VALUES($1, $2, $3, $4, $5) RETURNING *;