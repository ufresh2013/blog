---
title: React文档
date: 2018-10-25 10:54:32
category: React
---
### 1. Main Concept
Building blocks of React apps: elements and components. Once you master them, you can create complex apps from small reusable pieces.
<br>

#### 1.1 Introducting JSX
JSX produces React "elements".React embraces the fact that rendering logic is inherently coupled with other UI login: how events are handled, how the state changes over time, and how the data is prepared for display.

```
  const name = 'Amy';
  const a = <h1>hello world, { name }</h1>;
  const b = <img src={ user.avatarUrl } />;
```
You can put any vaild Javascript expression inside the curly braces in JSX. For example, `2+2`, `user.firstName`, or `formatName(user)` are all valid Javascript expressions.
<br>

#### 1.2 Rendering Elements
Unlike broswer DOM elements, React elements are plain objects, and are cheap to create. React DOM takes care of updating the DOM to match the React elements.

React DOM compares the element and its children to the previous one, and only applies the DOM updates necessary to bring the DOM to the desired state.
```
  ReactDom.render(<h1>hello!</h1>, document.getElementById('root'))
```
<br>

#### 1.3 Components and Props
Components let you split the UI into independent, reusable pieces, and think about each piece in isolation. Conceptually, components are like Javascript functions. 
```
  // Use an ES6 class to define a component
  Class Welcome extends React.Component{
    render(){
      return <h1>Hello, {this.props.name}</h1>
    }
  }
  
  ReactDOM.render(<Welcome />, document.getElementById(‘root’))
```
Elements can represent user-defined components. When React sees an element representing a user-defined component, if passes JSX attributes to this component as a single object. We call this object as "props".
- We call `ReactDOM.render()` with the `<Welcome name="Sara" />` element.
- React calls the `Welcome` component with `{name: 'Sara'}` as the props.
- Our `Welcome` comonent returns a `<h1>hello, Sara</h1>` element as the result.
- React DOM efficiently updates the DOM to match `<h1>hello, Sara</h1>`
<br>

#### 1.4 State and Lifecycle
State allows React components to change their output over time in response to user actions, network responses, and anything else.
```
  class Clock extends React.Component {
    state = {
      date: '2018-01-02'
    };

    render() {
      return (
        <h2>It is {this.state.date}</h2>
      );
    }
  }
```

**Lifecycle**
- componetDidMount()
- componentWillUnmount()

**Using State Correctly**
- Do Not modify state directly: the only place where you can assign `this.state` is the constructor. Using `this.setState({ comment: 'hello'})`
- State updates may be asynchronous: so you should not rely on their values for calculating the next state.
- State updates are merged
<br>

#### 1.5 Handling Events
React defines these synthetic events（`e`） according to the W3C.
```
  class Clock extends React.Component {
    handleClick = (e) => {
      e.preventDefault();
      console.log('click');
    }

    render() {
      return (
        <div>
          <button onClick={this.handleClick}></button>
          <button onClick={this.handleClick.bind(this, id)}></button>
          <button onClick={(e) => this.handleaClick(id, e)}></button>
        </div>
      );
    }
  }
```
<br>

#### 1.6 Conditinal Rendering
- Inline if with logical && operator
```
    { a.length > 0 && <h1>Show</h1> }
```

- Inline if-else with conditional operator
```
  { a.length > 0 ? 'current' : null }
```
<br>

#### 1.7 Lists and Keys
- Rendering multiple components
Keys helop React identify which items have changed, are added, or are moved. 
```
  {
    [1,2,3,4].map((item, index) => {
        <div key={index}>{item}</div>
    })
  }
```
<br>

#### 1.8 Forms
- Controlled Components
```
  handleChange(event){
    console.log(event.target.value)
  }
  <input type="text" value={this.state.value} onChange={this.handleChange}>
  <select value={this.state.value} onChange={this.handleChange}>
    <option value="grapefruit">Grapefruit</option>
    <option value="lime">Lime</option>
    <option value="coconut">Coconut</option>
    <option value="mango">Mango</option>
  </select>
```
<br>

