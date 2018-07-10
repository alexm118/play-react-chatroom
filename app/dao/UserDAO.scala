package dao

import javax.inject.Inject

import models.{LoginRequest, User}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}

class UserDAO @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)(
    implicit executionContext: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  import profile.api._

  private val Users = TableQuery[UserTable]

  private def checkIfUserExists(user: User): Future[Boolean] = {
    db.run(
        Users
          .filter(item => {
            item.username === user.username || item.email === user.email
          })
          .result)
      .map(results => results.nonEmpty)
  }

  private def insertUser(user: User): Future[User] = {
    val userWithId =
      (Users returning Users.map(_.user_id)
        into ((newUser, id) => newUser.copy(user_id = Some(id)))) += user
    db.run(userWithId)
  }

  def createUser(user: User): Future[Either[String, User]] = {
    for {
      userExists <- checkIfUserExists(user)
      result <- if (!userExists) insertUser(user) else Future.successful(user)
    } yield {
      if (userExists) {
        Left("User Already Exists")
      } else {
        Right(result)
      }
    }
  }

  def deleteUser(user_id: Int): Future[Boolean] = {
    val query = Users.filter(user => user.user_id === user_id).delete
    db.run(query).map(rowsDeleted => rowsDeleted > 0)
  }

  def login(loginRequest: LoginRequest): Future[Either[String, User]] = {
    val loginSuccess: Future[Seq[User]] = db.run(
      Users
        .filter(user => {
          user.username === loginRequest.username && user.password === loginRequest.password
        })
        .result)
    loginSuccess.collect {
      case loginResult if loginResult.nonEmpty => Right(loginResult.head)
      case _                                   => Left("Unauthorized Request")
    }
  }

  def getUser(user_id: Int): Future[Option[User]] =
    db.run(Users.filter(user => user.user_id === user_id).result)
      .map(results => results.headOption)

  def getAllUsers: Future[Seq[User]] = db.run(Users.result)

  private class UserTable(tag: Tag) extends Table[User](tag, "user") {
    def user_id = column[Int]("user_id", O.PrimaryKey, O.AutoInc)
    def username = column[String]("username")
    def password = column[String]("password")
    def firstname = column[String]("firstname")
    def lastname = column[String]("lastname")
    def email = column[String]("email")
    def * =
      (user_id.?, username, password, firstname, lastname, email) <> (User.tupled, User.unapply)
  }

}
