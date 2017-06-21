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

  printf "\033[0;95mExtracting: $1\n"

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
  printf "\033[1;93mDeleting compiled front end javascript files...\n"
  if [ -e ./compiled_app ]; then
    rm -rf ./compiled_app
  fi

  if [ -e ./src/aot ]; then
    rm -rf ./src/aot
  fi

  printf "\033[1;93mDeleting compiled HTML and CSS files...\n"
  find ./src/public -name "*.html" -type f -delete
  find ./src/public -name "*.css" -type f -delete
  find ./src/public -name "*.css.map" -type f -delete
  printf "\033[0;37m"
}

###############################################################################
# Use this to transpile HTML and CSS files only. All files transpiled here are
# then moved to dist/src/public
#   EXIT_OK
#   ERROR
# Arguments:
#   None
# Returns:
#   None
###############################################################################
transpile_html_and_css () {
  printf "\033[1;93mBuilding HTML and CSS files...\n"
  printf "\033[0;37m"
  ./node_modules/.bin/grunt

  if [ $? -ne $EXIT_OK ]; then
    printf "\033[1;91mUnable to build HTML and CSS files.\n" >&2
    printf "\033[0;37m"
    cleanup
    exit $ERROR
  fi

  printf "\033[1;93mExtracting index.html file...\n"
  find ./src/public -name index.html -exec cp {} dist/public \;
}

###############################################################################
# Use this to extract server pug templates
#   EXIT_OK
#   ERROR
# Arguments:
#   None
# Returns:
#   None
###############################################################################
extract_server_views () {
  printf "\033[1;93mExtracting server view templates...\n"
  cp ./src/views/email-templates/registration-email.pug ./dist/src/libs/authentication/

  if [ $? -ne $EXIT_OK ]; then
    printf "\033[1;91mError extracting server view templates.\n" >&2
    printf "\033[0;37m"
    cleanup
    exit $ERROR
  fi

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

  transpile_html_and_css

  printf "\033[1;93mBuilding front end factory...\n"
  # Unfortunately I can't make compiler flags in file with tsc so I had to make
  # two different main files to compile the Angular app. Rename them as needed
  # but be sure to revert them to their original names.
  mv ./src/public/app/main.pre.ts ./src/public/app/main.ts

  node_modules/.bin/ngc -p tsconfig-aot.json

  if [ $? -ne $EXIT_OK ]; then
    printf "\033[1;91mCould not compile app into factory.\n" >&2
    printf "\033[0;37m"
    cleanup
    mv ./src/public/app/main.ts ./src/public/app/main.pre.ts
    exit $ERROR
  fi

  mv ./src/public/app/main.ts ./src/public/app/main.pre.ts
  mv ./src/public/app/main.post.ts ./src/public/app/main.ts

  printf "\033[1;93mBuilding front end application...\n"
  node_modules/.bin/ngc -p tsconfig-aot.json

  if [ $? -ne $EXIT_OK ]; then
    printf "\033[1;91mCould not compile app into bootstraped version.\n" >&2
    printf "\033[0;37m"
    cleanup
    mv ./src/public/app/main.ts ./src/public/app/main.post.ts
    exit $ERROR
  fi

  mv ./src/public/app/main.ts ./src/public/app/main.post.ts

  printf "\033[1;93mTree shaking and compressing front end application...\n"
  printf "\033[0;37m"
  node_modules/.bin/rollup -c rollup-config.js

  if [ $? -ne $EXIT_OK ]; then
    printf "\033[1;91mCould not compress application into build.js\n" >&2
    printf "\033[0;37m"
    cleanup
    exit $ERROR
  fi

  extract_library $SHIM_PATH
  extract_library $REFLECT_METADATA_PATH
  extract_library $ZONE_PATH

}

###############################################################################
# Use this to build the backend.
# Globals:
#   EXIT_OK
#   ERROR
# Arguments:
#   None
# Returns:
#   None
###############################################################################
build_back_end () {
  printf "\n\033[1;93mBuilding CoS back end...\n"
  tsc
  if [ $? -ne $EXIT_OK ]; then
    printf "\033[1;91mError compiling CoS back end.\n\nExiting...\n\n" >&2
    printf "\033[0;37m"
    cleanup
    exit $ERROR
  fi
  extract_server_views
  printf "\033[1;92m\nCoS back end built successfully.\n\n"
}


###############################################################################
# MAIN SEQUENCE
###############################################################################

if [ -z $1 ]; then
  build_front_end
  printf "\033[1;92m\nFront end application built successfully\n\n"
  build_back_end
  printf "\033[1;36m\nRun server with 'node dist/src/main.js'\n"
  printf "\033[1;36mBe sure MongoDB is also running.\n\n"
  printf "\033[0;37m\n"
else
  if [ $1 = "--be" ]; then
    build_back_end
    printf "\033[1;36m\nRun server with 'node dist/src/main.js'\n"
    printf "\033[1;36mBe sure MongoDB is also running.\n\n"
    printf "\033[0;37m\n"
  elif [ $1 = "--fe" ]; then
    build_front_end
    printf "\033[1;92m\nFront end application built successfully\n\n"
    printf "\033[0;37m\n"
  fi
fi

cleanup
