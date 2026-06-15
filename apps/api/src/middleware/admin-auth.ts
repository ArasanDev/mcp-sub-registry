import { createMiddleware } from "hono/factory";

export function adminAuth(adminApiKey: string) {
  return createMiddleware(async (c, next) => {
    const authorization = c.req.header("Authorization");

    if (authorization !== `Bearer ${adminApiKey}`) {
      return c.json(
        {
          error: "Unauthorized",
          code: "unauthorized",
          details: {}
        },
        401
      );
    }

    await next();
  });
}
