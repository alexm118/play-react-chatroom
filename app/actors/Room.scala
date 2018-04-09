package actors

import akka.actor._
import akka.event.{EventBus, LookupClassification}
import play.api.Logger
import play.api.libs.json.JsValue

import scala.collection.mutable

case class RoomMessage(room: String, message: JsValue)

class Room extends EventBus with LookupClassification {

  type Event = RoomMessage
  type Classifier = String
  type Subscriber = ActorRef

  // is used for extracting the classifier from the incoming events
  override protected def classify(event: Event): Classifier = event.room

  // will be invoked for each event for all subscribers which registered themselves
  // for the event’s classifier
  override protected def publish(event: Event, subscriber: Subscriber): Unit = {
    subscriber ! event.message
  }

  // must define a full order over the subscribers, expressed as expected from
  // `java.lang.Comparable.compare`
  override protected def compareSubscribers(a: Subscriber, b: Subscriber): Int =
    a.compareTo(b)

  // determines the initial size of the index data structure
  // used internally (i.e. the expected number of different classifiers)
  override protected def mapSize: Int = 128

}

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