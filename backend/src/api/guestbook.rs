use axum::{extract::Path, extract::State, http::StatusCode, response::Json};
use diesel::prelude::*;
use diesel_async::RunQueryDsl;

use crate::schema::{guestbooks, users};
use crate::{internal_error, Pool};

use super::user::User;

#[derive(
    serde::Serialize, serde::Deserialize, Selectable, Queryable, AsChangeset, Identifiable, Debug,
)]
#[diesel(belongs_to(User))]
#[diesel(table_name = guestbooks)]
pub struct Guestbook {
    pub id: i32,
    pub message: String,
    pub user_id: i32,
}

#[derive(serde::Deserialize, Insertable)]
#[diesel(table_name = guestbooks)]
pub struct NewGuestbook {
    pub message: String,
    pub user_id: i32,
}

#[derive(serde::Deserialize)]
pub struct UpdateGuestbook {
    pub message: String,
    pub user_id: i32,
}

#[derive(serde::Deserialize, serde::Serialize)]
pub struct GuestbookWithUsername {
    pub id: i32,
    pub message: String,
    pub user_id: i32,
    pub username: String,
}

pub async fn create_guestbook(
    State(pool): State<Pool>,
    Json(new_guestbook): Json<NewGuestbook>,
) -> Result<Json<Guestbook>, (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;

    let res = diesel::insert_into(guestbooks::table)
        .values(&new_guestbook)
        .returning(Guestbook::as_returning())
        .get_result(&mut conn)
        .await
        .map_err(internal_error)?;
    Ok(Json(res))
}

pub async fn list_guestbooks_by_user(
    State(pool): State<Pool>,
    Path(user_id): Path<i32>,
) -> Result<Json<Vec<Guestbook>>, (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;

    let guestbooks = guestbooks::table
        .filter(guestbooks::user_id.eq(user_id))
        .select(Guestbook::as_select())
        .load(&mut conn)
        .await
        .map_err(internal_error)?;

    Ok(Json(guestbooks))
}

pub async fn list_guestbooks(
    State(pool): State<Pool>,
) -> Result<Json<Vec<GuestbookWithUsername>>, (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;

    let mut required_user_ids: Vec<i32> = vec![];

    let guestbooks = guestbooks::table
        .select(Guestbook::as_select())
        .load(&mut conn)
        .await
        .map(|guestbooks: Vec<Guestbook>| {
            required_user_ids.append(&mut guestbooks.iter().map(|g| g.user_id).collect());
            guestbooks
        })
        .map_err(internal_error)?;

    let users = users::table
        .filter(users::id.eq_any(required_user_ids.clone()))
        .select(User::as_select())
        .load(&mut conn)
        .await
        .map_err(internal_error)?;

    let guestbooks_with_username = guestbooks
        .into_iter()
        .map(|g| {
            let username = users
                .iter()
                .find(|u| u.id == g.user_id)
                .map(|u| u.username.clone())
                .unwrap_or(String::from("Not found"));

            GuestbookWithUsername {
                id: g.id,
                message: g.message,
                user_id: g.user_id,
                username,
            }
        })
        .collect();

    Ok(Json(guestbooks_with_username))
}

pub async fn delete_guestbook(
    State(pool): State<Pool>,
    Path(id): Path<i32>,
) -> Result<(), (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;

    diesel::delete(guestbooks::table.filter(guestbooks::id.eq(id)))
        .execute(&mut conn)
        .await
        .map_err(internal_error)?;

    Ok(())
}

pub async fn get_guestbook(
    State(pool): State<Pool>,
    Path(id): Path<i32>,
) -> Result<Json<GuestbookWithUsername>, (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;

    let guestbook = guestbooks::table
        .select(Guestbook::as_select())
        .filter(guestbooks::id.eq(id))
        .first(&mut conn)
        .await
        .map_err(internal_error)?;

    let user = users::table
        .select(User::as_select())
        .filter(users::id.eq(guestbook.user_id))
        .first(&mut conn)
        .await
        .map_err(internal_error)?;

    Ok(Json(GuestbookWithUsername {
        id: guestbook.id,
        message: guestbook.message,
        user_id: guestbook.user_id,
        username: user.username,
    }))
}

pub async fn update_guestbook(
    State(pool): State<Pool>,
    Path(id): Path<i32>,
    Json(update_guestbook): Json<UpdateGuestbook>,
) -> Result<Json<Guestbook>, (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;

    let users = users::table
        .select(User::as_select())
        .filter(users::id.eq(update_guestbook.user_id))
        .load(&mut conn)
        .await
        .map_err(internal_error)?;

    if users.is_empty() {
        return Err((
            StatusCode::NOT_FOUND,
            "User with this id is not found".to_string(),
        ));
    }

    let guestbook = diesel::update(guestbooks::table.filter(guestbooks::id.eq(id)))
        .set((
            guestbooks::message.eq(update_guestbook.message),
            guestbooks::user_id.eq(update_guestbook.user_id),
        ))
        .returning(Guestbook::as_returning())
        .get_result(&mut conn)
        .await
        .map_err(internal_error)?;

    Ok(Json(guestbook))
}
