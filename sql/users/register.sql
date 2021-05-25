INSERT INTO users(email, passkey, client_name) VALUES($1, $2, $3) RETURNING id;
