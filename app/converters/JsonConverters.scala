package converters

import models.{LoginRequest, User}
import play.api.libs.json.Json

object JsonConverters {

  implicit def userFormat = Json.format[User]
  implicit def loginRequestFormat = Json.format[LoginRequest]

}
