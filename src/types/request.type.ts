// common/types/typed-request.ts
import { Request } from "express";

export type TypedRequestBody<T> = Request<{}, {}, T>;
export type TypedRequestParams<P, B = any> = Request<P, {}, B>;
export type TypedRequestQuery<Q> = Request<{}, {}, {}, Q>;
