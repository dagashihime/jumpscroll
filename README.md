# example

html
```html
    <div data-jump>Content</div>
    <div data-jump>More Content</div>
```

js
```js
import JumpScroll from 'jumpscroll'

JumpScroll
    .configure({ options: { adjustScrollBehavior: true }})
    .listen()
```

# options

```js
"adjustScrollBehavior"?: boolean
"debug"?: boolean
```