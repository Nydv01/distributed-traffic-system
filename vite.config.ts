import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    /* ===============================
       Dev Server Configuration
    =============================== */
    server: {
      host: "::",
      port: 8080,
      strictPort: true,
      open: false,
      hmr: {
        overlay: false,
      },
    },

    /* ===============================
       Preview (Production Simulation)
    =============================== */
    preview: {
      host: "::",
      port: 8080,
      strictPort: true,
    },

    /* ===============================
       Plugins
    =============================== */
    plugins: [
      react({
        jsxImportSource: undefined,
        tsDecorators: false,
      }),
    ],

    /* ===============================
       Path Aliases
    =============================== */
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },

    /* ===============================
       Build Optimizations
    =============================== */
    build: {
      target: "es2022",
      sourcemap: isDev,
      outDir: "dist",
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            router: ["react-router-dom"],
            state: ["zustand"],
            animation: ["framer-motion"],
            charts: ["recharts"],
          },
        },
      },
    },

    /* ===============================
       Dependency Optimization
    =============================== */
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "zustand",
        "framer-motion",
        "lucide-react",
      ],
    },

    /* ===============================
       ESBuild / SWC Settings
    =============================== */
    esbuild: {
      target: "es2022",
      legalComments: "none",
    },

    /* ===============================
       Global Constants
    =============================== */
    define: {
      __DEV__: isDev,
    },
  };
});
