import jwt from "jsonwebtoken";
export class middleware {
  async ensureAuth(req: any, res: any, next: any) {
    const token = req.cookies.token;
    if (!token) {
      return res
        .redirect("/")
        .status(401)
        .json({ authenticated: false, message: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return next();
    } catch (err) {
      return res.status(401).json({
        authenticated: false,
        message: "Invalid token",
      });
    }
  }
}
