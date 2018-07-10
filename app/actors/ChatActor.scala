package actors

import akka.actor.{Actor, ActorRef, Props}
import play.api.Logger
import play.api.libs.json.JsValue

object ChatActor {
  def props(out: ActorRef, room: ActorRef) = Props(new ChatActor(out, room))
}

class ChatActor(out: ActorRef, room: ActorRef) extends Actor {

  override def preStart(): Unit = {
    super.preStart()
    self ! Register(room)
  }

  override def receive: Receive = {
    case msg: JsValue => {
      Logger.info("Chat Actor Receive")
      room ! msg
    }
    case ChatMessage(msg) => out ! msg
    case Register(_) => room ! self
  }
}
