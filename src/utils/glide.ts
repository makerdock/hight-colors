import { createGlideConfig, chains } from "@paywithglide/glide-js";

export const glide = createGlideConfig({
    projectId: "your project id",
    chains: [chains.base, chains.optimism],
});