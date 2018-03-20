package controllers

import javax.inject.{Inject, Singleton}

import dao.UserDAO
import models.User
import play.api.Logger
import play.api.libs.json.{JsError, JsSuccess, Json}
import play.api.mvc.{AbstractController, ControllerComponents}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class UserController @Inject()(cc: ControllerComponents,
                              userDao: UserDAO)
                              (implicit executionContext: ExecutionContext) extends AbstractController(cc) {

  import converters.JsonConverters._

  def createUser = Action.async(parse.json) { implicit request =>
    Logger.info("Attempting to Create User")
    request.body.validate[User] match {
      case JsSuccess(user, _) => {
        userDao.createUser(user) collect  {
          case Right(createdUser) => Ok(Json.toJson(createdUser))
          case Left(errorMessage) => BadRequest(errorMessage)
        }
      }
      case JsError(e) => Future.successful(BadRequest(JsError.toJson(e)))
    }
  }

}
