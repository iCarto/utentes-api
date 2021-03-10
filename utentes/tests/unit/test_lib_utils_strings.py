import unittest

from utentes.lib.utils.strings import stringify


class StringsTest(unittest.TestCase):
    def test_strings(self):
        self.assertEqual(stringify("a", "b"), "a / b")
        self.assertEqual(stringify("a", 0), "a / 0")
        self.assertEqual(stringify("a", " "), "a")
        self.assertEqual(stringify("a", None), "a")
        self.assertEqual(stringify(None, None), "")
        self.assertEqual(stringify(None, "b"), " / b")
        self.assertEqual(stringify(None, "b"), " / b")
        self.assertEqual(stringify(None, "b", "0"), " / b / 0")


if __name__ == "__main__":
    unittest.main()
