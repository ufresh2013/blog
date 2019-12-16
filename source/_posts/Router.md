---
title: React Router
date: 2018-11-06 17:57:46
category: React
---
### 1. React-Router
```shell
npm install -g create-react-app
create-react-app demo-app
cd demo-app

# All of the components that you use in a web application should be imported from react-router-dom
# Copy/paste either of the examples (below) into your src/App.js.
npm install react-router-dom
```

React Router中有三类组件
- router components
- route matching components
- and navigation components.


<br/>
#### 1.1 Routers
For web projects, react-router-dom provides `<BrowserRouter>` and `<HashRouter>` routers. Both of these will create a specialized history object for you.
```html
import { BrowserRouter } from "react-router-dom";
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```


<br/>
#### 1.2 Route Matching
There are two route matching components: `<Route>` and `<Switch>`. Route matching is done by comparing a <Route>'s path prop to the current location's pathname. When a <Route> matches it will render its content. Then <Switch> component is used to group <Route>s together.

A <Switch> is useful. It will iterate over all of its children <Route> elements and only render the first one that matches the current location. This helps when multiple route's paths match the same pathname, when animating transitions between routes, and in identifying when no routes match the current location(so that you can render a "404" component).


*Route Rendering Props*
You have three prop choices for how you render a component for a given <Route>: component, render and children.

`component` should be used when you have an existing component that you want to render. `render`, which takes an inline function, should only be used when you have to pass in-scope variables to the component you want to render.
```js
import { Route, Switch } from "react-router-dom";

<Switch>
  <Router exact path="/" component={Home} />
  <Router path="/about"  component={About} />
  {/* Route rendering props */}
  <Route
    path="/about"
    render={props => <About {...props} extra={someVariable} />}
  />

  {/* when none of the above match, <NoMatch> will be rendered */}
  <Rounte component={NoMatch}>
</Switch>
```


<br/>
#### 1.3 Navigation
React Router provides a <Link> component to create links in your application. Wherever you render a <Link>, an anchor `<a>` will be rendered in your application's HTML.
```js
<Link to="/"></Link>

{/* */}
<NavLink to="/react" activeClassName="hurray">
  React
</NavLink>
```

Any time that you want to force navigation, you can render a `<Redirect>`. When a <Redirect> renders, it will navigate using its to prop.
```js
<Redirect to="/login" />
```

### 1. 路由功能
回退功能

### 2. hash路由
### 3. HTML5 History API






### 参考资料
https://juejin.im/post/5ac61da66fb9a028c71eae1b#heading-1
https://github.com/kaola-fed/blog/issues/137
https://juejin.im/post/5b10b46df265da6e2a08a724
https://juejin.im/entry/5751b8cea341310063bc91e9#/



- [React-router文档](https://reacttraining.com/react-router/web/guides/quick-start)
- [React-router中文文档](https://router.happyfe.com/)