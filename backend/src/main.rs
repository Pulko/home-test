use axum::{
    http::{HeaderValue, Method, StatusCode},
    routing::{delete, get, post, put},
    Router,
};
use diesel_async::{pooled_connection::AsyncDieselConnectionManager, AsyncPgConnection};
use dotenv::dotenv;
use std::env;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod api;
mod schema;

type Pool = bb8::Pool<AsyncDieselConnectionManager<AsyncPgConnection>>;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let host = env::var("HOST").expect("HOST is missing in environment variables");
    let port = env::var("PORT").expect("PORT is missing in environment variables");
    let database_url =
        env::var("DATABASE_URL").expect("DATABASE_URL is missing in environment variables");

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = AsyncDieselConnectionManager::<diesel_async::AsyncPgConnection>::new(database_url);
    let pool = bb8::Pool::builder().build(config).await.unwrap();

    println!("Listening on http://{}:{}", host, port);

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST, Method::DELETE, Method::PUT])
        .allow_headers(Any);

    let app = Router::new()
        .route("/users", get(api::user::list_users_with_guestbook_counts))
        .route("/users/:id", get(api::user::user_with_guestbooks))
        .route("/users", post(api::user::create_user))
        .route("/users/most", get(api::user::user_with_most_guestbooks))
        .route("/users/:id", delete(api::user::delete_user))
        .route("/users/:id", put(api::user::update_user))
        .route("/guestbooks", get(api::guestbook::list_guestbooks))
        .route(
            "/users/:user_id/guestbooks",
            get(api::guestbook::list_guestbooks_by_user),
        )
        .route("/guestbooks", post(api::guestbook::create_guestbook))
        .route("/guestbooks/:id", delete(api::guestbook::delete_guestbook))
        .route("/guestbooks/:id", get(api::guestbook::get_guestbook))
        .route("/guestbooks/:id", put(api::guestbook::update_guestbook))
        .layer(cors)
        .with_state(pool);

    let addr = format!("{}:{}", host, port);

    tracing::debug!("Started on {addr}");
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

pub fn internal_error<E>(err: E) -> (StatusCode, String)
where
    E: std::error::Error,
{
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}
