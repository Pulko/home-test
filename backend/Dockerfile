FROM rust:latest
WORKDIR /app
COPY . .
EXPOSE 8000
RUN cargo build --release
CMD ["./target/release/apigen_api"]
