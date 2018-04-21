package models

case class User(user_id: Option[Int], username: String, password: String, firstname: String, lastname: String, email: String)
case class Room(room_id: Option[Int] = None, name: String = "")
case class RoomUser(room_id: Int, user_id: Int)
case class LoginRequest(username: String, password: String)
case class JoinRoomRequest(user_id: Int, room_name: String)
