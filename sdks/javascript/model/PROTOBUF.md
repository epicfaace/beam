<!--
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->

# Rebuilding generated protobuf code

If you make changes to .proto files, you will need to rebuild the generated JavaScript code.

First, follow this one-time setup:

1. Download [the protobuf compiler](https://github.com/google/protobuf/releases).
   The simplest approach is to download one of the prebuilt binaries and extract
   it somewhere in your machine's `$PATH`.
1. Run `npm install` from `sdks/javascript`.

To generate the code:

1. Navigate to this directory (`sdks/javascript`).
1. `npm run `

This code automatically runs on postinstall, too.