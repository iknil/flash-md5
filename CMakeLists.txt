cmake_minimum_required(VERSION 3.18)
project(flash-md5 C)

set(CMAKE_C_STANDARD 99)
set(CMAKE_EXECUTABLE_SUFFIX .js)
MESSAGE(STATUS "operation system is ${CMAKE_SYSTEM_NAME}")

if(CMAKE_HOST_SYSTEM_NAME MATCHES "Linux" AND CMAKE_HOST_SYSTEM_PROCESSOR MATCHES "x86_64")
else()
    message(FATAL_ERROR "${CMAKE_HOST_SYSTEM_NAME} ${CMAKE_HOST_SYSTEM_PROCESSOR} is not support!")
endif()
include_directories("./extra/openssl/${CMAKE_HOST_SYSTEM_NAME}_${CMAKE_HOST_SYSTEM_PROCESSOR}/include")
link_directories("./extra/openssl/${CMAKE_HOST_SYSTEM_NAME}_${CMAKE_HOST_SYSTEM_PROCESSOR}/lib")
add_executable(flash-md5 ./src/main.c ./src/main.h)
target_link_libraries(flash-md5 libcrypto.a libssl.a)

# debug option
# target_link_options(flash-md5 PUBLIC "SHELL: -g")
# release
target_link_options(flash-md5 PUBLIC "SHELL: -g0 -Oz")
target_link_options(flash-md5 PUBLIC "SHELL: -s EXPORTED_RUNTIME_METHODS='[\"ccall\",\"cwrap\",\"FS\"]'")
target_link_options(flash-md5 PUBLIC "SHELL: --pre-js ${CMAKE_SOURCE_DIR}/src/prefix.js --post-js ${CMAKE_SOURCE_DIR}/src/postfix.js")

target_link_options(flash-md5 PUBLIC "SHELL: -s ALLOW_MEMORY_GROWTH=1 -s ASSERTIONS=1 -s SAFE_HEAP=1 -s DETERMINISTIC=1")