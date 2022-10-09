import { defineConfig, MarkdownEnv, MarkdownRenderer } from "vitepress";
import container from "markdown-it-container";
import Token from "markdown-it/lib/token";
import fs from "node:fs";
import path from "node:path";
import { parse, compileTemplate, compileScript } from "vue/compiler-sfc";
import { transform } from "sucrase";
import { baseParse } from "@vue/compiler-core";

const REGEXP_SRC = /\ssrc\=['"](.+)['"]/;

const REGEXP_SCRIPT_TAG = /<script\s+/;

const hasScriptTag = (content: string) => REGEXP_SCRIPT_TAG.test(content);

const virtualModuleId = "virtual:my-module";
const resolvedVirtualModuleId = "\0" + virtualModuleId;
const map = {};
function PluginParseDemo() {
  return {
    name: "plugin-parse-demo", // required, will show up in warnings and errors
    resolveId(id) {
      if (id.startsWith(virtualModuleId)) {
        return resolvedVirtualModuleId + id.substring(virtualModuleId.length);
      }
    },
    load(id) {
      if (id.startsWith(resolvedVirtualModuleId)) {
        const cmpName = id.replace(resolvedVirtualModuleId + "/", "");
        const rawCode = map[cmpName];
        const { descriptor } = parse(rawCode);
        if (hasScriptTag(rawCode)) {
          return compileScript(descriptor, {
            inlineTemplate: true,
            id,
            templateOptions: {
              source: descriptor.template?.content,
            },
          }).content;
        }
        const res = compileTemplate({
          source: descriptor.template?.content || rawCode,
          id,
          filename: cmpName,
        }).code;
        return `${res}\nexport default render`;
      }
    },
    transform(src, id) {
      if (id.startsWith(resolvedVirtualModuleId)) {
        return transform(src, { transforms: ["typescript"] });
      }
    },
  };
}

let cmpId = 0;
const DEMO_CMP_PREFIX = "DemoCmp$";

const getCmpName = () => {
  return `${DEMO_CMP_PREFIX}${cmpId++}`;
};

type SourceConfig = {
  src?: string;
  code?: string;
};

const makeSetupScript = (
  env: any,
  md: MarkdownRenderer,
  config: SourceConfig
) => {
  let importExpression = "";
  let rawCode = "";
  let highlightedCode = "";
  const cmpName = getCmpName();
  let lang = "vue";
  if (config.code) {
    importExpression = `\nimport ${cmpName} from "${virtualModuleId}/${cmpName}"\n`;
    map[cmpName] = config.code;
    rawCode = config.code;
  } else if (config.src) {
    importExpression = `\nimport ${cmpName} from "${config.src}"\n`;
    rawCode = fs.readFileSync(
      path.resolve(path.dirname(env.path), config.src),
      "utf-8"
    );
  }

  lang = hasScriptTag(rawCode) ? lang : "html";

  highlightedCode = md.options.highlight!(rawCode, lang, "");

  if (!env.sfcBlocks.scriptSetup) {
    const script = {
      content: `<script setup lang="ts">\n</script>`,
    };
    env.sfcBlocks.scriptSetup = script;
    env.sfcBlocks.scripts.unshift(script);
  }

  if (env.sfcBlocks.scriptSetup.content.indexOf(importExpression) === -1) {
    env.sfcBlocks.scriptSetup.content =
      env.sfcBlocks.scriptSetup.content.replace(
        "</script>",
        `${importExpression}</script>`
      );
  }

  return {
    lang,
    rawCode,
    highlightedCode,
    cmpName,
  };
};

const parseDemo = (content: string) => {
  const res = {
    src: "",
    code: "",
  };
  const { props = [], children = [] } = baseParse(content).children[0];

  let srcProp: any = null;
  let title = "";
  let desc = "";

  props.forEach((item) => {
    if (item.name === "src") {
      srcProp = item;
    } else if (item.name === "desc") {
      desc = item.value.content;
    } else if (item.name === "title") {
      title = item.value.content;
    }
  });

  let demoContent = "";
  const slotContent = children
    .filter((item) => {
      const isMatchSlot =
        item.tag === "template" &&
        item.props.find(
          (prop) =>
            prop.name === "slot" &&
            (prop.arg.content === "desc" || prop.arg.content === "title")
        );
      if (isMatchSlot) {
        return true;
      }
      demoContent += item.loc.source + "\n";
    })
    .map((item) => item.loc.source)
    .join("\n");

  return {
    demoContent,
    slotContent,
    src: srcProp ? srcProp.value.content : "",
    desc,
    title,
  };
};

export default defineConfig({
  lang: "zh-CN",
  title: "vue3 ui libarary",
  description: "Just playing around.",
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
    config(md) {
      const addHtmlDemoRender = (type: "html_inline" | "html_block") => {
        const defaultRender = md.renderer.rules[type]!;
        md.renderer.rules[type] = (tokens, idx, options, env, self) => {
          const { content } = tokens[idx];

          if (!/^<Demo/.test(content)) {
            return defaultRender(tokens, idx, options, env, self);
          }
          const { demoContent, slotContent, src, title, desc } =
            parseDemo(content);
          const { cmpName, rawCode, highlightedCode, lang } = makeSetupScript(
            env,
            md,
            { src, code: demoContent }
          );

          return `<Demo title="${title}" desc="${desc}" lang="${lang}" code="${encodeURIComponent(
            rawCode
          )}" highlightedCode="${encodeURIComponent(
            highlightedCode
          )}">\n<${cmpName} />${slotContent}</Demo>`;
        };
      };
      const defaultFenceRender = md.renderer.rules.fence!;

      addHtmlDemoRender("html_inline");
      addHtmlDemoRender("html_block");

      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];

        if (token.hidden) {
          return "";
        } else {
          return defaultFenceRender(tokens, idx, options, env, self);
        }
      };
      md.use(container, "demo", {
        render: (tokens: Token[], idx: number, options, env, renderer) => {
          if (tokens[idx].nesting === 1) {
            const m = tokens[idx].info.trim().match(/^demo\s+(.*)$/);
            const title = m[1].replace(REGEXP_SRC, "");
            const src = m[1].match(REGEXP_SRC);
            const srcPath = src ? src[1] : "";

            let fenceIndex = tokens
              .slice(idx)
              .findIndex((item) => item.type === "fence");
            fenceIndex = fenceIndex === -1 ? -1 : fenceIndex + idx;
            if (fenceIndex < 0 && !srcPath) {
              throw new Error("should specified `src` attrbute or code block!");
            }

            const isDemoImportFile = !!srcPath;
            if (!isDemoImportFile) {
              tokens[fenceIndex].hidden = true;
            }

            const { rawCode, highlightedCode, lang, cmpName } = makeSetupScript(
              env,
              md,
              isDemoImportFile
                ? { src: srcPath }
                : { code: tokens[fenceIndex].content }
            );

            // opening tag
            return `<Demo title="${md.utils.escapeHtml(
              title
            )}" lang="${lang}" code="${encodeURIComponent(
              rawCode
            )}" highlightedCode="${encodeURIComponent(
              highlightedCode
            )}">\n<${cmpName} /><template #desc >`;
          } else {
            // closing tag
            return "</template></Demo>\n";
          }
        },
      });
    },
  },
  themeConfig: {
    nav: [
      {
        text: "Components",
        link: "",
      },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [{ text: "Introduction", link: "/index" }],
      },
      {
        text: "Components",
        items: [
          { text: "DemoButton", link: "/cmp-doc/button" },
          { text: "DemoInput", link: "/cmp-doc/input" },
        ],
      },
    ],
  },
  vite: {
    plugins: [PluginParseDemo()],
  },
});
