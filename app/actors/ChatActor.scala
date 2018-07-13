package actors

import akka.actor.{Actor, ActorRef, Props}
import play.api.Logger
import play.api.libs.json.JsValue

case class Register(room: ActorRef, userName: String)
case class LeaveRoom(userName: String)

object ChatActor {
  def props(out: ActorRef, room: ActorRef, userName: String) = Props(new ChatActor(out, room, userName))
}

class ChatActor(out: ActorRef, room: ActorRef, userName: String) extends Actor {

  override def preStart(): Unit = {
    super.preStart()
    self ! Register(room, userName)
  }

  override def postStop(): Unit = {
    Logger.info(s"$userName disconnecting, stopping actor")
    super.postStop()
    room ! LeaveRoom(userName)
  }

  override def receive: Receive = {
    case msg: JsValue => {
      Logger.info("Chat Actor Receive")
      room ! msg
    }
    case ChatMessage(msg) => out ! msg
    case Register(_, _) => room ! UserJoined(self, userName)
  }
}
