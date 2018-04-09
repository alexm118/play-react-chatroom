package controllers

import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

import actors.{ChatActor, Room, RoomActor}
import akka.actor.{ActorRef, ActorSystem}
import akka.stream.Materializer
import akka.stream.scaladsl.{BroadcastHub, Flow, Keep, MergeHub, Source}
import play.api.libs.json.JsValue
import play.api.libs.streams.ActorFlow
import play.api.mvc.{AbstractController, ControllerComponents, WebSocket}

import scala.concurrent.{Await, ExecutionContext}
import scala.concurrent.duration.{Duration, FiniteDuration}
import scala.util.{Failure, Success}


@Singleton
class MessageController @Inject()(cc: ControllerComponents, room: Room)
                                 (implicit system: ActorSystem,
                                  mat: Materializer, executionContext: ExecutionContext) extends AbstractController(cc) {

  private val (chatSink, chatSource) = {

    val source = MergeHub.source[JsValue]
      .recoverWithRetries(-1, { case _: Exception ⇒ Source.empty })

    val sink = BroadcastHub.sink[JsValue]
    source.toMat(sink)(Keep.both).run()
  }

  private val chatFlow: Flow[JsValue, JsValue, _] = {
    Flow[JsValue].via(Flow.fromSinkAndSource(chatSink, chatSource))
  }


  def message: WebSocket = WebSocket.accept[JsValue, JsValue] { _ => chatFlow }

  def room(name: String): WebSocket = WebSocket.accept[JsValue, JsValue] { _ => {
    var roomActor: ActorRef = null
    try {
      roomActor = system.actorOf(RoomActor.props, name)
    } catch {
      case _ => val future = system.actorSelection(s"user/$name").resolveOne(FiniteDuration.apply(5, TimeUnit.SECONDS))
        future.onComplete {
          case Success(actor) => roomActor = actor
          case Failure(_) => roomActor = system.actorOf(RoomActor.props, name)
        }
        Await.result(future, Duration.Inf)
    }

    ActorFlow.actorRef(out => ChatActor.props(out, roomActor))
  }
  }

}
