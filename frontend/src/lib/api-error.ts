import { AxiosError } from "axios";

type ApiErrorData = { message?: string | string[] };

export function getApiErrorMessage(err: unknown): string {
  if ((err as AxiosError)?.isAxiosError) {
    const ax = err as AxiosError<ApiErrorData>;
    const data = ax.response?.data;
    const msg = data?.message ?? ax.message ?? ax.response?.statusText;
    if (Array.isArray(msg)) return msg.join("\n");
    if (typeof msg === "string") return msg;
    return "Request failed";
  }
  return "Unexpected error";
}
