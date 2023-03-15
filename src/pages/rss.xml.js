import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export async function get() {
	return rss({
		title: "LunaSeki's Blog",
		description: "just web",
		site: "https://blog.lunaseki.top",
		items: await pagesGlobToRssItems(import.meta.glob("./**/*.md")),
		customData: `<language>zh-cn</language>`,
	});
}
