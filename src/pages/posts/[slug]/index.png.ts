import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "@utils/generateOgImages";
import { slugifyStr } from "@utils/slugify";

export async function getStaticPaths() {
  try {
    const posts = await getCollection("blog");
    const filteredPosts = posts?.filter(({ data }) => !data.draft && !data.ogImage) || [];

    return filteredPosts.map(post => ({
      params: { slug: slugifyStr(post.data.title) },
      props: post,
    }));
  } catch (error) {
    // If collection is empty or doesn't exist, return empty array
    return [];
  }
}

export const GET: APIRoute = async ({ props }) => {
  if (!props) {
    // Return a default OG image if no props are provided
    return new Response(null, {
      status: 404,
      statusText: "Not found"
    });
  }
  
  return new Response(await generateOgImageForPost(props as CollectionEntry<"blog">), {
    headers: { "Content-Type": "image/png" },
  });
}
