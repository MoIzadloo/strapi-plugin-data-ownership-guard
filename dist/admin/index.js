"use strict";
const react = require("react");
const jsxRuntime = require("react/jsx-runtime");
const icons = require("@strapi/icons");
const admin = require("@strapi/strapi/admin");
const reactRouterDom = require("react-router-dom");
const designSystem = require("@strapi/design-system");
const reactIntl = require("react-intl");
const axios = require("axios");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const axios__default = /* @__PURE__ */ _interopDefault(axios);
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "strapi-plugin-data-ownership-guard";
const Initializer = ({ setPlugin }) => {
  const ref = react.useRef(setPlugin);
  react.useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
const PluginIcon = () => /* @__PURE__ */ jsxRuntime.jsx(icons.CastleTurret, {});
function useHomePage() {
  const [routesList, setRoutesList] = react.useState([]);
  const [isLoading, setIsLoading] = react.useState(false);
  const fetchData = async () => {
    try {
      const response = await axios__default.default.get(
        `/strapi-plugin-data-ownership-guard/get-routes`
      );
      const selectedApis = await axios__default.default.get(`/strapi-plugin-data-ownership-guard/get-selected-apis`);
      response.data.forEach((route) => {
        if (selectedApis.data?.some(
          (api) => api.path === route.path && api.method === route.method
        )) {
          route.isEnabled = true;
          route.id = selectedApis.data.find(
            (api) => api.path === route.path && api.method === route.method
          )?.id;
        } else {
          route.isEnabled = false;
        }
      });
      const routesList2 = response?.data?.filter((route) => route.handler?.startsWith("api::"));
      setRoutesList(routesList2);
    } catch (err) {
      console.log("error of routes list:", err);
    }
  };
  react.useEffect(() => {
    fetchData();
  }, []);
  const handleAssignPolicyToRoute = async (path, method, handler, id) => {
    try {
      setIsLoading(true);
      if (id !== void 0) {
        await axios__default.default.delete(`/strapi-plugin-data-ownership-guard/delete-protected-route/${id}`);
      } else {
        await axios__default.default.post(`/strapi-plugin-data-ownership-guard/assign-policy-to-route`, {
          path,
          method,
          handler
        });
      }
      await fetchData();
      setIsLoading(false);
    } catch (err) {
      console.log("error of assign policy to route:", err);
      setIsLoading(false);
    }
  };
  return { routesList, isLoading, handleAssignPolicyToRoute };
}
const HomePage = () => {
  const { formatMessage } = reactIntl.useIntl();
  const { routesList, isLoading, handleAssignPolicyToRoute } = useHomePage();
  const renderItems = react.useCallback(() => {
    return routesList?.map?.((route, index2) => /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tr, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: index2 + 1 }),
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Td, { style: { fontSize: "1.25rem" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("code", { children: /* @__PURE__ */ jsxRuntime.jsx("b", { children: route.method }) }),
        "  ",
        /* @__PURE__ */ jsxRuntime.jsx("code", { children: route.path })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: /* @__PURE__ */ jsxRuntime.jsx("div", { style: { maxWidth: "20vw" }, children: /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.TextInput,
        {
          size: "S",
          placeholder: formatMessage({
            id: "plugin.strapi-ownership-guard.home.routes.routes.defaultFields"
          }),
          disabled: true
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Checkbox,
        {
          checked: route.isEnabled,
          disabled: isLoading,
          onCheckedChange: handleAssignPolicyToRoute.bind(
            null,
            route.path,
            route.method,
            route.handler,
            route?.id
          )
        }
      ) })
    ] }, index2));
  }, [routesList, formatMessage]);
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "h1",
      {
        style: {
          fontSize: "2rem",
          fontWeight: "bold",
          margin: "2rem"
        },
        children: formatMessage({ id: "plugin.strapi-ownership-guard.home.routes.routes.title" })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      "p",
      {
        style: {
          margin: "2rem",
          fontSize: "1.25rem"
        },
        children: formatMessage({
          id: "plugin.strapi-ownership-guard.home.routes.routes.description"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Table, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Thead, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tr, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: "#" }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: formatMessage({ id: "plugin.strapi-ownership-guard.home.routes.routes.apiRoute" }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: formatMessage({ id: "plugin.strapi-ownership-guard.home.routes.routes.fieldName" }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: formatMessage({ id: "plugin.strapi-ownership-guard.home.routes.routes.enabled" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tbody, { children: renderItems() })
    ] })
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs(reactRouterDom.Routes, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { index: true, element: /* @__PURE__ */ jsxRuntime.jsx(HomePage, {}) }),
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: "*", element: /* @__PURE__ */ jsxRuntime.jsx(admin.Page.Error, {}) })
  ] });
};
const index = {
  register(app) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID
      },
      Component: async () => {
        return App;
      }
    });
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
  },
  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => Promise.resolve().then(() => require("../_chunks/en-vR0bFl6h.js")) }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
module.exports = index;
