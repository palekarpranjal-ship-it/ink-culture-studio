import { vlyPlugin } from "@vly-ai/integrations";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { generateText } from "ai";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vlyPlugin(), tailwindcss(), {
    name: "ink-lab-api",
    configureServer(server) {
      server.middlewares.use("/api/ink-lab", async (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; res.end("Method not allowed"); return; }
        let raw = "";
        for await (const chunk of req) raw += chunk;
        try {
          const body = JSON.parse(raw) as { idea?: string; placement?: string; style?: string; hasReferenceImage?: boolean };
          const idea = body.idea?.trim();
          if (!idea || idea.length < 10 || idea.length > 1200) { res.statusCode = 400; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ error: "Please describe your tattoo idea in 10–1200 characters." })); return; }
          const { text } = await generateText({ model: "openai/gpt-4o-mini", temperature: 0.4, system: "You are the senior tattoo consultant for Street Culture Tattoo Studio in Mumbai. Silently assess intent, symbolism, body flow, style fit, scale, contrast, session complexity, and ambiguity before answering. Do not reveal chain-of-thought. If information is missing, state an assumption and add one focused question. Never promise medical safety or exact results. Return exactly these sections: IDEA, VISUAL DIRECTION, COMPOSITION & FLOW, PLACEMENT NOTES, SESSION & PRACTICAL NOTES, ARTIST QUESTIONS. Be warm, specific, and under 500 words.", prompt: `Client idea: ${idea}\\nPlacement: ${body.placement?.trim() || "Not specified"}\\nStyle: ${body.style || "No preference"}\\nReference image supplied: ${body.hasReferenceImage ? "Yes" : "No"}` });
          res.statusCode = 200; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ brief: text }));
        } catch (error) { console.error("[v0] Ink Lab generation failed", error); res.statusCode = 500; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ error: "The Ink Lab could not draft this brief. Please try again." })); }
      });
    },
  }],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Force a single copy of React across all packages (including vlyPlugin).
    // Without this, @vly-ai/integrations can resolve its own React copy, which
    // triggers "Invalid hook call" errors at runtime.
    dedupe: ["react", "react/jsx-runtime", "react-dom", "react-dom/client"],
  },
  build: {
    // Enable source maps for better debugging (disable in production if needed)
    sourcemap: false,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and lazy loading
        manualChunks: {
          // Vendor chunks for large libraries
          'react-vendor': ['react', 'react-dom', 'react-router'],
          // Large UI library chunks
          'radix-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip',
          ],
          // Heavy optional libraries - separate chunks for better lazy loading
          'framer-motion': ['framer-motion'],
          'charts': ['recharts'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
        // Optimize chunk size
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit for better chunking
    chunkSizeWarningLimit: 1000,
    // Target modern browsers for better optimization
    target: 'esnext',
    // Minify options - using esbuild (faster than terser)
    minify: 'esbuild',
  },
  // Optimize dependencies
  optimizeDeps: {
    // Only scan the app entry HTML; avoids crawling unrelated *.html files
    // if a legacy snapshot accidentally contains leaked package folders.
    entries: ['index.html'],
    include: [
      'react',
      'react/jsx-runtime',
      'react-dom',
      'react-dom/client',
      'react-router',
      '@convex-dev/auth/react',
      'framer-motion',
      // vlyPlugin() injects this import at serve time, so the dep scanner
      // never sees it. Without it here the first page load discovers it,
      // re-optimizes and full-reloads the preview mid-screenshot.
      '@vly-ai/integrations',
    ],
  },
  // Performance hints
  server: {
    // Bind to all interfaces so the browser runtime's server-ready event fires.
    host: true,
    port: 5173,
    // Keep HMR on, but disable full-screen error overlay
    hmr: {
      overlay: false,
    },
  },
});
