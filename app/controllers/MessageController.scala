package controllers

import javax.inject.Inject
import javax.inject.Singleton

import akka.actor.ActorSystem
import akka.stream.Materializer
import akka.stream.scaladsl.{BroadcastHub, Flow, Keep, MergeHub, Source}
import play.api.mvc.{AbstractController, ControllerComponents, WebSocket}

@Singleton
class MessageController @Inject()(cc: ControllerComponents)
                                 (implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {

  private val (chatSink, chatSource) = {

    val source = MergeHub.source[String]
      .recoverWithRetries(-1, { case _: Exception ⇒ Source.empty })

    val sink = BroadcastHub.sink[String]
    source.toMat(sink)(Keep.both).run()
  }

  private val userFlow: Flow[String, String, _] = {
    Flow[String].via(Flow.fromSinkAndSource(chatSink, chatSource))
  }

  def message: WebSocket = WebSocket.accept[String, String] { _ => userFlow }
}
