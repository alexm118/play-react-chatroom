package controllers

import javax.inject.{Inject, Singleton}
import dao.{RoomDAO, UserDAO}
import models.{LoginRequest, User}
import play.api.Logger
import play.api.libs.json.{JsError, JsSuccess, JsValue, Json}
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import services.UserService

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class UserController @Inject()(cc: ControllerComponents,
                               userDao: UserDAO,
                               roomDao: RoomDAO,
                               userService: UserService)
                              (implicit executionContext: ExecutionContext) extends AbstractController(cc) {

  import converters.JsonConverters._

  def createUser: Action[JsValue] = Action.async(parse.json) { implicit request =>
    Logger.info("Attempting to Create User")
    request.body.validate[User] match {
      case JsSuccess(user, _) => {
        userService.createUser(user) collect {
          case Right(createdUser) => Ok(Json.toJson(createdUser))
          case Left(errorMessage) => BadRequest(errorMessage)
        }
      }
      case JsError(e) => Future.successful(BadRequest(JsError.toJson(e)))
    }
  }

  def login: Action[JsValue] = Action.async(parse.json) { implicit request =>
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

  def getUser(user_id: Int): Action[Unit] = Action.async(parse.empty) { implicit request =>
    userDao.getUser(user_id).map(user => Ok(Json.toJson(user)))
  }

  def getAllUsers: Action[Unit] = Action.async(parse.empty) { implicit request =>
    userDao.getAllUsers.map(users => Ok(Json.toJson(users)))
  }

  def getRoomsByUser(userId: Int): Action[Unit] = Action.async(parse.empty) { implicit request =>
    roomDao.getAllRoomsForUser(userId).map(rooms => Ok(Json.toJson(rooms)))
  }

  def deleteUser(user_id: Int): Action[Unit] = Action.async(parse.empty) { implicit  request =>
    userDao.deleteUser(user_id).map(response => {
      if(response){
        Ok(Json.toJson(s"Deleted $user_id"))
      } else {
        BadRequest(s"No user with id $user_id")
      }
    })
  }

}
