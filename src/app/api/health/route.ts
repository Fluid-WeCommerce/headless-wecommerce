import { fluidConfig } from "@/lib/fluid/config";
import { getShop } from "@/lib/fluid/shop";

/** Liveness and configuration check: confirms Fluid is reachable for the configured shop. */
export async function GET() {
  try {
    const { shop } = fluidConfig();
    const settings = await getShop({ revalidate: false });
    return Response.json({ status: "ok", shop, name: settings.name });
  } catch (error) {
    return Response.json({ status: "error", message: error instanceof Error ? error.message : String(error) }, { status: 503 });
  }
}
