package controllers

import javax.inject.Inject
import javax.inject.Singleton

import akka.actor.ActorSystem
import akka.stream.Materializer
import akka.stream.scaladsl.{BroadcastHub, Flow, Keep, MergeHub, Source}
import play.api.libs.json.JsValue
import play.api.mvc.{AbstractController, ControllerComponents, WebSocket}

@Singleton
class MessageController @Inject()(cc: ControllerComponents)
                                 (implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {

  private val (chatSink, chatSource) = {

    val source = MergeHub.source[JsValue]
      .recoverWithRetries(-1, { case _: Exception ⇒ Source.empty })

    val sink = BroadcastHub.sink[JsValue]
    source.toMat(sink)(Keep.both).run()
  }

  private val userFlow: Flow[JsValue, JsValue, _] = {
    Flow[JsValue].via(Flow.fromSinkAndSource(chatSink, chatSource))
  }

  def message: WebSocket = WebSocket.accept[JsValue, JsValue] { _ => userFlow }
}
