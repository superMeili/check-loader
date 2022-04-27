# check-loader

A webpack loader use to used to identify some information in your project code

You can use it to specify some specifications in your project

# Installation

```
npm install check-loader -D
```

# Examples

## usage with webpack

```js
const webpckConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'check-loader',
            options: {
              check: {
                mode: 'normal',
                rules: /\$store.commit/,
                tip: 'mapMutations is recommended'
              }
            }
          }
        ]
      }
    ]
  }
}
```

If the rules set by the check-loader match, the following effect is displayed

![Image text](https://gitee.com/meiniubi/imgForMd/raw/main/check-loader/check-info.png)

## Can be applied to any file in the WebPack process

```js
const webpckConfig = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'check-loader',
            options: {
              check: {
                mode: 'normal',
                rules: /display\s*:\s*flex\s*;/,
                tip: 'Disable flex layout'
              }
            }
          }
        ]
      },
      {
        test: /\.(js|ts)$/,
        use: [
          'babel-loader',
          {
            loader: 'check-loader',
            options: {
              check: {
                mode: 'normal',
                rules: /\$store.commit/,
                tip: 'mapMutations is recommended'
              }
            }
          }
        ]
      }
    ]
  }
}
```

## strict mode

If the mode attribute in the check configuration item is set to 'strict', the Webpack process will be interrupted and throw an error if the match is successful

```js
const webpckConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'check-loader',
            options: {
              check: {
                mode: 'strict', // use strict mode
                rules: /\$store.commit/,
                tip: 'mapMutations is recommended'
              }
            }
          }
        ]
      }
    ]
  }
}
```

If the rules set by the check-loader match, the following effect is displayed

![Image text](https://gitee.com/meiniubi/imgForMd/raw/main/check-loader/check-strict.png)

## use function

You can set the check option as a function so that you can customize the check rules, not just the regular representation or strings

```js
const webpckConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'check-loader',
            options: {
              check: {
                mode: 'normal',
                rules: function (context) {
                  const bytes = context.length * 2 // The character length is assumed to be 2 bytes // Actually it's not
                  const kb = bytes / 1024
                  if (kb > 512) {
                    return `current context size: ${kb}` // Checked Info
                  }
                },
                tip: 'The file size cannot exceed 512kb'
              }
            }
          }
        ]
      }
    ]
  }
}
```

## multiple check

```js
const webpckConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'check-loader',
            options: {
              check: [
                {
                  mode: 'normal',
                  rules: /\$store.commit/,
                  tip: 'mapMutations is recommended'
                },
                {
                  mode: 'normal',
                  rules: /\$store.dispatch/,
                  tip: 'mapActions is recommended'
                },
                {
                  mode: 'normal',
                  rules: /\$store.state/,
                  tip: 'mapState is recommended'
                }
              ]
            }
          }
        ]
      }
    ]
  }
}
```

# options

Basic options

| name    | use                                       | type                                | default |
| ------- | ----------------------------------------- | ----------------------------------- | ------- |
| check   | Used to match file contents               | string/regexp/function/object/array | []      |
| include | Path of the file to be processed          | string/regexp/array                 | []      |
| exclude | Path to files that do not need processing | string/regexp/array                 | []      |

#### Filter the path

```js
const webpckConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'check-loader',
            options: {
              check: {
                mode: 'normal',
                rules: /\$store.commit/,
                tip: 'mapMutations is recommended'
              },
              // Use these options to filter check paths
              include: [path.resolve(__dirname, 'src')],
              exclude: [path.resolve(__dirname, 'src/test')]
            }
          }
        ]
      }
    ]
  }
}
```

2. This section describes the types of the check option

#### use String

```js
{
  check: 'this.$store.commit'
}
```

#### use Regexp

```js
{
  check: /\$store.commit/
}
```

#### use Function

```js
{
	check: function (context) {
		const bytes = context.length * 2; // The character length is assumed to be 2 bytes // Actually it's not
		const kb = bytes / 1024
		if (kb > 512) {
			return `current context size: ${ kb }` // Checked Info
		}
	}
}
```

#### use Object

```js
{
	check: {
		mode: 'normal',
		rules: /\$store.commit/,
		tip: 'mapMutations is recommended'
	}
}
```

Object Configuration

| name  | use                                           | type                                | default |
| ----- | --------------------------------------------- | ----------------------------------- | ------- |
| mode  | Level of prompt                               | normal or strict                    | normal  |
| rules | rules for check                               | string/regexp/function/object/array | []      |
| tip   | Something that needs to be told to developers | string                              | ''      |

#### use Array

```js
{
  check: [
    'this.$store.dispatch',
    /\$store.commit/,
    function (context) {
      const bytes = context.length * 2 // The character length is assumed to be 2 bytes // Actually it's not
      const kb = bytes / 1024
      if (kb > 512) {
        return `current context size: ${kb}` // Checked Info
      }
    },
    {
      mode: 'normal',
      rules: /\$store.state/,
      tip: 'mapMutations is recommended'
    }
  ]
}
```
