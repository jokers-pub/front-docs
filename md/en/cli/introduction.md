## Introduction  

Joker CLI is the frontend build tool for the Joker frontend platform, designed to elevate the frontend development experience.  

- **ESM (Modular) Support:** Joker CLI supports ESM (EcmaScript Modules) mode, enabling it to leverage the latest JavaScript module standards and provide on-demand compilation. This approach not only enhances loading efficiency but also ensures that only the code actually required by the user is compiled and parsed, significantly improving application responsiveness and performance.  
- **Asynchronous Static Scanning of Frontend Entry Dependencies:** By asynchronously scanning frontend entry dependencies without blocking the main thread, third-party dependencies can be precompiled into directly executable files. This feature is particularly advantageous during cold starts, dramatically reducing application launch time and optimizing the user experience.  
- **Hot Module Replacement (HMR):** Supporting HMR allows developers to see the effects of code changes in real-time during application runtime, eliminating the need for page reloads or application restarts—a crucial feature for enhancing development efficiency and iteration speed.  
- **Rollup Plugin Compatibility:** Adhering to Rollup's plugin specification ensures seamless integration with Rollup's extensive plugin ecosystem, providing developers with exceptional flexibility and extensibility.  
- **Production Build Support:** Joker CLI supports production builds, enabling the generation of optimized code for production environments, thereby helping developers create high-performance, refined applications.  

### On-Demand Compilation  

Joker CLI utilizes [native ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) (native ES modules) to serve source code on the server. This strategy delegates part of the bundling workload to the browser itself. Specifically, Joker CLI only performs necessary transformations when the browser requests the source code and delivers it on demand. This approach enables dynamic on-demand code imports—meaning code segments are processed and executed only when they are actually used (i.e., appear on the user's current screen). This not only boosts development efficiency but also optimizes resource loading, minimizing unnecessary performance overhead.  

### Efficient Hot Module Replacement  

Many bundler development servers store build outputs in memory, allowing them to update only a portion of the module graph when files change. However, these tools often still require rebuilding the entire application and triggering a page reload, a process that consumes time and resets the application state. To address this, bundlers introduced Hot Module Replacement (HMR), which allows modules to "hot-swap" themselves without affecting other parts of the page, significantly improving the development experience. However, in practice, even with HMR enabled, the speed of hot updates noticeably slows down as the application scales.  

Joker CLI takes a different approach: It implements HMR on top of native ESM. When a developer edits a file, Joker CLI only invalidates the edited module and its directly dependent modules, usually requiring updates to just a single module. This precise invalidation mechanism ensures that HMR remains fast and efficient regardless of the application size, delivering a smooth development experience.  

### Dependency Pre-Bundling  

During project initialization, Joker CLI performs a comprehensive scan to identify and analyze potential entry points, meticulously mapping out project dependencies. When third-party library dependencies are detected, Joker CLI adopts an efficient asynchronous pre-compilation strategy. This means that upon first detecting these dependencies, Joker CLI pre-compiles them into optimized modules so they can be directly utilized during subsequent runs, avoiding repetitive compilation steps. This approach not only eliminates the need for compatibility transformations with older module systems like CommonJS and UMD but also significantly improves runtime loading speed and overall performance, providing developers with a faster and more efficient frontend development environment.  

### Browser Support  

During development, Joker CLI targets the `esnext` specification for code transformation, assuming modern browsers support the latest JavaScript and CSS features. This approach avoids unnecessary syntax downgrades while ensuring the generated code remains as close as possible to the original source, preserving code integrity and performance.  

For production builds, Joker CLI by default targets modern browsers that support native ES modules, native ESM dynamic imports, and `import.meta`. For backward compatibility with legacy browsers, Joker CLI provides the official `@joker.front/cli-plugin-legacy` plugin. For more details on production builds, refer to the relevant documentation.  

### Joker File Compilation  

Joker CLI deeply integrates compilation plugins specifically designed for parsing and transforming `Joker SFC` (Joker Single-File Component) files. This integration ensures an efficient and accurate compilation process while offering advanced features such as Hot Module Replacement (HMR), allowing developers to preview changes instantly during code iterations—significantly enhancing development efficiency and experience.