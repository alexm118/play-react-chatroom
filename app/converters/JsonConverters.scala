package converters

import models.User
import play.api.libs.json.Json

object JsonConverters {

  implicit def userFormat = Json.format[User]

}
