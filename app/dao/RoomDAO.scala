package dao

import javax.inject.Inject

import models.{JoinRoomRequest, Room, RoomUser}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}

class RoomDAO @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)
              (implicit executionContext: ExecutionContext) extends HasDatabaseConfigProvider[JdbcProfile]{

  import profile.api._

  private val Rooms = TableQuery[RoomTable]
  private val RoomUsers = TableQuery[RoomUserTable]


  def createRoom(room: Room): Future[Either[String, Room]] = {
    val roomNameAvailable = db.run(Rooms.filter(item => item.name === room.name).result)
    roomNameAvailable collect {
      case Seq() => {
        db.run(Rooms += room)
        Right(room)
      }
      case _ => Left("Error: Room name already exists")
    }
  }

  def getRoomByName(name: String): Future[Either[String, Room]] = {
    val query = Rooms.filter(_.name === name)
    val action = query.result
    val result = db.run(action)
    result collect {
      case list if list.seq.isEmpty => Left("Error room does not exist")
      case list if list.seq.nonEmpty => Right(list.head)
    }
  }

  def getAllRooms: Future[Seq[Room]] = db.run(Rooms.result)

  def joinRoom(joinRoomRequest: JoinRoomRequest): Future[Either[String, RoomUser]] = {
    getRoomByName(joinRoomRequest.room_name).collect {
      case Left(error) => Left(error)
      case Right(room) => {
        val roomUser = RoomUser(room.room_id.getOrElse(-1), joinRoomRequest.user_id)
        db.run(RoomUsers += roomUser)
        Right(roomUser)
      }
    }
  }

  def getAllRoomsForUser(user_id: Int): Future[Seq[Room]] = {
    val rooms = for {
      (roomusers, rooms) <- RoomUsers.filter(roomuser => roomuser.user_id === user_id) joinLeft Rooms on (_.room_id === _.room_id)
    } yield rooms
    db.run(rooms.result).map(rooms => rooms.flatten)
  }

  private class RoomTable(tag: Tag) extends Table[Room](tag, "room"){
    def room_id = column[Int]("room_id", O.PrimaryKey, O.AutoInc)
    def name = column[String]("name")
    def * = (room_id.?, name) <> (Room.tupled, Room.unapply)
  }

  private class RoomUserTable(tag: Tag) extends Table[RoomUser](tag, "room_user"){
    def room_id = column[Int]("room_id")
    def user_id = column[Int]("user_id")
    def * = (room_id, user_id) <> (RoomUser.tupled, RoomUser.unapply)
  }

}
