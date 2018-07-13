package controllers

import java.util.concurrent.TimeUnit

import javax.inject.Inject
import javax.inject.Singleton
import actors.{ChatActor, GetUsers}
import akka.actor.ActorSystem
import akka.stream.Materializer
import akka.pattern.ask
import akka.util.Timeout
import play.api.Logger
import play.api.libs.json.{JsValue, Json}
import play.api.libs.streams.ActorFlow
import play.api.mvc.{AbstractController, Action, ControllerComponents, WebSocket}

import scala.collection.mutable
import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

@Singleton
class MessageController @Inject()(cc: ControllerComponents)(
    implicit system: ActorSystem,
    mat: Materializer,
    executionContext: ExecutionContext)
    extends AbstractController(cc) {

  implicit val timeout = Timeout(5 seconds)

  def room(name: String, userName: String): WebSocket =
    WebSocket.acceptOrResult[JsValue, JsValue] { _ =>
      {
        system
          .actorSelection(s"user/$name")
          .resolveOne(FiniteDuration.apply(5, TimeUnit.SECONDS))
          .map(
            roomActor =>
              Right(ActorFlow.actorRef(out =>
                ChatActor.props(out, roomActor, userName)))
          )
          .recover {
            case _: Throwable => {
              Logger.error(s"Room $name does not exist")
              Left(BadRequest("Invalid Room Name"))
            }
          }
      }
    }

  def getUsersInRoom(room: String) =
    Action.async(parse.empty) { implicit request =>
      system
        .actorSelection(s"user/$room")
        .resolveOne(FiniteDuration.apply(5, TimeUnit.SECONDS))
        .flatMap(roomActor => (roomActor ? GetUsers()).mapTo[mutable.Set[String]])
        .map(users => Ok(Json.toJson(users)))
        .recover {
          case t: Throwable => {
            Logger.error(s"Error getting users for $room", t)
            InternalServerError("Error getting users")
          }
        }
    }

}
