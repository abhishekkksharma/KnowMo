import { Metadata } from "next";

export function createMetadata(
  title: string,
  description: string
): Metadata {
  return {
    title,
    description,
  };
}