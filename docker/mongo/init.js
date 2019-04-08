db.getSiblingDB('appdb').createUser({
	user: 'app-user',
	pwd: 'app-password',
	roles: [{ role: 'readWrite', db:'appdb'}]
});