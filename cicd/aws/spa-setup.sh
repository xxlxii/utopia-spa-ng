#!/bin/bash

readonly GET_REST_API_ID_FAIL=1
readonly GET_REGION_FAIL=2
readonly GET_STAGE_NAME_FAIL=3

function get_rest_api_id() {
   local query="items[?tags.Project=='Utopia'].id"
   local rest_api_ids=$(aws apigateway get-rest-apis --query $query)
   local rest_api_ids_count=$(echo $rest_api_ids | jq 'length')

   if [ $rest_api_ids_count -ne 1 ]; then
      echo "Expected REST APIs: 1. Retrieved: $rest_api_ids_count" >>/dev/stderr
      return $GET_REST_API_ID_FAIL
   fi

   echo $rest_api_ids | jq --raw-output '.[0]'
}

function get_region() {
  local region=$(aws configure get region)

   if [ -z "$region" ]; then
      echo "AWS Region is not configured. Can't continue..." >>/dev/stderr
      return $GET_REGION_FAIL
   fi

   echo $region
}

function get_stage_name() {
   local rest_api_id=$1
   local query="item[?tags.Project=='Utopia'].stageName"
   local stages=$(aws apigateway get-stages --rest-api-id $rest_api_id --query $query)
   local stages_count=$(echo $stages | jq 'length')

   if [ $stages_count -ne 1 ]; then
      echo "Expected REST APIs: 1. Retrieved: $stages_count" >>/dev/stderr
      return $GET_STAGE_NAME_FAIL
   fi

   echo $stages | jq --raw-output '.[0]'
}

function escape() {
   local input=$1

   echo $input | sed -e 's|\\|\\\\|g;s|\/|\\\/|g;s|&|\\\&|g'
}

function configure_environment() {
   local rest_api_id=$1
   local region=$2
   local stage_name=$3
   local invoke_url="https://$rest_api_id.execute-api.$region.amazonaws.com/$stage_name"
   local endpoint="https://api.utopia.com"
   local escaped_invoke_url=$(escape $invoke_url)
   local escaped_endpoint=$(escape $endpoint)
   local base_directory="../../src/environments"
   local configuration="staging"
   local configuration_file="environment.$configuration.ts"
   local template_configuration_file="$base_directory/templates/$configuration_file"
   local generated_configuration_file="$base_directory/$configuration_file"

   sed "s/$escaped_endpoint/$escaped_invoke_url/" $template_configuration_file \
      >$generated_configuration_file
   echo $invoke_url
}

function main() {
   local rest_api_id=$(get_rest_api_id) || exit $?
   local region=$(get_region) || exit $?
   local stage_name=$(get_stage_name $rest_api_id) || exit $?
   local invoke_url=$(configure_environment $rest_api_id $region $stage_name)

   echo "InvokeUrl: $invoke_url"
}

main
