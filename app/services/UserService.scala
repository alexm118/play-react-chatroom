package services

import javax.inject.Inject

import dao.{RoomDAO, UserDAO}
import models.{JoinRoomRequest, User}
import play.api.Logger

import scala.concurrent.{ExecutionContext, Future}

class UserService @Inject()(userDAO: UserDAO, roomDAO: RoomDAO)(
    implicit executionContext: ExecutionContext) {

  private def joinDefaultRooms(userId: Int): Future[Boolean] = {
    val generalJoinRequest = JoinRoomRequest(userId, "general")
    val randomJoinRequest = JoinRoomRequest(userId, "random")
    for {
      generalResult <- roomDAO.joinRoom(generalJoinRequest)
      randomResult <- roomDAO.joinRoom(randomJoinRequest)
    } yield {
      generalResult.isRight && randomResult.isRight
    }
  }

  private def handleJoiningDefaultRooms(userResult: Option[User]) = {
    userResult match {
      case Some(user) => joinDefaultRooms(user.user_id.getOrElse(-1))
      case _          => Logger.info("Failed to create user, not joining default rooms")
    }
  }

  def createUser(user: User): Future[Either[String, User]] = {
    for {
      userResult <- userDAO.createUser(user)
    } yield {
      handleJoiningDefaultRooms(userResult.right.toOption)
      userResult
    }
  }

}
