import os
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

# Configure application
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
# app.secret_key = "your_secret_key"  # Add a secret key for session encryption
Session(app)

# Set up the SQLite database
from cs50 import SQL

db = SQL("sqlite:////Users/meerhusamuddin/book-finder/book-finder.db")


@app.route("/")
def index():
    if "user_id" in session:
        # Retrieve the id of the current user
        user_id = session["user_id"]
        return jsonify({"user_id": user_id}), 200
    else:
        return jsonify({"error": "Not logged in"}), 403


@app.route("/getwishlist")
def getWishlist():
    user = session.get("id")
    # Check if the user is logged in
    if user is None:
        return (
            jsonify({"error": "User not logged in"}),
            401,
        )  # HTTP status code 401 means Unauthorized

    rows = db.execute("SELECT book_id FROM wishlist WHERE user = ?", user)
    book_ids = [row["book_id"] for row in rows]
    return jsonify(book_ids)


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    # Ensure username was submitted
    if not data.get("username"):
        return jsonify({"error": "Must provide username"}), 403

    # Ensure password was submitted
    elif not data.get("password"):
        return jsonify({"error": "Must provide password"}), 403

    # Query database for username
    rows = db.execute("SELECT * FROM users WHERE username = ?", data.get("username"))

    # Ensure username exists and password is correct
    if len(rows) != 1 or not check_password_hash(rows[0]["hash"], data.get("password")):
        return jsonify({"error": "Invalid username and/or password"}), 403
    # else:
    #     return jsonify({"message": "logged in"}), 200
    # Remember which user has logged in
    session["user_id"] = rows[0]["id"]

    # Return user id
    return jsonify({"user_id": rows[0]["id"]}), 200


@app.route("/logout")
def logout():
    # Forget any user_id
    session.clear()

    return jsonify({"message": "Logged out successfully"}), 200


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    # If username was missing
    if not data.get("username"):
        return jsonify({"error": "Must provide username"}), 400

    # If password was missing
    elif not data.get("password"):
        return jsonify({"error": "Must provide password"}), 400

    # If confirmation was missing or confirmation doesn't match
    elif not data.get("confirmation") or data.get("password") != data.get(
        "confirmation"
    ):
        return jsonify({"error": "The two passwords do not match"}), 400

    print(data.get("username"))
    # Check if the username already exists
    rows = db.execute("SELECT * FROM users WHERE username = ?", data.get("username"))
    if len(rows) > 0:
        return jsonify({"error": "This username is already taken"}), 400

    # All credentials are inputted correctly, so insert the new user into the database
    username = data.get("username")
    password = data.get("password")

    # Hash the password
    method = "pbkdf2:sha256"
    salt_length = 8
    hashed_password = generate_password_hash(
        password, method=method, salt_length=salt_length
    )

    # Insert the user into the database
    db.execute(
        "INSERT INTO users (username, hash) VALUES (?, ?)", username, hashed_password
    )

    # Return a success message
    return jsonify({"message": "User registered successfully"}), 200


@app.route("/wishlist")
def wishlist():
    data = request.get_json()
    book_id = data.get("id")
    user = session.get(
        "id"
    )  # Use .get to avoid KeyError if the id is not in the session

    # Check if the user is logged in
    if user is None:
        return (
            jsonify({"error": "User not logged in"}),
            401,
        )  # HTTP status code 401 means Unauthorized

    # Check if the book is already in the wishlist
    rows = db.execute(
        "SELECT * FROM wishlist WHERE id = ? AND bookid = ?", (user, book_id)
    )

    # Assuming db.execute returns a list of rows, we can check if the list is empty to determine if the book is in the wishlist
    if rows:
        return (
            jsonify({"error": "Book already in wishlist"}),
            409,
        )  # HTTP status code 409 means Conflict

    # Add the book to the wishlist
    db.execute("INSERT into wishlist(user, book_id) VALUES(?, ?)", user, book_id)
    db.commit()
    return (
        jsonify({"message": "Book added to wishlist"}),
        200,
    )


if __name__ == "__main__":
    app.run(debug=True)
