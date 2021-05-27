
DELETE FROM activities WHERE id =$1 RETURNING id AS deleted_activity_id;