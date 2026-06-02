import { useRef, useEffect, useState, useCallback } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { CastleTurret } from "@strapi/icons";
import { Page } from "@strapi/strapi/admin";
import { Routes, Route } from "react-router-dom";
import { Tr, Td, TextInput, Checkbox, Main, Table, Thead, Th, Tbody } from "@strapi/design-system";
import { useIntl } from "react-intl";
import axios from "axios";
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
  const ref = useRef(setPlugin);
  useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
const PluginIcon = () => /* @__PURE__ */ jsx(CastleTurret, {});
function useHomePage() {
  const [routesList, setRoutesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/strapi-plugin-data-ownership-guard/get-routes`
      );
      const selectedApis = await axios.get(`/strapi-plugin-data-ownership-guard/get-selected-apis`);
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
  useEffect(() => {
    fetchData();
  }, []);
  const handleAssignPolicyToRoute = async (path, method, handler, id) => {
    try {
      setIsLoading(true);
      if (id !== void 0) {
        await axios.delete(`/strapi-plugin-data-ownership-guard/delete-protected-route/${id}`);
      } else {
        await axios.post(`/strapi-plugin-data-ownership-guard/assign-policy-to-route`, {
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
  const { formatMessage } = useIntl();
  const { routesList, isLoading, handleAssignPolicyToRoute } = useHomePage();
  const renderItems = useCallback(() => {
    return routesList?.map?.((route, index2) => /* @__PURE__ */ jsxs(Tr, { children: [
      /* @__PURE__ */ jsx(Td, { children: index2 + 1 }),
      /* @__PURE__ */ jsxs(Td, { style: { fontSize: "1.25rem" }, children: [
        /* @__PURE__ */ jsx("code", { children: /* @__PURE__ */ jsx("b", { children: route.method }) }),
        "  ",
        /* @__PURE__ */ jsx("code", { children: route.path })
      ] }),
      /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx("div", { style: { maxWidth: "20vw" }, children: /* @__PURE__ */ jsx(
        TextInput,
        {
          size: "S",
          placeholder: formatMessage({
            id: "plugin.strapi-ownership-guard.home.routes.routes.defaultFields"
          }),
          disabled: true
        }
      ) }) }),
      /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(
        Checkbox,
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
  return /* @__PURE__ */ jsxs(Main, { children: [
    /* @__PURE__ */ jsx(
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
    /* @__PURE__ */ jsx(
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
    /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsxs(Tr, { children: [
        /* @__PURE__ */ jsx(Th, { children: "#" }),
        /* @__PURE__ */ jsx(Th, { children: formatMessage({ id: "plugin.strapi-ownership-guard.home.routes.routes.apiRoute" }) }),
        /* @__PURE__ */ jsx(Th, { children: formatMessage({ id: "plugin.strapi-ownership-guard.home.routes.routes.fieldName" }) }),
        /* @__PURE__ */ jsx(Th, { children: formatMessage({ id: "plugin.strapi-ownership-guard.home.routes.routes.enabled" }) })
      ] }) }),
      /* @__PURE__ */ jsx(Tbody, { children: renderItems() })
    ] })
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(HomePage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Page.Error, {}) })
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
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("../_chunks/en-BJnSjwH2.mjs") }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
export {
  index as default
};
