import {
  createElement,
  LazyExoticComponent,
  ReactElement,
  isValidElement,
  ComponentType,
} from 'react';
import { NonIndexRouteObject, IndexRouteObject } from 'react-router-dom';

type RouteElement = ComponentType | LazyExoticComponent<any> | ReactElement;

type BaseRouteConfig = {
  element: RouteElement;
  path?: string;
  caseSensitive?: boolean;
  id?: string;
};

interface NonIndexRouteConfig extends BaseRouteConfig {
  index?: false;
  children?: RouteConfig[];
}

interface IndexRouteConfig extends BaseRouteConfig {
  index: true;
}

type RouteConfig = NonIndexRouteConfig | IndexRouteConfig;

interface ConfigureRoutesOptions {
  parentPath?: string;
}

export function configureRoutes(
  routes: RouteConfig[] = [],
  options: ConfigureRoutesOptions = {}
): (NonIndexRouteObject | IndexRouteObject)[] {
  const { parentPath } = options;
  return routes.map(configure);

  function configure(
    route: RouteConfig
  ): NonIndexRouteObject | IndexRouteObject {
    const Element = route.element;
    const element = isValidElement(Element)
      ? Element
      : createElement(Element as ComponentType);

    const configured = {
      ...route,
      element,
    } as NonIndexRouteObject | IndexRouteObject;

    if (configured.path && parentPath) {
      configured.path = configured.path.replace(new RegExp(parentPath), '');
    }

    if ('children' in route && route.children?.length) {
      return {
        ...configured,
        children: route.children.map(configure),
      } as NonIndexRouteObject;
    }

    return configured;
  }
}
