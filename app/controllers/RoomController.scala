package controllers

import javax.inject.Inject

import dao.RoomDAO
import models.{JoinRoomRequest, Room, RoomUser}
import play.api.Logger
import play.api.libs.json.{JsError, JsSuccess, Json}
import play.api.mvc.{AbstractController, ControllerComponents}

import scala.concurrent.{ExecutionContext, Future}

class RoomController @Inject()(cc: ControllerComponents,
                               roomDao: RoomDAO)
                              (implicit executionContext: ExecutionContext) extends AbstractController(cc) {

  import converters.JsonConverters._

  def createRoom = Action.async(parse.json) { implicit request =>
    Logger.info("Creating new room")
    request.body.validate[Room] match {
      case JsSuccess(room, _) => {
        roomDao.createRoom(room) collect {
          case Right(createdRoom) => Ok(Json.toJson(createdRoom))
          case Left(errorMessage) => BadRequest(errorMessage)
        }
      }
      case JsError(e) => Future.successful(BadRequest(JsError.toJson(e)))
    }
  }

  def getRoom(name: String) = Action.async(parse.empty) { implicit request =>
    roomDao.getRoomByName(name) collect {
      case Left(errorMessage) => BadRequest(errorMessage)
      case Right(room) => Ok(Json.toJson(room))
    }
  }

  def getAllRooms = Action.async(parse.empty) { implicit request =>
    roomDao.getAllRooms.map(rooms => Ok(Json.toJson(rooms)))
  }

  def joinRoom = Action.async(parse.json) { implicit request =>
    request.body.validate[JoinRoomRequest] match {
      case JsSuccess(joinRoomRequest, _) => {
        Logger.info(s"Joining room with parameters: $joinRoomRequest")
        roomDao.joinRoom(joinRoomRequest) collect {
          case Right(roomJoined) => Ok(Json.toJson(roomJoined))
          case Left(errorMessage) => BadRequest(errorMessage)
        }
      }
      case JsError(e) => Future.successful(BadRequest(JsError.toJson(e)))
    }
  }

}
