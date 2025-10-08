import "reflect-metadata";
import * as express from "express";
import { AppDataSource } from "./data-source";
import errorHandler from "./middleware/errorHandler";
import { userRouter } from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";
import { appointmentRouter } from "./routes/appointment.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", appointmentRouter);

app.use(errorHandler);

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));

// import { AppDataSource } from "./data-source"
// import { User } from "./entity/User"

// AppDataSource.initialize().then(async () => {

//     console.log("Inserting a new user into the database...")
//     const user = new User()
//     user.firstName = "Timber"
//     user.lastName = "Saw"
//     user.age = 25
//     await AppDataSource.manager.save(user)
//     console.log("Saved a new user with id: " + user.id)

//     console.log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User)
//     console.log("Loaded users: ", users)

//     console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))
