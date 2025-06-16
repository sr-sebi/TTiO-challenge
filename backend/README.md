# TTiO technical test - Backend

## Dependencies

- NodeJs
- TypeScript
- Express
- Morgan - To allow server logging
- Socket.io
- Prisma - For database ORM

## Running database with docker
```bash
$ docker-compose -f db/development_db.yml up -d 
```

## Generate primsa client
```bash
$ npx prisma generate  
```

## Execute Prisma migrations
```bash
$ npx prisma migrate dev --name init
```

## To seed the database
```bash
$ npm run seed
```