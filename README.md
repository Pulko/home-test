# Setup

1. Clone the repository
2. Run `docker compose up --build` to start the database container
3. Run `cd frontend && npm install` to install the dependencies on the ./frontend

.env:

```
API_URL=http://localhost:8000
```

4. Run `npm run dev` to start the frontend
5. In a separate terminal, run `cd backend && cargo install diesel_cli --no-default-features --features postgres` to install the diesel CLI (make sure [cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html) is installed as well)

.env:

```
DATABASE_URL=postgres://postgres:password@localhost/postgres
HOST=0.0.0.0
PORT=8000
RUST_LOG=all
```

6. Run `diesel migration run` to setup the database
7. Run `cargo run` to start the backend

# Design/Technical Decisions

1. **Frontend** I used Remix to build the frontend part of the application in order to match the full-stack with what Prisma uses. Tailwind is used on the frontend to style the components by default. The majority of styles is taken from free tamples of Tailwind components.

2. **Backend** I used Rust to build the API as this again is a part of the Prisma stack. This is based on my side-project that gave a nice boilerplate to start with: https://github.com/Pulko/apigen. Of course, I would love to use Prisma for Rust, but since the half of the solution was already implemented with help of my tool, I decided to use Diesel and bb8.

3. **Database** I used Postgres as the database as this is what Prisma uses by default.

# SSR

I haven't had any prior experience with Remix, so have just followed the official documentation to implement SSR. I have used the `loader` function to fetch the data from the backend and pass it to the component. Additionally, actions were used to sumbit the form.

SSR is great when it is needed, so, in this case, it was a good choice to use it. However, if there will be a need to add more interactive behaviour of the application, I would go to CSR for this particular part of the application.

# Database Schema

This I decided to keep simple. Identyfying the most obvious solutions to the task, I came up with the following schema (from migration files):

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL,
  email VARCHAR NOT NULL
);

CREATE TABLE guestbooks (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id)
);
```

# Complex SQL Query

There was a need to implement complex SQL queries in order to sometimes avoid overfetching the data and to not put the additional load on servers, not put additional logic to the frontend.

```sql
SELECT users.id, users.username, COUNT(guestbooks.id) AS guestbook_count
FROM users
LEFT JOIN guestbooks ON users.id = guestbooks.user_id
GROUP BY users.id
ORDER BY guestbook_count DESC
```

This query is used to get the list of users with the number of guestbooks they have. This is used on the main page to show the most active users. The same is used to get the user with the most guestbooks on the user details page, but with the `LIMIT` clause.

# Docker

I have attempted to dockerize the whole app, however, could not manage to adjust the network within different containers. To no waste more time I decided to proceed with a simpler solution and just use the docker-compose to start the database + running the rest locally.

# Enhancements

1. **Developer Experience** as mentioned in Docker section, the way this application is running could be improved
2. **Pagination** for the guestbooks list and user lists it is needed to implement pagination in order to not overload the frontend with the data and reduce the payload size
3. **Tests** there are no tests in the application, so it is needed to add them. I would start with testing the API first and then move to the frontend, testing how components are rendering and how forms are submitting. Increasing the scope of the tests, it would be great to have a separate tsting environment where all the functionality of the application could be tested altogether ensuring proper integration:
   - API tests
   - Frontend tests
   - E2E tests:
     - User create
     - User update
     - User delete
     - Guestbook create
     - Guestbook update
     - Guestbook delete
4. **Caching** it is needed to implement caching on the frontend and backend in order to reduce the load on the servers and improve the performance of the application
