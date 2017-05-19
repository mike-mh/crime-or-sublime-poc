#!/bin/bash
# Compiles the entire application or just the front or back end.

EXIT_OK=0
ERROR=1

NODE_MODULES_PATH="./node_modules"
COS_PUBLIC_PATH="dist/public"

SHIM_PATH="$NODE_MODULES_PATH/core-js/client/shim.min.js"
ZONE_PATH="$NODE_MODULES_PATH/zone.js/dist/zone.min.js"
REFLECT_METADATA_PATH="$NODE_MODULES_PATH/reflect-metadata/Reflect.js"
RXJS_PATH="$NODE_MODULES_PATH/rxjs/"

MIN_BOOTSTRAP_URL="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
MIN_BOOTSTRAP_PATH="./bootstrap.min.css"

###############################################################################
# Helper method to extract libraries as needed for the front-end
# Globals:
#   None
# Arguments:
#   Path to library to extract for front-end
# Returns:
#   None
###############################################################################
extract_library ()
{
  if [ -z "$1" ]; then
    printf "A path to a library to extact must be given."
    exit $ERROR
  fi

  echo "Retrieving: $1"

  # Just use recursion, even when it isn't necessarry.
  cp -R $1 $COS_PUBLIC_PATH

  if [ $? -ne $EXIT_OK ]; then
    cleanup
    exit $ERROR
  fi
}


###############################################################################
# Use this to clean up compiled files. Can called if build was or was not
# successful.
# Globals:
#   None
# Arguments:
#   Error
# Returns:
#   None
###############################################################################
cleanup () {
  if [ -e ./compiled_app ]; then
    rm -rf ./compiled_app
  fi

  if [ -e ./src/aot ]; then
    rm -rf ./src/aot
  fi

  find ./src/public -name "*.html" -type f -delete
  find ./src/public -name "*.css" -type f -delete
  find ./src/public -name "*.map.css" -type f -delete
}

###############################################################################
# Use this to build the front end and rollup it into a single javascript file
# and ensures that all necessarry libraries are included in the public
# directory of the app.
# Globals:
#   EXIT_OK
#   ERROR
# Arguments:
#   None
# Returns:
#   None
###############################################################################
build_front_end () {
  grunt

  if [ $? -ne $EXIT_OK ]; then
    echo "Unable to build HTML and CSS files." >&2
    cleanup
    exit $ERROR
  fi

  # Unfortunately I can't make compiler flags in file with tsc so I had to make
  # two different main files to compile the Angular app. Rename them as needed
  # but be sure to revert them to their original names.
  mv ./src/public/app/main.pre.ts ./src/public/app/main.ts

  node_modules/.bin/ngc -p tsconfig-aot.json

  if [ $? -ne $EXIT_OK ]; then
    echo "Could not compile app into factory." >&2
    cleanup
    mv ./src/public/app/main.ts ./src/public/app/main.pre.ts
    exit $ERROR
  fi

  mv ./src/public/app/main.ts ./src/public/app/main.pre.ts
  mv ./src/public/app/main.post.ts ./src/public/app/main.ts

  node_modules/.bin/ngc -p tsconfig-aot.json

  if [ $? -ne $EXIT_OK ]; then
    echo "Could not compile app into bootstraped version." >&2
    cleanup
    mv ./src/public/app/main.ts ./src/public/app/main.post.ts
    exit $ERROR
  fi

  mv ./src/public/app/main.ts ./src/public/app/main.post.ts

  node_modules/.bin/rollup -c rollup-config.js

  if [ $? -ne $EXIT_OK ]; then
    echo "Could not compress application into build.js" >&2
    cleanup
    exit $ERROR
  fi

  extract_library $SHIM_PATH
  extract_library $REFLECT_METADATA_PATH
  extract_library $ZONE_PATH

  echo "Extracting HTML and CSS files..."
  find ./src/public -name \*.html -exec cp {} dist/public \;
  find ./src/public -name \*.css -exec cp {} dist/public \;

  echo "Success. You should now be able"

}

build_front_end

cleanup
