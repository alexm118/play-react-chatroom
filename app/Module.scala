import actors.RoomActor
import akka.actor.ActorSystem
import com.google.inject.AbstractModule
import dao.RoomDAO
import javax.inject.{Inject, Singleton}
import play.api.libs.concurrent.AkkaGuiceSupport

import scala.concurrent.ExecutionContext

class Module extends AbstractModule with AkkaGuiceSupport{
  override def configure(): Unit = {
    bind(classOf[RoomCreator]).asEagerSingleton
  }
}

@Singleton
class RoomCreator @Inject()(roomDAO: RoomDAO, system: ActorSystem)(implicit executionContext: ExecutionContext) {
  roomDAO.getAllRooms.map(_.foreach(room => {
    system.actorOf(RoomActor.props, room.name)
  }))
}