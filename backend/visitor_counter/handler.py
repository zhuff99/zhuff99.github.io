"""Visitor counter: atomically increments a single DynamoDB item and returns the new total."""

import json
import os

import boto3

TABLE_NAME = os.environ.get("TABLE_NAME", "")
COUNTER_ID = "site"

_table = None


def get_table():
    global _table
    if _table is None:
        _table = boto3.resource("dynamodb").Table(TABLE_NAME)
    return _table


def lambda_handler(event, context):
    try:
        result = get_table().update_item(
            Key={"id": COUNTER_ID},
            UpdateExpression="ADD visits :one",
            ExpressionAttributeValues={":one": 1},
            ReturnValues="UPDATED_NEW",
        )
        count = int(result["Attributes"]["visits"])
        return _response(200, {"count": count})
    except Exception as exc:  # never leak internals to the browser
        print(f"counter update failed: {exc!r}")
        return _response(500, {"error": "counter unavailable"})


def _response(status, body):
    # CORS headers are handled by API Gateway
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json", "Cache-Control": "no-store"},
        "body": json.dumps(body),
    }
