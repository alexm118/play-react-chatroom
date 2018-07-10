package controllers

import java.util.concurrent.TimeUnit

import javax.inject.Inject
import javax.inject.Singleton
import actors.ChatActor
import akka.actor.ActorSystem
import akka.stream.Materializer
import play.api.Logger
import play.api.libs.json.JsValue
import play.api.libs.streams.ActorFlow
import play.api.mvc.{AbstractController, ControllerComponents, WebSocket}

import scala.concurrent.ExecutionContext
import scala.concurrent.duration.FiniteDuration
@Singleton
class MessageController @Inject()(cc: ControllerComponents)(
    implicit system: ActorSystem,
    mat: Materializer,
    executionContext: ExecutionContext)
    extends AbstractController(cc) {

  def room(name: String): WebSocket =
    WebSocket.acceptOrResult[JsValue, JsValue] { _ =>
      {
        system
          .actorSelection(s"user/$name")
          .resolveOne(FiniteDuration.apply(5, TimeUnit.SECONDS))
          .map(
            roomActor =>
              Right(ActorFlow.actorRef(out => ChatActor.props(out, roomActor)))
          )
          .recover {
            case _: Throwable => {
              Logger.error(s"Room $name does not exist")
              Left(BadRequest("Invalid Room Name"))
            }
          }
      }
    }
}
