package actors

import akka.actor._
import akka.event.{EventBus, LookupClassification}
import play.api.Logger
import play.api.libs.json.JsValue

import scala.collection.mutable

case class Register(room: ActorRef)
case class ChatMessage(message: JsValue)

object RoomActor {
  def props = Props[RoomActor]
}

class RoomActor extends Actor {

  var chatActors = mutable.Set.empty[ActorRef]


  override def receive: Receive = {
    case msg: JsValue => {
      Logger.info("Room Actor Receive")
      chatActors.foreach(actor => actor ! ChatMessage(msg))
    }
    case actor: ActorRef => chatActors += actor
  }
}
