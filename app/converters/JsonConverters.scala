package converters

import models._
import play.api.libs.json.Json

object JsonConverters {

  implicit def userFormat = Json.format[User]
  implicit def roomFormat = Json.format[Room]
  implicit def roomUserFormat = Json.format[RoomUser]
  implicit def loginRequestFormat = Json.format[LoginRequest]
  implicit def JoinRoomRequestFormat = Json.format[JoinRoomRequest]

}
