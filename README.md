# universal-env
An NPM module to register and get variable can used in both nodeJS and mini-program

# Install
```bash
npm install uni-envs
```
# Usage
env.js
```typescript
import Envs from 'uni-envs'

/**
 * We recommend you do this to avoid typo
 */
const ENV_KEY_DEBUG = "DEBUG"
const ENV_KEY_DB_URI = "DB_URI"
const ENV_KEY_VERSION = "VERSION"

/**
 * Init Envs
 */
Envs.init()

/**
 * Envs will load from process.env and throw an error if it's not provided.
 * ( We assume DEBUG=True )
 */
Envs.register(ENV_KEY_DEBUG)

// ... and get by this 
// (You can set the `type` option to `"boolean"` to let get() return a boolean)
Envs.get(ENV_KEY_DEBUG)
// > "True"
Envs.getByString(ENV_KEY_DEBUG)
// > "True"
Envs.getByBoolean(ENV_KEY_DEBUG)
// > true

// Uncomment the line below will throw an error because you register the same key twice.
// Envs.register(ENV_KEY_DEBUG)

/**
 * You can also give it a default value to avoid the error
 */
Envs.register(ENV_KEY_DB_URI, "mongo://Some.Default.URI")


// It also support number, boolean and json (json need to set the type)

Envs.register(ENV_KEY_VERSION, 3)
// will auto trans to the number: 3
Envs.get(ENV_KEY_VERSION)
// > 3

Envs.register("JSON", { default: { someJSON: 123 }, type: "json" })
Envs.get("JSON")
// > { someJSON: 123 }
/**
 * It's fine to set different value for different environment.
 * (NODE_ENV = develop / staging / release(production) )
 */
Envs.register("MONGO_DB_URI", { 
  develop: "mongo://Some.Default.URI/develop",
  staging: "mongo://Some.Default.URI/staging",
  release: "mongo://Some.Default.URI/release"
})

// another way to avoid the error
Envs.register("SOMETHING_OPTIONAL", { require: false })

// 
```
