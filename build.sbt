name := """play-react-chatroom"""
organization := "com.alexmartin"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala, SwaggerPlugin)

scalaVersion := "2.12.3"

libraryDependencies += guice
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % Test
libraryDependencies += "org.webjars" % "swagger-ui" % "2.2.0"
libraryDependencies += "com.typesafe.play" %% "play-slick" % "3.0.0"
libraryDependencies += "com.typesafe.play" %% "play-slick-evolutions" % "3.0.0"
libraryDependencies += "org.postgresql" % "postgresql" % "9.4-1201-jdbc41"

swaggerDomainNameSpaces := Seq("models")

javaOptions in Test += "-Dconfig.file=conf/application.test.conf"
