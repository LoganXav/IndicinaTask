import "dotenv/config";
import "reflect-metadata";
import { Application } from "./infrastructure/internal/application";

const app = new Application();

app.start(new Date());
