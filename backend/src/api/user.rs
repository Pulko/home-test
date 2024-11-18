use std::str;

use axum::{extract::Path, extract::State, http::StatusCode, response::Json};
use diesel::prelude::*;
use diesel_async::RunQueryDsl;

use crate::schema::{guestbooks, users};
use crate::{internal_error, Pool};

use super::guestbook::Guestbook;

#[derive(serde::Serialize, Selectable, Queryable, AsChangeset, Identifiable, Debug)]
#[diesel(table_name = users)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
}

#[derive(serde::Deserialize, Insertable)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub username: String,
    pub email: String,
}

#[derive(serde::Deserialize)]
pub struct UpdateUser {
    pub username: String,
    pub email: String,
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct UserWithGuestbooks {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub guestbooks: Vec<Guestbook>,
}

#[derive(serde::Deserialize, serde::Serialize, QueryableByName)]
#[diesel(table_name = users)]
pub struct UserWithGuestbookCount {
    #[diesel(sql_type = diesel::sql_types::Integer)]
    pub id: i32,
    #[diesel(sql_type = diesel::sql_types::Text)]
    pub username: String,
    #[diesel(sql_type = diesel::sql_types::BigInt)]
    pub guestbook_count: i64,
}

pub async fn create_user(
    State(pool): State<Pool>,
    Json(new_user): Json<NewUser>,
) -> Result<Json<User>, (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;

    let res = diesel::insert_into(users::table)
        .values(&new_user)
        .returning(User::as_returning())
        .get_result(&mut conn)
        .await
        .map_err(internal_error)?;

    Ok(Json(res))
}

pub async fn user_with_guestbooks(
    State(pool): State<Pool>,
    Path(id): Path<i32>,
) -> Result<Json<UserWithGuestbooks>, (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;

    let user: User = users::table
        .select(User::as_select())
        .filter(users::id.eq(id))
        .first(&mut conn)
        .await
        .map_err(internal_error)?;

    let guestbooks = guestbooks::table
        .select(Guestbook::as_select())
        .filter(guestbooks::user_id.eq(id))
        .load(&mut conn)
        .await
        .map_err(internal_error)?;

    Ok(Json(UserWithGuestbooks {
        id: user.id,
        username: user.username,
        email: user.email,
        guestbooks,
    }))
}

pub async fn user_with_most_guestbooks(
    State(pool): State<Pool>,
) -> Result<Json<Vec<UserWithGuestbookCount>>, (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;

    let query = diesel::sql_query(
        "SELECT users.id, users.username, COUNT(guestbooks.id) AS guestbook_count
         FROM users
         LEFT JOIN guestbooks ON users.id = guestbooks.user_id
         GROUP BY users.id
         ORDER BY guestbook_count DESC
         LIMIT 1",
    );

    let results: Vec<UserWithGuestbookCount> =
        query.load(&mut conn).await.map_err(internal_error)?;

    Ok(Json(results))
}

pub async fn list_users_with_guestbook_counts(
    State(pool): State<Pool>,
) -> Result<Json<Vec<UserWithGuestbookCount>>, (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;

    let query = diesel::sql_query(
        "SELECT users.id, users.username, COUNT(guestbooks.id) AS guestbook_count
         FROM users
         LEFT JOIN guestbooks ON users.id = guestbooks.user_id
         GROUP BY users.id
         ORDER BY guestbook_count DESC",
    );

    let results: Vec<UserWithGuestbookCount> =
        query.load(&mut conn).await.map_err(internal_error)?;

    Ok(Json(results))
}

pub async fn delete_user(
    State(pool): State<Pool>,
    Path(id): Path<i32>,
) -> Result<(), (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;
    diesel::delete(guestbooks::table.filter(guestbooks::user_id.eq(id)))
        .execute(&mut conn)
        .await
        .map_err(internal_error)?;

    diesel::delete(users::table.filter(users::id.eq(id)))
        .execute(&mut conn)
        .await
        .map_err(internal_error)?;

    Ok(())
}

pub async fn update_user(
    State(pool): State<Pool>,
    Path(id): Path<i32>,
    Json(update_user): Json<UpdateUser>,
) -> Result<Json<User>, (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;

    let res = diesel::update(users::table.filter(users::id.eq(id)))
        .set((
            users::username.eq(update_user.username),
            users::email.eq(update_user.email),
        ))
        .returning(User::as_returning())
        .get_result(&mut conn)
        .await
        .map_err(internal_error)?;

    Ok(Json(res))
}
