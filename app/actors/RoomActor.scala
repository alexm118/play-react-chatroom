package actors

import akka.actor._
import akka.event.{EventBus, LookupClassification}
import play.api.Logger
import play.api.libs.json.JsValue

import scala.collection.mutable

case class ChatMessage(message: JsValue)
case class UserJoined(chatActor: ActorRef, userName: String)
case class GetUsers()

object RoomActor {
  def props = Props[RoomActor]
}

class RoomActor extends Actor {

  var chatActors = mutable.Set.empty[ActorRef]
  var connectedUsers = mutable.Set.empty[String]

  override def receive: Receive = {
    case msg: JsValue => {
      Logger.info("Room Actor Receive")
      chatActors.foreach(actor => actor ! ChatMessage(msg))
    }
    case UserJoined(actor, userName) => {
      chatActors += actor
      connectedUsers += userName
    }
    case GetUsers() => {
      sender ! connectedUsers
    }
    case LeaveRoom(userName) => {
      Logger.info(s"Removing $userName from list of connected users")
      connectedUsers.remove(userName)
    }
  }
}
