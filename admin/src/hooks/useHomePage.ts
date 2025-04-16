import axios from 'axios';
import { useState, useEffect } from 'react';

type RoutesType = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  handler: string;
  config: any;
  isEnabled: boolean;
  id?: number;
}[];

export function useHomePage() {
  const [routesList, setRoutesList] = useState<RoutesType>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get<RoutesType>(
        `/strapi-plugin-data-ownership-guard/get-routes`
      );

      const selectedApis = await axios.get(`/strapi-plugin-data-ownership-guard/get-selected-apis`);

      response.data.forEach((route) => {
        if (
          selectedApis.data?.some(
            (api: any) => api.path === route.path && api.method === route.method
          )
        ) {
          route.isEnabled = true;
          // add the id of the selectedApis to the objects
          route.id = selectedApis.data.find(
            (api: any) => api.path === route.path && api.method === route.method
          )?.id;
        } else {
          route.isEnabled = false;
        }
      });

      const routesList = response?.data?.filter((route) => route.handler?.startsWith('api::'));

      setRoutesList(routesList);
    } catch (err: any) {
      console.log('error of routes list:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignPolicyToRoute = async (
    path: string,
    method: string,
    handler: string,
    id?: number
  ) => {
    try {
      setIsLoading(true);
      if (id !== undefined) {
        await axios.delete(`/strapi-plugin-data-ownership-guard/delete-protected-route/${id}`);
      } else {
        await axios.post(`/strapi-plugin-data-ownership-guard/assign-policy-to-route`, {
          path,
          method,
          handler,
        });
      }

      await fetchData();

      setIsLoading(false);
    } catch (err: any) {
      console.log('error of assign policy to route:', err);
      setIsLoading(false);
    }
  };

  return { routesList, isLoading, handleAssignPolicyToRoute };
}
