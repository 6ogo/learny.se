// Type definitions for Deno runtime
declare namespace Deno {
    export interface DenoNamespace {
      env: {
        get(key: string): string | undefined;
        set(key: string, value: string): void;
        toObject(): { [key: string]: string };
      };
      // Add other Deno APIs as needed
    }
  }
  
  declare const Deno: Deno.DenoNamespace;
  
  // For HTTP server module
  declare module "https://deno.land/std@0.168.0/http/server.ts" {
    export function serve(handler: (request: Request) => Response | Promise<Response>): void;
  }
  
  // For Supabase client
  declare module "https://esm.sh/@supabase/supabase-js@2.26.0" {
    export * from "@supabase/supabase-js";
  }