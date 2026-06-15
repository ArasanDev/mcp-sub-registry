import { z } from "zod";

const jsonLiteralSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export type JsonValue =
  | z.infer<typeof jsonLiteralSchema>
  | { [key: string]: JsonValue }
  | JsonValue[];

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    jsonLiteralSchema,
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema)
  ])
);

export const metaSchema = z.record(z.string(), jsonValueSchema);

export const packageSchema = z
  .object({
    registryType: z.string(),
    identifier: z.string(),
    version: z.string().optional(),
    transport: jsonValueSchema.optional(),
    packageArguments: z.array(jsonValueSchema).optional(),
    runtimeArguments: z.array(jsonValueSchema).optional(),
    environmentVariables: z.array(jsonValueSchema).optional()
  })
  .passthrough();

export const remoteSchema = z
  .object({
    type: z.string(),
    url: z.string(),
    headers: jsonValueSchema.optional(),
    variables: jsonValueSchema.optional()
  })
  .passthrough();

export const serverDetailSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    version: z.string().min(1),
    title: z.string().optional(),
    packages: z.array(packageSchema).optional(),
    remotes: z.array(remoteSchema).optional(),
    _meta: metaSchema.optional()
  })
  .passthrough();

export const serverResponseSchema = z
  .object({
    server: serverDetailSchema,
    _meta: metaSchema.default({})
  })
  .passthrough();

export const serverListSchema = z
  .object({
    servers: z.array(serverResponseSchema),
    metadata: z
      .object({
        count: z.number().int().nonnegative(),
        nextCursor: z.string().nullable().optional()
      })
      .passthrough()
  })
  .passthrough();

export type ServerDetail = z.infer<typeof serverDetailSchema>;
export type ServerResponse = z.infer<typeof serverResponseSchema>;
export type ServerList = z.infer<typeof serverListSchema>;
