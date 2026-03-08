"use client";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { ImageComponent, SimpleSeparator } from "@repo/mdxSetup";

export function MDXContent({ source }: { source: MDXRemoteSerializeResult }) {
  return (
    <div className="mdxContent">
      <MDXRemote {...source} components={{ SimpleSeparator, ImageComponent }} />
    </div>
  );
}
