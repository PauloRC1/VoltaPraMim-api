warning: in the working copy of 'package-lock.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/package-lock.json b/package-lock.json[m
[1mindex 1461d59..36c03a2 100644[m
[1m--- a/package-lock.json[m
[1m+++ b/package-lock.json[m
[36m@@ -17,6 +17,7 @@[m
         "bcryptjs": "^3.0.3",[m
         "cors": "^2.8.6",[m
         "dotenv": "^17.3.1",[m
[32m+[m[32m        "expo": "^55.0.11",[m
         "fastify": "^5.8.1",[m
         "jsonwebtoken": "^9.0.3",[m
         "zod": "^4.3.6"[m
[36m@@ -26,1355 +27,7821 @@[m
         "@types/bcryptjs": "^2.4.6",[m
         "@types/jsonwebtoken": "^9.0.10",[m
         "@types/node": "^25.3.3",[m
[32m+[m[32m        "@types/react": "~19.2.10",[m
         "prisma": "^6.19.2",[m
         "tsx": "^4.21.0",[m
         "typescript": "^5.9.3"[m
       }[m
     },[m
[31m-    "node_modules/@esbuild/aix-ppc64": {[m
[31m-      "version": "0.27.3",[m
[31m-      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.27.3.tgz",[m
[31m-      "integrity": "sha512-9fJMTNFTWZMh5qwrBItuziu834eOCUcEqymSH7pY+zoMVEZg3gcPuBNxH1EvfVYe9h0x/Ptw8KBzv7qxb7l8dg==",[m
[31m-      "cpu": [[m
[31m-        "ppc64"[m
[31m-      ],[m
[31m-      "dev": true,[m
[32m+[m[32m    "node_modules/@babel/code-frame": {[m
[32m+[m[32m      "version": "7.29.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-9NhCeYjq9+3uxgdtp20LSiJXJvN0FeCtNGpJxuMFZ1Kv3cWUNb6DOhJwUvcVCzKGR66cw4njwM6hrJLqgOwbcw==",[m
       "license": "MIT",[m
[31m-      "optional": true,[m
[31m-      "os": [[m
[31m-        "aix"[m
[31m-      ],[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/helper-validator-identifier": "^7.28.5",[m
[32m+[m[32m        "js-tokens": "^4.0.0",[m
[32m+[m[32m        "picocolors": "^1.1.1"[m
[32m+[m[32m      },[m
       "engines": {[m
[31m-        "node": ">=18"[m
[32m+[m[32m        "node": ">=6.9.0"[m
       }[m
     },[m
[31m-    "node_modules/@esbuild/android-arm": {[m
[31m-      "version": "0.27.3",[m
[31m-      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.27.3.tgz",[m
[31m-      "integrity": "sha512-i5D1hPY7GIQmXlXhs2w8AWHhenb00+GxjxRncS2ZM7YNVGNfaMxgzSGuO8o8SJzRc/oZwU2bcScvVERk03QhzA==",[m
[31m-      "cpu": [[m
[31m-        "arm"[m
[31m-      ],[m
[31m-      "dev": true,[m
[32m+[m[32m    "node_modules/@babel/compat-data": {[m
[32m+[m[32m      "version": "7.29.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-T1NCJqT/j9+cn8fvkt7jtwbLBfLC/1y1c7NtCeXFRgzGTsafi68MRv8yzkYSapBnFA6L3U2VSc02ciDzoAJhJg==",[m
       "license": "MIT",[m
[31m-      "optional": true,[m
[31m-      "os": [[m
[31m-        "android"[m
[31m-      ],[m
       "engines": {[m
[31m-        "node": ">=18"[m
[32m+[m[32m        "node": ">=6.9.0"[m
       }[m
     },[m
[31m-    "node_modules/@esbuild/android-arm64": {[m
[31m-      "version": "0.27.3",[m
[31m-      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.27.3.tgz",[m
[31m-      "integrity": "sha512-YdghPYUmj/FX2SYKJ0OZxf+iaKgMsKHVPF1MAq/P8WirnSpCStzKJFjOjzsW0QQ7oIAiccHdcqjbHmJxRb/dmg==",[m
[31m-      "cpu": [[m
[31m-        "arm64"[m
[31m-      ],[m
[31m-      "dev": true,[m
[32m+[m[32m    "node_modules/@babel/core": {[m
[32m+[m[32m      "version": "7.29.0",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.0.tgz",[m
[32m+[m[32m      "integrity": "sha512-CGOfOJqWjg2qW/Mb6zNsDm+u5vFQ8DxXfbM09z69p5Z6+mE1ikP2jUXw+j42Pf1XTYED2Rni5f95npYeuwMDQA==",[m
       "license": "MIT",[m
[31m-      "optional": true,[m
[31m-      "os": [[m
[31m-        "android"[m
[31m-      ],[m
[32m+[m[32m      "peer": true,[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/code-frame": "^7.29.0",[m
[32m+[m[32m        "@babel/generator": "^7.29.0",[m
[32m+[m[32m        "@babel/helper-compilation-targets": "^7.28.6",[m
[32m+[m[32m        "@babel/helper-module-transforms": "^7.28.6",[m
[32m+[m[32m        "@babel/helpers": "^7.28.6",[m
[32m+[m[32m        "@babel/parser": "^7.29.0",[m
[32m+[m[32m        "@babel/template": "^7.28.6",[m
[32m+[m[32m        "@babel/traverse": "^7.29.0",[m
[32m+[m[32m        "@babel/types": "^7.29.0",[m
[32m+[m[32m        "@jridgewell/remapping": "^2.3.5",[m
[32m+[m[32m        "convert-source-map": "^2.0.0",[m
[32m+[m[32m        "debug": "^4.1.0",[m
[32m+[m[32m        "gensync": "^1.0.0-beta.2",[m
[32m+[m[32m        "json5": "^2.2.3",[m
[32m+[m[32m        "semver": "^6.3.1"[m
[32m+[m[32m      },[m
       "engines": {[m
[31m-        "node": ">=18"[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "funding": {[m
[32m+[m[32m        "type": "opencollective",[m
[32m+[m[32m        "url": "https://opencollective.com/babel"[m
       }[m
     },[m
[31m-    "node_modules/@esbuild/android-x64": {[m
[31m-      "version": "0.27.3",[m
[31m-      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.27.3.tgz",[m
[31m-      "integrity": "sha512-IN/0BNTkHtk8lkOM8JWAYFg4ORxBkZQf9zXiEOfERX/CzxW3Vg1ewAhU7QSWQpVIzTW+b8Xy+lGzdYXV6UZObQ==",[m
[31m-      "cpu": [[m
[31m-        "x64"[m
[31m-      ],[m
[31m-      "dev": true,[m
[32m+[m[32m    "node_modules/@babel/core/node_modules/semver": {[m
[32m+[m[32m      "version": "6.3.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "bin": {[m
[32m+[m[32m        "semver": "bin/semver.js"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/generator": {[m
[32m+[m[32m      "version": "7.29.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-qsaF+9Qcm2Qv8SRIMMscAvG4O3lJ0F1GuMo5HR/Bp02LopNgnZBC/EkbevHFeGs4ls/oPz9v+Bsmzbkbe+0dUw==",[m
       "license": "MIT",[m
[31m-      "optional": true,[m
[31m-      "os": [[m
[31m-        "android"[m
[31m-      ],[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/parser": "^7.29.0",[m
[32m+[m[32m        "@babel/types": "^7.29.0",[m
[32m+[m[32m        "@jridgewell/gen-mapping": "^0.3.12",[m
[32m+[m[32m        "@jridgewell/trace-mapping": "^0.3.28",[m
[32m+[m[32m        "jsesc": "^3.0.2"[m
[32m+[m[32m      },[m
       "engines": {[m
[31m-        "node": ">=18"[m
[32m+[m[32m        "node": ">=6.9.0"[m
       }[m
     },[m
[31m-    "node_modules/@esbuild/darwin-arm64": {[m
[31m-      "version": "0.27.3",[m
[31m-      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.27.3.tgz",[m
[31m-      "integrity": "sha512-Re491k7ByTVRy0t3EKWajdLIr0gz2kKKfzafkth4Q8A5n1xTHrkqZgLLjFEHVD+AXdUGgQMq+Godfq45mGpCKg==",[m
[31m-      "cpu": [[m
[31m-        "arm64"[m
[31m-      ],[m
[31m-      "dev": true,[m
[32m+[m[32m    "node_modules/@babel/helper-annotate-as-pure": {[m
[32m+[m[32m      "version": "7.27.3",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-annotate-as-pure/-/helper-annotate-as-pure-7.27.3.tgz",[m
[32m+[m[32m      "integrity": "sha512-fXSwMQqitTGeHLBC08Eq5yXz2m37E4pJX1qAU1+2cNedz/ifv/bVXft90VeSav5nFO61EcNgwr0aJxbyPaWBPg==",[m
       "license": "MIT",[m
[31m-      "optional": true,[m
[31m-      "os": [[m
[31m-        "darwin"[m
[31m-      ],[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/types": "^7.27.3"[m
[32m+[m[32m      },[m
       "engines": {[m
[31m-        "node": ">=18"[m
[32m+[m[32m        "node": ">=6.9.0"[m
       }[m
     },[m
[31m-    "node_modules/@esbuild/darwin-x64": {[m
[31m-      "version": "0.27.3",[m
[31m-      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.27.3.tgz",[m
[31m-      "integrity": "sha512-vHk/hA7/1AckjGzRqi6wbo+jaShzRowYip6rt6q7VYEDX4LEy1pZfDpdxCBnGtl+A5zq8iXDcyuxwtv3hNtHFg==",[m
[31m-      "cpu": [[m
[31m-        "x64"[m
[31m-      ],[m
[31m-      "dev": true,[m
[32m+[m[32m    "node_modules/@babel/helper-compilation-targets": {[m
[32m+[m[32m      "version": "7.28.6",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.28.6.tgz",[m
[32m+[m[32m      "integrity": "sha512-JYtls3hqi15fcx5GaSNL7SCTJ2MNmjrkHXg4FSpOA/grxK8KwyZ5bubHsCq8FXCkua6xhuaaBit+3b7+VZRfcA==",[m
       "license": "MIT",[m
[31m-      "optional": true,[m
[31m-      "os": [[m
[31m-        "darwin"[m
[31m-      ],[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/compat-data": "^7.28.6",[m
[32m+[m[32m        "@babel/helper-validator-option": "^7.27.1",[m
[32m+[m[32m        "browserslist": "^4.24.0",[m
[32m+[m[32m        "lru-cache": "^5.1.1",[m
[32m+[m[32m        "semver": "^6.3.1"[m
[32m+[m[32m      },[m
       "engines": {[m
[31m-        "node": ">=18"[m
[32m+[m[32m        "node": ">=6.9.0"[m
       }[m
     },[m
[31m-    "node_modules/@esbuild/freebsd-arm64": {[m
[31m-      "version": "0.27.3",[m
[31m-      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.27.3.tgz",[m
[31m-      "integrity": "sha512-ipTYM2fjt3kQAYOvo6vcxJx3nBYAzPjgTCk7QEgZG8AUO3ydUhvelmhrbOheMnGOlaSFUoHXB6un+A7q4ygY9w==",[m
[31m-      "cpu": [[m
[31m-        "arm64"[m
[31m-      ],[m
[31m-      "dev": true,[m
[32m+[m[32m    "node_modules/@babel/helper-compilation-targets/node_modules/lru-cache": {[m
[32m+[m[32m      "version": "5.1.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "yallist": "^3.0.2"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-compilation-targets/node_modules/semver": {[m
[32m+[m[32m      "version": "6.3.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "bin": {[m
[32m+[m[32m        "semver": "bin/semver.js"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-create-class-features-plugin": {[m
[32m+[m[32m      "version": "7.28.6",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-create-class-features-plugin/-/helper-create-class-features-plugin-7.28.6.tgz",[m
[32m+[m[32m      "integrity": "sha512-dTOdvsjnG3xNT9Y0AUg1wAl38y+4Rl4sf9caSQZOXdNqVn+H+HbbJ4IyyHaIqNR6SW9oJpA/RuRjsjCw2IdIow==",[m
       "license": "MIT",[m
[31m-      "optional": true,[m
[31m-      "os": [[m
[31m-        "freebsd"[m
[31m-      ],[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/helper-annotate-as-pure": "^7.27.3",[m
[32m+[m[32m        "@babel/helper-member-expression-to-functions": "^7.28.5",[m
[32m+[m[32m        "@babel/helper-optimise-call-expression": "^7.27.1",[m
[32m+[m[32m        "@babel/helper-replace-supers": "^7.28.6",[m
[32m+[m[32m        "@babel/helper-skip-transparent-expression-wrappers": "^7.27.1",[m
[32m+[m[32m        "@babel/traverse": "^7.28.6",[m
[32m+[m[32m        "semver": "^6.3.1"[m
[32m+[m[32m      },[m
       "engines": {[m
[31m-        "node": ">=18"[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@babel/core": "^7.0.0"[m
       }[m
     },[m
[31m-    "node_modules/@esbuild/freebsd-x64": {[m
[31m-      "version": "0.27.3",[m
[31m-      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.27.3.tgz",[m
[31m-      "integrity": "sha512-dDk0X87T7mI6U3K9VjWtHOXqwAMJBNN2r7bejDsc+j03SEjtD9HrOl8gVFByeM0aJksoUuUVU9TBaZa2rgj0oA==",[m
[31m-      "cpu": [[m
[31m-        "x64"[m
[31m-      ],[m
[31m-      "dev": true,[m
[32m+[m[32m    "node_modules/@babel/helper-create-class-features-plugin/node_modules/semver": {[m
[32m+[m[32m      "version": "6.3.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "bin": {[m
[32m+[m[32m        "semver": "bin/semver.js"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-create-regexp-features-plugin": {[m
[32m+[m[32m      "version": "7.28.5",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-create-regexp-features-plugin/-/helper-create-regexp-features-plugin-7.28.5.tgz",[m
[32m+[m[32m      "integrity": "sha512-N1EhvLtHzOvj7QQOUCCS3NrPJP8c5W6ZXCHDn7Yialuy1iu4r5EmIYkXlKNqT99Ciw+W0mDqWoR6HWMZlFP3hw==",[m
       "license": "MIT",[m
[31m-      "optional": true,[m
[31m-      "os": [[m
[31m-        "freebsd"[m
[31m-      ],[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/helper-annotate-as-pure": "^7.27.3",[m
[32m+[m[32m        "regexpu-core": "^6.3.1",[m
[32m+[m[32m        "semver": "^6.3.1"[m
[32m+[m[32m      },[m
       "engines": {[m
[31m-        "node": ">=18"[m
[32m+[m[32m        "node": ">=6.9.0"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@babel/core": "^7.0.0"[m
       }[m
     },[m
[31m-    "node_modules/@esbuild/linux-arm": {[m
[31m-      "version": "0.27.3",[m
[31m-      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.27.3.tgz",[m
[31m-      "integrity": "sha512-s6nPv2QkSupJwLYyfS+gwdirm0ukyTFNl3KTgZEAiJDd+iHZcbTPPcWCcRYH+WlNbwChgH2QkE9NSlNrMT8Gfw==",[m
[31m-      "cpu": [[m
[31m-        "arm"[m
[31m-      ],[m
[31m-      "dev": true,[m
[32m+[m[32m    "node_modules/@babel/helper-create-regexp-features-plugin/node_modules/semver": {[m
[32m+[m[32m      "version": "6.3.1",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",[m
[32m+[m[32m      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",[m
[32m+[m[32m      "license": "ISC",[m
[32m+[m[32m      "bin": {[m
[32m+[m[32m        "semver": "bin/semver.js"[m
[32m+[m[32m      }[m
[32m+[m[32m    },[m
[32m+[m[32m    "node_modules/@babel/helper-define-polyfill-provider": {[m
[32m+[m[32m      "version": "0.6.8",[m
[32m+[m[32m      "resolved": "https://registry.npmjs.org/@babel/helper-define-polyfill-provider/-/helper-define-polyfill-provider-0.6.8.tgz",[m
[32m+[m[32m      "integrity": "sha512-47UwBLPpQi1NoWzLuHNjRoHlYXMwIJoBf7MFou6viC/sIHWYygpvr0B6IAyh5sBdA2nr2LPIRww8lfaUVQINBA==",[m
       "license": "MIT",[m
[31m-      "optional": true,[m
[31m-      "os": [[m
[31m-        "linux"[m
[31m-      ],[m
[31m-      "engines": {[m
[31m-        "node": ">=18"[m
[32m+[m[32m      "dependencies": {[m
[32m+[m[32m        "@babel/helper-compilation-targets": "^7.28.6",[m
[32m+[m[32m        "@babel/helper-plugin-utils": "^7.28.6",[m
[32m+[m[32m        "debug": "^4.4.3",[m
[32m+[m[32m        "lodash.debounce": "^4.0.8",[m
[32m+[m[32m        "resolve": "^1.22.11"[m
[32m+[m[32m      },[m
[32m+[m[32m      "peerDependencies": {[m
[32m+[m[32m        "@babel/core": "^7.4.0 || ^8.0.0-0 <8.0.0"[m
       }[m
     },[m
[31m-    "node_modules