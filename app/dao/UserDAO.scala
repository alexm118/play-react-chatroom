package dao

import javax.inject.Inject

import models.User
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}

class UserDAO @Inject() (protected val dbConfigProvider: DatabaseConfigProvider)
                        (implicit executionContext: ExecutionContext) extends HasDatabaseConfigProvider[JdbcProfile]{

  import profile.api._

  private val Users = TableQuery[UserTable]

  def createUser(user: User): Future[Either[String, User]] = {
    val userCheck: Future[Seq[User]] = db.run(Users.filter(item => item.username === user.username || item.email === user.email).result)
    userCheck collect {
      case Seq() => {
        db.run(Users += user)
        Right(user)
      }
      case _ => {
        Left("Error username or email already exists.")
      }
    }
  }

  import profile.api._

  private class UserTable(tag: Tag) extends Table[User](tag, "USERS"){
    def username = column[String]("username")
    def password = column[String]("password")
    def firstname = column[String]("firstname")
    def lastname = column[String]("lastname")
    def email = column[String]("email")
    def * = (username, password, firstname, lastname, email) <> (User.tupled, User.unapply)
  }

}
