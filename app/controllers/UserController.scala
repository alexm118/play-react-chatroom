package controllers

import javax.inject.{Inject, Singleton}

import dao.{RoomDAO, UserDAO}
import models.{LoginRequest, User}
import play.api.Logger
import play.api.libs.json.{JsError, JsSuccess, Json}
import play.api.mvc.{AbstractController, ControllerComponents}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class UserController @Inject()(cc: ControllerComponents,
                               userDao: UserDAO,
                               roomDao: RoomDAO)
                              (implicit executionContext: ExecutionContext) extends AbstractController(cc) {

  import converters.JsonConverters._

  def createUser = Action.async(parse.json) { implicit request =>
    Logger.info("Attempting to Create User")
    request.body.validate[User] match {
      case JsSuccess(user, _) => {
        userDao.createUser(user) collect {
          case Right(createdUser) => Ok(Json.toJson(createdUser))
          case Left(errorMessage) => BadRequest(errorMessage)
        }
      }
      case JsError(e) => Future.successful(BadRequest(JsError.toJson(e)))
    }
  }

  def login = Action.async(parse.json) { implicit request =>
    request.body.validate[LoginRequest] match {
      case JsSuccess(login, _) => {
        userDao.login(login) collect {
          case Right(user) => Ok(Json.toJson(user))
          case _ => Unauthorized(Json.toJson("Unauthorized Access"))
        }
      }
      case JsError(e) => Future.successful(BadRequest(JsError.toJson(e)))
    }
  }

  def getUserByName(name: String) = Action.async(parse.empty) { implicit request =>
    userDao.getUserByName(name).map(user => Ok(Json.toJson(user)))
  }

  def getAllUsers = Action.async(parse.empty) { implicit request =>
    userDao.getAllUsers.map(users => Ok(Json.toJson(users)))
  }

  def getRoomsByUser(userId: Int) = Action.async(parse.empty) { implicit request =>
    roomDao.getAllRoomsForUser(userId).map(rooms => Ok(Json.toJson(rooms)))
  }

}
