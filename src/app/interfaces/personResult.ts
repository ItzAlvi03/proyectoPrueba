import { segments } from "./segments";

export interface personResult {
  boxes: number[],
  conf: number,
  segments: segments[],
  pintarContorno: boolean;
  pintarBox: boolean;
}