import { Route } from "./entity/Route";

class Node {
  children: Record<string, Node> = {};
  hasLeaf = false;
  route?: Route;
  parameters?: string[];
}

export interface MatchResult {
  route: Route;
  parameters: Record<string, string>;
}

export class Router {
  root = new Node();

  constructor(routes: Route[]) {
    for (let route of routes) this.addRoute(route);
  }

  addRoute(route: Route) {
    const parameters: string[] = [];
    let parameterId = 0;
    let parent = this.root;
    for (let segment of route.path.split("/")) {
      if (segment.startsWith(":") || segment.startsWith("*")) {
        parameters.push(segment.slice(1) || String(parameterId++));
        segment = segment[0];
      }
      if (!parent.children[segment]) parent.children[segment] = new Node();
      parent = parent.children[segment];
    }
    parent.hasLeaf = true;
    for (const method of route.methods) {
      const node = new Node();
      node.route = route;
      node.parameters = parameters;
      parent.children[method] = node;
    }
    return parent;
  }

  private matchRouteNode(segments: string[], parent?: Node, parameters: string[] = []): Node | undefined {
    if (!parent) return;
    if (segments.length === 0) return parent;
    const [head, ...tail] = segments;
    let node = this.matchRouteNode(tail, parent.children[head], parameters);
    if (node) return node;
    parameters.push(head);
    node = this.matchRouteNode(tail, parent.children[":"], parameters);
    if (node) return node;
    parameters[parameters.length - 1] = segments.join("/");
    return parent.children["*"];
  }

  matchRoute(request: Request): MatchResult | null | undefined {
    const { pathname } = new URL(request.url);
    const parameterValues: string[] = [];
    const node = this.matchRouteNode(pathname.split("/"), this.root, parameterValues);
    if (!node?.hasLeaf || !node?.children) return;
    const { method } = request;
    const leaf = node.children[method] || node.children["*"];
    if (!leaf?.route) return null;
    const parameterEntries = parameterValues.map((value, i) => [leaf.parameters?.[i], value]);
    const parameters = Object.fromEntries(parameterEntries);
    return { route: leaf.route, parameters };
  }
}
