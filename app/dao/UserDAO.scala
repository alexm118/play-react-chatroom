package dao

import javax.inject.Inject

import models.{LoginRequest, User}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}

class UserDAO @Inject() (protected val dbConfigProvider: DatabaseConfigProvider)
                        (implicit executionContext: ExecutionContext) extends HasDatabaseConfigProvider[JdbcProfile]{

  import profile.api._

  private val Users = TableQuery[UserTable]

  def createUser(user: User): Future[Either[String, User]] = {
    val userCheck: Future[Seq[User]] = db.run(Users.filter(item => {
      item.username === user.username || item.email === user.email
    }).result)
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

  def login(loginRequest: LoginRequest): Future[Either[String, User]] = {
    val loginSuccess: Future[Seq[User]] = db.run(Users.filter(user => {
      user.username === loginRequest.username && user.password === loginRequest.password
    }).result)
    loginSuccess.collect{
      case loginResult if loginResult.nonEmpty => Right(loginResult.head)
      case _ => Left("Unauthorized Request")
    }
  }

  def getUserByName(name: String): Future[Seq[User]] = db.run(Users.filter(user => user.username === name).result)

  def getAllUsers: Future[Seq[User]] = db.run(Users.result)

  private class UserTable(tag: Tag) extends Table[User](tag, "USERS"){
    def user_id = column[Int]("user_id", O.PrimaryKey, O.AutoInc)
    def username = column[String]("username")
    def password = column[String]("password")
    def firstname = column[String]("firstname")
    def lastname = column[String]("lastname")
    def email = column[String]("email")
    def * = (user_id.?, username, password, firstname, lastname, email) <> (User.tupled, User.unapply)
  }

}
