import { Router } from "express";
import {
  searchExternalBooks,
  importExternalBook,
} from "../controllers/externalBooks.controller.js";

const externalBookRoutes = Router();

externalBookRoutes.get("/search", searchExternalBooks);
externalBookRoutes.post("/import", importExternalBook);

export default externalBookRoutes;
