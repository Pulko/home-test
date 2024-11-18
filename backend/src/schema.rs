// @generated automatically by Diesel CLI.

diesel::table! {
    guestbooks (id) {
        id -> Int4,
        message -> Text,
        user_id -> Int4,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        username -> Varchar,
        email -> Varchar,
    }
}

diesel::joinable!(guestbooks -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    guestbooks,
    users,
);
