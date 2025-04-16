import { useCallback } from 'react';
import { Main, Table, Thead, Tbody, Tr, Td, Th, TextInput, Checkbox } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import { useHomePage } from '../hooks';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { routesList, isLoading, handleAssignPolicyToRoute } = useHomePage();

  const renderItems = useCallback(() => {
    return routesList?.map?.((route, index) => (
      <Tr key={index}>
        <Td>{index + 1}</Td>

        <Td style={{ fontSize: '1.25rem' }}>
          <code>
            <b>{route.method}</b>
          </code>
          {'  '}
          <code>{route.path}</code>
        </Td>

        <Td>
          <div style={{ maxWidth: '20vw' }}>
            <TextInput
              size="S"
              placeholder={formatMessage({
                id: 'plugin.strapi-ownership-guard.home.routes.routes.defaultFields',
              })}
              disabled
            />
          </div>
        </Td>

        <Td>
          <Checkbox
            checked={route.isEnabled}
            disabled={isLoading}
            onCheckedChange={handleAssignPolicyToRoute.bind(
              null,
              route.path,
              route.method,
              route.handler,
              route?.id
            )}
          />
        </Td>
      </Tr>
    ));
  }, [routesList, formatMessage]);

  return (
    <Main>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: '2rem',
        }}
      >
        {formatMessage({ id: 'plugin.strapi-ownership-guard.home.routes.routes.title' })}
      </h1>

      <p
        style={{
          margin: '2rem',
          fontSize: '1.25rem',
        }}
      >
        {formatMessage({
          id: 'plugin.strapi-ownership-guard.home.routes.routes.description',
        })}
      </p>

      <Table>
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>
              {formatMessage({ id: 'plugin.strapi-ownership-guard.home.routes.routes.apiRoute' })}
            </Th>
            <Th>
              {formatMessage({ id: 'plugin.strapi-ownership-guard.home.routes.routes.fieldName' })}
            </Th>
            <Th>
              {formatMessage({ id: 'plugin.strapi-ownership-guard.home.routes.routes.enabled' })}
            </Th>
          </Tr>
        </Thead>

        <Tbody>{renderItems()}</Tbody>
      </Table>
    </Main>
  );
};

export { HomePage };
