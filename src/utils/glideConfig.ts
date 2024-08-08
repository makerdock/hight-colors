import { createGlideConfig, chains } from "@paywithglide/glide-js";
import { env } from "~/env";

export const glideConfig = createGlideConfig({
    projectId: env.NEXT_PUBLIC_GLIDE_PROJECT_ID,
    chains: [chains.base],
});