import { QueryManager } from "@/worker/query_manager";
import { IS_WORKER } from "./constants";
export * from "./query_manager";

if (IS_WORKER) {
    const manager = new QueryManager();
    (self as any).onmessage = function (e) {
        manager.run(e.data);
    };
}

