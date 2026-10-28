import json
import os
import sys
import types
import unittest
from decimal import Decimal
from unittest import mock

# boto3 isn't needed for unit tests; stub it so they run with the standard library only
sys.modules.setdefault("boto3", types.ModuleType("boto3"))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "visitor_counter"))

import handler  # noqa: E402


class VisitorCounterTests(unittest.TestCase):
    def setUp(self):
        self.table = mock.Mock()
        patcher = mock.patch.object(handler, "get_table", return_value=self.table)
        patcher.start()
        self.addCleanup(patcher.stop)

    def test_increments_and_returns_count(self):
        self.table.update_item.return_value = {"Attributes": {"visits": Decimal(42)}}

        res = handler.lambda_handler({}, None)

        self.assertEqual(res["statusCode"], 200)
        self.assertEqual(json.loads(res["body"]), {"count": 42})
        kwargs = self.table.update_item.call_args.kwargs
        self.assertEqual(kwargs["Key"], {"id": "site"})
        self.assertEqual(kwargs["UpdateExpression"], "ADD visits :one")
        self.assertEqual(kwargs["ExpressionAttributeValues"], {":one": 1})

    def test_response_is_not_cached(self):
        self.table.update_item.return_value = {"Attributes": {"visits": Decimal(1)}}
        res = handler.lambda_handler({}, None)
        self.assertEqual(res["headers"]["Cache-Control"], "no-store")

    def test_dynamodb_failure_returns_500_without_details(self):
        self.table.update_item.side_effect = RuntimeError("AccessDenied: arn:aws:dynamodb:...")

        res = handler.lambda_handler({}, None)

        self.assertEqual(res["statusCode"], 500)
        self.assertNotIn("arn:aws", res["body"])


if __name__ == "__main__":
    unittest.main()
