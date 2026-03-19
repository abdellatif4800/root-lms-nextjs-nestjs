"use client";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { ImageComponent, QuizComponent, SimpleSeparator, VideoComponent } from "@repo/mdxSetup";

export function MDXContent({ source }: { source: MDXRemoteSerializeResult }) {
  return (
    <div className="mdxContent">
      <MDXRemote {...source} components={{ SimpleSeparator, ImageComponent, VideoComponent, QuizComponent }} />
    </div>
  );
}
