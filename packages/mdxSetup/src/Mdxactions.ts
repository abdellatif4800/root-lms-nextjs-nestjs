"use server";
import { serialize } from "next-mdx-remote/serialize";

export async function serializeMDX(source: string) {
  return serialize(source);
}
