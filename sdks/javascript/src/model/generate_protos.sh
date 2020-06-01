# Path to this plugin
PROTOC_GEN_TS_PATH="../../node_modules/.bin/protoc-gen-ts"

# Path to the grpc_node_plugin
PROTOC_GEN_GRPC_PATH="../../node_modules/.bin/grpc_tools_node_protoc_plugin"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./generated"

rm -rf $OUT_DIR
mkdir -p $OUT_DIR

protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --plugin="protoc-gen-grpc=${PROTOC_GEN_GRPC_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=grpc-node:${OUT_DIR}" \
    --grpc_out="${OUT_DIR}" \
    -I../../../../model/fn-execution/src/main/proto \
    -I../../../../model/interactive/src/main/proto \
    -I../../../../model/pipeline/src/main/proto \
    -I../../../../model/job-management/src/main/proto \
    -I./javascript_sdk.proto \
    ../../../../model/*/src/main/proto/*.proto
