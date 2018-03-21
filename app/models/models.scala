package models

case class User(username: String, password: String, firstname: String, lastname: String, email: String)
case class LoginRequest(username: String, password: String)