### 2. Advanced Guides
#### 2.1 Accessibility
<br>

#### 2.2 Code-Splitting
Set up route-based code splitting into your app using `React Router` and `React Loadable`
<br>

#### 2.3 Context
Context is designed to share data that can be considered "global" for a tree of React component, such as the current authenticated user, theme, or preferred language.
```
  // 1. React.createContext
  const {Provider, Consumer} = React.createContext(defaultValue)

  // 2. Provider
  <Provider value={/* some value*/}>

  // 3. Consumer
  <Cosumer>
    { value => /* render something based on the context value */}
  </Cosumer>
```
<br>

#### 2.4 Error Boundaries
Error boundaries are React components that catch Javascript errors anywhere in their component tree, log those errors, and display a fallback UI.
<br>

#### 2.5 Forwarding Refs
Ref forwarding is a technique for automatically passing a ref through a component to one of its children.
```
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```
Here is a step-by-step explanation of what happens in the above example:
- 1. We create a `React ref` by calling `React.createRef` and assign it to a `ref` variable.
- 2. We pass our `ref` down to `<FancyButton ref={ref}>` by specifying it as a JSX attribute.
- 3. React passes the `ref` to the `(props, ref) => ...` function inside `forwardRef` as a second argument.
- 4. We forward this `ref` argument down to `<button ref={ref}>` by specifying it as a JSX attribute.
- 5. When the ref is attached, `ref.current` will point to the `<button>` DOM node.

#### 2.6 Fragments
Fragments let you group a list of children without adding extra nodes to the DOM.
```
  class Columns extends React.Component {
    render() {
      return (
        <React.Fragment>
          <td>Hello</td>
          <td>World</td>
        </React.Fragment>
      )
    }
  }

  // There is a new, shorter syntax you can use for declaring fragments. It looks like empty tags:
  return(
    <>
      <td>Hello</td>
      <td>World</td>
    </>
  )
```

#### 2.7 Higher-Order Components
Concretely, a higher-order component is a function that takes a component and returns a new component. HOCs are common in third-party React libraries, such as Redux's `connect`.

- On mount, add a change listener to `DataSource`.
- Inside the listener, call `setState` whenever the data source changes.
- On unmount, remove the change listener.

You can image that in a large app, this same pattern of subscribing to `DataSource` and calling `setState` will occur over and over again. We want an abstraction that allows us to define this logic in a single place and share it across many components. This is where higher-order components excel.

We can write a function that creates component, like CommentList that subscribe to `DataSource`. The first parameter is the wrapped component. The second parameter retrieves the data we're interested in, given a `DataSource` and the current props.
```
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource, props) => DataSource.getComments(props.id)
)

function withSubscription(WrappedComponent, selectData) {
  return class extends React.Component {
    state {
      data: selectData(DataSource, props)
    }

    componentDidMount() {
      DataSource.addChangeListener(this.handleChange)
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange)
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      })
    }

    render() {
      return <WrappedComponent data={this.state.data} {...this.props}>
    }
  }
}
```

<br/>
#### 2.8 Integrating with Other Libraries
1. Intergrate with DOM Manipulation Plugins, like jQuery. Many jQuery plugins attach event listeners to the DOM so it's important to detach them in componentWillUnmount.
```
class SomePlugin extends React.Component{
  componentDidMount() {
    this.$el = $(this.el);
    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange)
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange)
  }

  handleChange(e) {
    console.log(e.target.value)
  }

  render() {
    return (
      <select ref={el => this.el = el}>
        <option value=1>1</option>
        <option value=2>2</option>
      </select>
    );
  }
}
```

2. React can be embedded into other applications thanks to the flexibility of `ReactDOM.render()`. This lets us write applications in React piece by piece, and combine them with our existing server-generated templates and other client-side code.