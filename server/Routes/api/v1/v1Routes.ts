import { Router } from "express";

let v1Routes = Router();

v1Routes.get("/", (req, res) => {
  res.status(200).json({
    message: "Connected to ExDateMan API version 1"
  });
});

export default v1Routes;
