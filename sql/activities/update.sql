UPDATE activities SET
action = $1,
description = $2,
date = $3,
time = $4
WHERE id = $5 RETURNING *;